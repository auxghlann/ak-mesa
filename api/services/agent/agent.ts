import { StateGraph, MessagesAnnotation, START, END, MemorySaver } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { SystemMessage, RemoveMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import { getExperience, getPersonalInfo, getSkills } from "./tools_portfolio.js"
import { listProjects, getProjectDetails } from "./tools_database.js"

export async function initializeAgent() {

    // 1. Dual Model Initialization
    const toolCallerModel = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        model: "meta-llama/llama-4-scout-17b-16e-instruct"
    });

    const responderModel = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        model: "llama-3.3-70b-versatile"
    });

    // 3. Define Graph Nodes
    async function callAgent(state: typeof MessagesAnnotation.State) {
        const systemPrompt = new SystemMessage(`
You are Quokka and you are Allan's Personal Portfolio Assistant.
Visitors of his porfolio might ask information about him and you will respond politely.
You can answer questions about his experience, skills, and projects and tools are provided to get this informations.

If the user asks about his projects in general, ALWAYS use the list_projects tool first to see what projects are available.
If the user asks about a specific project, ALWAYS use the get_project_details tool using the exact slug you found from list_projects.
        `);
        const messages = [systemPrompt, ...state.messages];
        const response = await modelWithTools.invoke(messages);
        return { messages: [response] };
    }

    const tools = [getExperience, getPersonalInfo, getSkills, listProjects, getProjectDetails];
    const toolNode = new ToolNode(tools);
    const modelWithTools = toolCallerModel.bindTools(tools);

    async function synthesizeResponse(state: typeof MessagesAnnotation.State) {
        const synthesizePrompt = new SystemMessage(`
Synthesize the information from the previous tool calls into a clear, helpful response. 
DO NOT mention the database, SQL queries, or tools directly to the user. Present the information naturally.
            `);

        const messages = [synthesizePrompt, ...state.messages];
        const response = await responderModel.invoke(messages);

        // 4. Token Pruning: Remove all intermediate tool calls from the history!
        const cleanups = [];
        for (const msg of state.messages) {
            if (ToolMessage.isInstance(msg)) {
                if (msg.id) cleanups.push(new RemoveMessage({ id: msg.id }));
            }
            if (AIMessage.isInstance(msg) && (msg as AIMessage).tool_calls && (msg as AIMessage).tool_calls!.length > 0) {
                if (msg.id) cleanups.push(new RemoveMessage({ id: msg.id }));
            }
        }

        return { messages: [...cleanups, response] };
    }

    function shouldContinue(state: typeof MessagesAnnotation.State) {
        const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
        if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
            return "tools";
        }
        // If llama-4 answered directly without tools, just end the turn!
        return END;
    }

    // 5. Build Graph
    const workflow = new StateGraph(MessagesAnnotation)
        .addNode("agent", callAgent)
        .addNode("tools", toolNode)
        .addNode("synthesizeResponse", synthesizeResponse)
        .addEdge(START, "agent")
        .addConditionalEdges("agent", shouldContinue, {
            tools: "tools",
            [END]: END
        })
        .addEdge("tools", "synthesizeResponse") // Route tools directly to 70B for synthesis!
        .addEdge("synthesizeResponse", END);

    const memory = new MemorySaver();
    const app = workflow.compile({ checkpointer: memory });

    return app;
};


