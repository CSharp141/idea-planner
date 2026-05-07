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

export async function generateOpeningMessage(title: string, description?: string | null): Promise<string> {
  const projectContext = description
    ? `Title: ${title}\nDescription: ${description}`
    : `Title: ${title}`;

  const prompt = `You are about to interview a developer about their project idea. Write the opening message for the interview.

Requirements:
- Start with one sentence that interprets what this project is trying to do (don't just restate the title or description — show you've understood it)
- Then ask exactly 2 focused questions
- First question: dig into the core problem and who specifically has it
- Second question: probe what they think will be the hardest part to get right (technical or product)
- 3–4 sentences total, tight and direct
- Tone: curious and peer-to-peer, like a product-minded engineer — not corporate or enthusiastic
- No filler openers ("Great!", "Exciting!", "Sounds interesting!" etc.)
- Do not mention being an AI

Project:
${projectContext}`;

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0]?.message?.content?.trim() ?? "";
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
