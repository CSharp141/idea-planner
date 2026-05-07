import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { streamChatResponse, buildSystemPrompt } from "@/lib/ai";
import { ChatMessage } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const supabase = createServerClient();
  const { content } = await req.json();

  const { data: session, error: fetchError } = await supabase
    .from("interview_sessions")
    .select("messages, project_id, projects(title, description)")
    .eq("id", params.sessionId)
    .single();

  if (fetchError || !session) {
    return new Response(JSON.stringify({ error: "Session not found" }), { status: 404 });
  }

  const project = (session.projects as unknown) as { title: string; description: string | null } | null;
  const systemPrompt = project
    ? buildSystemPrompt(project.title, project.description)
    : buildSystemPrompt("Untitled project");

  const userMsg: ChatMessage = {
    role: "user",
    content,
    ts: new Date().toISOString(),
  };
  const messagesWithUser: ChatMessage[] = [...session.messages, userMsg];

  await supabase
    .from("interview_sessions")
    .update({ messages: messagesWithUser })
    .eq("id", params.sessionId);

  const encoder = new TextEncoder();
  let assembledResponse = "";

  const readable = new ReadableStream({
    async start(controller) {
      try {
        await streamChatResponse(messagesWithUser, (chunk) => {
          assembledResponse += chunk;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        }, systemPrompt);

        const modelMsg: ChatMessage = {
          role: "model",
          content: assembledResponse,
          ts: new Date().toISOString(),
        };

        await supabase
          .from("interview_sessions")
          .update({ messages: [...messagesWithUser, modelMsg] })
          .eq("id", params.sessionId);

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Stream error";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
