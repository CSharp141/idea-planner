import { ChatMessage } from "./types";
import { OPENING_MESSAGE } from "./gemini";

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

export async function generateOpeningMessage(title: string, description?: string | null): Promise<string> {
  try {
    if (process.env.AI_PROVIDER === "groq") {
      const { generateOpeningMessage: fn } = await import("./groq-ai");
      return await fn(title, description);
    }
    const { generateOpeningMessage: fn } = await import("./gemini");
    return await fn(title, description);
  } catch {
    return OPENING_MESSAGE;
  }
}
