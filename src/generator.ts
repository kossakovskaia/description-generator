import "dotenv/config";
import OpenAI from "openai";

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
        temperature: 0.5,
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
    });
    return r.choices[0]?.message?.content?.trim() ?? "";
}

export interface GenerateUpdateOptions {
    idea: string;
    organizations: string[];
    environments: string[];
}

export async function generateUpdate(options: GenerateUpdateOptions) {
    const { idea, organizations, environments } = options;

    if (!client) {
        // Mock mode
        let mockResponse = `This is a mock product update for the idea: "${idea}".\n\n`;
        if (organizations.length > 0) {
            mockResponse += `It affects the following organizations: ${organizations.join(', ')}.\n`;
        }
        if (environments.length > 0) {
            mockResponse += `It should be deployed to these environments: ${environments.join(', ')}.\n`;
        }
        return mockResponse;
    }

    const systemPrompt = `You are an expert product manager. Your task is to write a clear and concise product update description based on the provided information. The description should be ready to be shared internally.`;
    
    let userPrompt = `Product Update Idea: ${idea}\n\n`;
    if (organizations.length > 0) {
        userPrompt += `Affected Organizations: ${organizations.join(', ')}\n`;
    }
    if (environments.length > 0) {
        userPrompt += `Affected Environments: ${environments.join(', ')}\n`;
    }

    return await chat(systemPrompt, userPrompt);
}
