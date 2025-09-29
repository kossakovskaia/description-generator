import { chat, getOpenAIClient } from "../openai-client";
import { SYSTEM_PROMPT, USER_PROMPT } from "../prompts/product-updates-prompts";

export async function generateProductUpdate(epics: string[]): Promise<string> {
  const client = getOpenAIClient();
  
  if (!client) {
    // Mock mode
    return epics
      .map(
        (epic, i) =>
          `Feature: Mock Feature for Epic ${i + 1}\n\nWhat we did: This is a mock summary for the epic: "${epic.substring(0, 30)}..."\n\nWhy is this work important?: This mock text explains the value of the feature.`
      )
      .join("\n\n---\n\n");
  }

  const userPrompt = USER_PROMPT(epics);
  return await chat(SYSTEM_PROMPT, userPrompt, "gpt-4o-mini", 0.2);
}
