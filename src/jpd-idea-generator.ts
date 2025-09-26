import "dotenv/config";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./jpd-idea-prompt.js";

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
        temperature: 0.3,
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
    });
    return r.choices[0]?.message?.content?.trim() ?? "";
}

export async function generateJpdIdea(idea: string) {
    if (!client) {
        // Mock mode
        return `This is a mock JPD Idea for: "${idea}".\n\nIt includes a mock Opportunity Statement, Problem Context, Impact, and Desired Outcome, demonstrating the expected format.`;
    }

    return await chat(SYSTEM_PROMPT, idea);
}
