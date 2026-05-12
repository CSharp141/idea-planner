import { NextRequest, NextResponse } from "next/server";
import { createAuthClient, createAdminClient } from "@/lib/supabase/server";
import { generateSummary } from "@/lib/ai";
import { InterviewSummary } from "@/lib/types";
import { track } from "@/lib/analytics";

export async function POST(
  _req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { data: { user } } = await createAuthClient().auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();

  const { data: session, error: fetchError } = await supabase
    .from("interview_sessions")
    .select("messages, project_id, projects(user_id)")
    .eq("id", params.sessionId)
    .single();

  if (fetchError || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const project = (session.projects as unknown) as { user_id: string | null } | null;
  if (!project || project.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

  await track(user.id, "interview_completed", {
    project_id: session.project_id,
    session_id: params.sessionId,
    message_count: (session.messages as unknown[]).length,
  });

  return NextResponse.json({ summary });
}
