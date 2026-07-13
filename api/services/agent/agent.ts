import "dotenv/config"
import { StateGraph, MessagesAnnotation, START, END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { SystemMessage, RemoveMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import { getExperience, getPersonalInfo, getSkills, getEducation, getCertifications } from "./tools_portfolio.js"
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
You can answer questions about his experience, education, skills, and projects and tools are provided to get this informations.

If asked about Allan in general, you MUST use all available tools (get_personal_info, get_experience, get_skills, get_education, get_certifications) to gather comprehensive information, except for the project tools.
If the user makes a specific request about Allan, infer the query and decide which specific tool(s) to use.
If the user asks about his projects in general, ALWAYS use the list_projects tool first to see what projects are available.
If the user asks about a specific project, ALWAYS use the get_project_details tool using the exact slug you found from list_projects.

CRITICAL: You are exclusively designed to answer questions about Allan. If the user asks irrelevant queries that are outside this scope (e.g., "what is the weather", "write a poem", "how do I code X", etc.), you MUST refuse to answer and politely provide a generic response stating that you can only answer questions related to Allan's portfolio and professional background.
        `);
        const messages = [systemPrompt, ...state.messages];
        const response = await modelWithTools.invoke(messages);
        return { messages: [response] };
    }

    const tools = [getExperience, getPersonalInfo, getSkills, getEducation, getCertifications, listProjects, getProjectDetails];
    const toolNode = new ToolNode(tools);
    const modelWithTools = toolCallerModel.bindTools(tools);

    async function synthesizeResponse(state: typeof MessagesAnnotation.State) {
        const synthesizePrompt = new SystemMessage(`
You are Quokka, Allan's friendly AI Assistant. Your goal is to synthesize the information from the tools into a natural, conversational, and highly engaging response.

IMPORTANT RULES:
1. Be Conversational: Talk naturally as Quokka. Do NOT just dump raw lists or act like a static resume page. Weave the facts into a pleasant, human-like conversation.
2. Answer the Prompt: Only provide the information the user actually asked for. Don't dump Allan's entire portfolio if they only asked a specific question.
3. Use Markdown Elegantly: Use **bold text** for emphasis on key technologies, degrees, or names. Use bullet points if you need to list multiple items (e.g., education history, skills, projects, certificates, experiences).
4. DO NOT mention server side functionalties (e.g, tools, databases, or JSON data, etc.) to the user.
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

    const app = workflow.compile();

    return app;
};


