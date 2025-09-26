import "dotenv/config";
import OpenAI from "openai";
import { SYSTEM_PROMPT, USER_PROMPT } from "./product-updates-prompt.js";

const apiKey = process.env.OPENAI_API_KEY;
let client: OpenAI | undefined;

if (apiKey) {
    client = new OpenAI({ apiKey });
} else {
    console.warn("WARNING: The OPENAI_API_KEY environment variable is missing or empty. The application will run in mock mode.");
}

async function chat(system: string, user: string) {
    if (!client) {
        throw new Error("OpenAI client is not initialized.");
    }
    const r = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        temperature: 0.2,
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
    });
    return r.choices[0]?.message?.content?.trim() ?? "";
}

export async function generateProductUpdate(epics: string[]) {
    if (!client) {
        // Mock mode
        return epics.map((epic, i) => `Feature: Mock Feature for Epic ${i + 1}\n\nWhat we did: This is a mock summary for the epic: "${epic.substring(0, 30)}..."\n\nWhy is this work important?: This mock text explains the value of the feature.`).join('\n\n---\n\n');
    }

    const userPrompt = USER_PROMPT(epics);
    return await chat(SYSTEM_PROMPT, userPrompt);
}
