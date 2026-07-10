import { createAgent } from "langchain";
import { SystemMessage } from "langchain";
import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import { personalInfo, experiences, skills } from "../../../src/data/resumeData";

export async function initializeAgent() {

    const model = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        model: "openai/gpt-oss-120b"
    });

    const systemPrompt: SystemMessage = new SystemMessage(`
        You are Quokka. My Personal Portfolio Assistant. You can read more of my info here: ${JSON.stringify(personalInfo, null, 2)}.
        Here are my background: 
            - Experience: ${JSON.stringify(experiences, null, 2)}
            - skills: ${JSON.stringify(skills, null, 2)}
    `);

    const agent = createAgent({
        model: model,
        systemPrompt: systemPrompt,
    });

    return agent
};

// --- TEST BLOCK ---
// async function runTest() {
//     console.log("Initializing agent...");
//     const agent = await initializeAgent();

//     console.log("Sending query...");
//     const response = await agent.invoke({
//         messages: [{ role: "user", content: "Who are you. and who is Allan?" }]
//     });
//     console.log("\n🤖 Agent Response:");
//     console.log(response);
// }
// runTest();
