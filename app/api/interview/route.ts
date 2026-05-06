import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { OPENING_MESSAGE } from "@/lib/gemini";
import { ChatMessage } from "@/lib/types";

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const { project_id } = await req.json();

  if (!project_id) {
    return NextResponse.json({ error: "project_id is required" }, { status: 400 });
  }

  const firstMessage: ChatMessage = {
    role: "model",
    content: OPENING_MESSAGE,
    ts: new Date().toISOString(),
  };

  const { data: session, error } = await supabase
    .from("interview_sessions")
    .insert({
      project_id,
      messages: [firstMessage],
      status: "active",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    { session_id: session.id, first_message: OPENING_MESSAGE },
    { status: 201 }
  );
}
