import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
let client: OpenAI | undefined;

if (apiKey) {
  client = new OpenAI({ apiKey });
}

export function getOpenAIClient(): OpenAI | undefined {
  return client;
}

export async function chat(
  system: string,
  user: string,
  model: string = "gpt-4o-mini",
  temperature: number = 0.5
): Promise<string> {
  if (!client) {
    throw new Error("OpenAI client is not initialized. Please set OPENAI_API_KEY environment variable.");
  }

  const response = await client.chat.completions.create({
    model,
    temperature,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return response.choices[0]?.message?.content?.trim() ?? "";
}
