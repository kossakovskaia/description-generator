import { chat, getOpenAIClient } from "../openai-client";
import { SYSTEM_PROMPT } from "../prompts/jpd-idea-prompts";

export async function generateJpdIdea(idea: string): Promise<string> {
  const client = getOpenAIClient();
  
  if (!client) {
    // Mock mode
    return `This is a mock JPD Idea for: "${idea}".\n\nIt includes a mock Opportunity Statement, Problem Context, Impact, and Desired Outcome, demonstrating the expected format.`;
  }

  return await chat(SYSTEM_PROMPT, idea, "gpt-4o-mini", 0.3);
}
