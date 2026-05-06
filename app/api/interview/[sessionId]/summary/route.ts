import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { generateSummary } from "@/lib/gemini";
import { InterviewSummary } from "@/lib/types";

export async function POST(
  _req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const supabase = createServerClient();

  const { data: session, error: fetchError } = await supabase
    .from("interview_sessions")
    .select("messages")
    .eq("id", params.sessionId)
    .single();

  if (fetchError || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  let summary: InterviewSummary;
  try {
    const raw = await generateSummary(session.messages);
    summary = JSON.parse(raw) as InterviewSummary;
  } catch {
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }

  const { error } = await supabase
    .from("interview_sessions")
    .update({ summary, status: "completed" })
    .eq("id", params.sessionId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ summary });
}
