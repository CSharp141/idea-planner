import { ChatMessage } from "./types";

export { buildSystemPrompt } from "./gemini";

export async function streamChatResponse(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  systemPrompt: string
): Promise<string> {
  if (process.env.AI_PROVIDER === "groq") {
    const { streamChatResponse: fn } = await import("./groq-ai");
    return fn(messages, onChunk, systemPrompt);
  }
  const { streamChatResponse: fn } = await import("./gemini");
  return fn(messages, onChunk, systemPrompt);
}

export async function generateSummary(messages: ChatMessage[]): Promise<string> {
  if (process.env.AI_PROVIDER === "groq") {
    const { generateSummary: fn } = await import("./groq-ai");
    return fn(messages);
  }
  const { generateSummary: fn } = await import("./gemini");
  return fn(messages);
}
