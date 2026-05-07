import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL = "gemini-2.0-flash";

export function buildSystemPrompt(title: string, description?: string | null): string {
  const contextLines = [`Title: ${title}`];
  if (description) contextLines.push(`Description: ${description}`);

  return `You are a thoughtful product development interviewer.
Your job is to help the user clarify and develop their software project idea through structured conversation.

Project context:
${contextLines.join("\n")}

Use this context to frame your questions — do not ask the user to repeat information already provided above.
Ask one focused question at a time. Do not ask multiple questions in a single message.
Keep your questions concise (1-2 sentences max). Be encouraging but direct.

Work through these topics in order, adapting based on answers:
1. Problem statement — what real problem does this solve, and for whom?
2. Target users — who specifically? How do they currently handle this problem?
3. Core challenge — what is the hardest technical or product challenge?
4. Tech approach — what technologies or architecture are you considering?
5. Timeline — what is a realistic goal for an initial working version?
6. Next concrete step — what is the single first action to take this week?

After covering all main topics (typically 6-8 exchanges), say:
"I think we've covered the key areas! You can click 'Finish Interview' whenever you're ready to generate your project summary."

Do not mention you are an AI. Stay in the interviewer role throughout.`;
}

export const OPENING_MESSAGE =
  "Let's develop your idea together. To start: what problem are you trying to solve with this project, and who runs into that problem?";

export function buildSummaryPrompt(transcript: string): string {
  return `Based on the following interview transcript, generate a structured JSON summary.
Return ONLY valid JSON matching this exact shape, with no markdown, no code fences, no explanation:

{
  "problem_statement": "one clear paragraph",
  "target_users": "one clear paragraph",
  "core_challenge": "one clear paragraph",
  "tech_approach": "one clear paragraph",
  "timeline": "one sentence",
  "next_steps": ["step 1", "step 2", "step 3"],
  "open_questions": ["question 1", "question 2"]
}

TRANSCRIPT:
${transcript}`;
}

export async function streamChatResponse(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  systemPrompt: string
): Promise<string> {
  const contents = messages.map((m) => ({
    role: m.role as "user" | "model",
    parts: [{ text: m.content }],
  }));

  const result = await ai.models.generateContentStream({
    model: MODEL,
    config: { systemInstruction: systemPrompt },
    contents,
  });

  let fullText = "";
  for await (const chunk of result) {
    const text = chunk.text ?? "";
    if (text) {
      fullText += text;
      onChunk(text);
    }
  }
  return fullText;
}

export async function sendInterviewMessage(messages: ChatMessage[], systemPrompt: string): Promise<string> {
  const contents = messages.map((m) => ({
    role: m.role as "user" | "model",
    parts: [{ text: m.content }],
  }));
  const response = await ai.models.generateContent({
    model: MODEL,
    config: { systemInstruction: systemPrompt },
    contents,
  });
  return response.text ?? "";
}

export async function generateSummary(messages: ChatMessage[]): Promise<string> {
  const transcript = messages
    .map((m) => `${m.role === "user" ? "User" : "Interviewer"}: ${m.content}`)
    .join("\n\n");

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ text: buildSummaryPrompt(transcript) }] }],
    config: { responseMimeType: "application/json" },
  });

  return response.text ?? "{}";
}
