import Groq from "groq-sdk";
import { ChatMessage } from "./types";
import { buildSummaryPrompt } from "./gemini";

let _client: Groq | null = null;
function getClient(): Groq {
  if (!_client) _client = new Groq({ apiKey: process.env.GROQ_API_KEY! });
  return _client;
}

const MODEL = "llama-3.3-70b-versatile";

export async function streamChatResponse(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  systemPrompt: string
): Promise<string> {
  const stream = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: (m.role === "model" ? "assistant" : "user") as "assistant" | "user",
        content: m.content,
      })),
    ],
    stream: true,
  });

  let fullText = "";
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content ?? "";
    if (text) {
      fullText += text;
      onChunk(text);
    }
  }
  return fullText;
}

export async function generateSummary(messages: ChatMessage[]): Promise<string> {
  const transcript = messages
    .map((m) => `${m.role === "user" ? "User" : "Interviewer"}: ${m.content}`)
    .join("\n\n");

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: buildSummaryPrompt(transcript) }],
    response_format: { type: "json_object" },
  });

  return response.choices[0]?.message?.content ?? "{}";
}
