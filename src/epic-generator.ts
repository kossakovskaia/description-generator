import "dotenv/config";
import OpenAI from "openai";
import { SYSTEM_PROMPT, JSON_PROMPT } from "./prompt.js";
import { EpicJSON } from "./schema.js";

const apiKey = process.env.OPENAI_API_KEY;
let client: OpenAI | undefined;

if (apiKey) {
    client = new OpenAI({ apiKey });
} else {
    console.warn("WARNING: The OPENAI_API_KEY environment variable is missing or empty. The application will run in mock mode and will not generate real epics.");
}

async function chat(system: string, user: string, model: string, temperature: number) {
  if (!client) {
      throw new Error("OpenAI client is not initialized. This should not be called in mock mode.");
  }
  const r = await client.chat.completions.create({
    model,
    temperature,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  return r.choices[0]?.message?.content?.trim() ?? "";
}

export interface GenerateEpicOptions {
    idea: string;
    overview: string;
    organizations?: string[];
    environments?: string[];
    json?: boolean;
    model?: string;
    temperature?: number;
}

export async function generateEpic(options: GenerateEpicOptions) {
    if (!client) {
        // Running in mock mode
        const mockEpicText = `This is a mock epic generated for the idea: "${options.idea}".\n\nBecause the OPENAI_API_KEY is not set, this is a placeholder response.`;
        
        if (options.json) {
            return {
                text: mockEpicText,
                json: {
                    title: `Mock Epic for ${options.idea}`,
                    narrative: "As a developer, I want to see a mock response so that I can test the application's UI and data flow without using a real API key.",
                    tasks: [
                        "Create the user interface for displaying epics.",
                        "Implement the server-side logic to handle API requests.",
                        "Add a mock mode for development without an API key."
                    ],
                    acceptance_criteria: [
                        "The application runs without crashing when the API key is not present.",
                        "The UI correctly displays the mock epic text.",
                        "The mock JSON data is correctly parsed and displayed if requested."
                    ]
                }
            };
        }
        return mockEpicText;
    }

    const { 
        idea, 
        overview, 
        organizations = [],
        environments = [],
        json = false, 
        model = process.env.OPENAI_MODEL || "gpt-4.1-mini", 
        temperature = 0.2 
    } = options;

    let userInput = `idea: ${idea}\n\nhigh_level_overview: ${overview}`;

    if (organizations.length > 0) {
        userInput += `\n\nAffected Organizations: ${organizations.join(', ')}`;
    }

    if (environments.length > 0) {
        userInput += `\n\nAffected Environments: ${environments.join(', ')}`;
    }

    // 1) Human-readable epic
    const epicText = await chat(SYSTEM_PROMPT, userInput, model, temperature);

    if (!json) {
        return epicText;
    }

    // 2) JSON guardrail + validation
    const jsonRaw = await chat(JSON_PROMPT, userInput, model, 0);
    let parsed;
    try {
        parsed = JSON.parse(jsonRaw);
    } catch (e) {
        console.error("\n[warn] JSON parse failed; returning text epic only. Raw JSON was:\n", jsonRaw);
        return epicText;
    }

    const validation = EpicJSON.safeParse(parsed);
    if (!validation.success) {
        console.error("\n[warn] JSON validation failed; returning text epic only. Errors:\n", validation.error.flatten());
        return epicText;
    }

    return {
        text: epicText,
        json: validation.data,
    };
}
