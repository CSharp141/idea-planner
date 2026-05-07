import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { generateOpeningMessage } from "@/lib/ai";
import { ChatMessage } from "@/lib/types";

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const { project_id } = await req.json();

  if (!project_id) {
    return NextResponse.json({ error: "project_id is required" }, { status: 400 });
  }

  const { data: project } = await supabase
    .from("projects")
    .select("title, description")
    .eq("id", project_id)
    .single();

  const openingContent = await generateOpeningMessage(
    project?.title ?? "Untitled project",
    project?.description
  );

  const firstMessage: ChatMessage = {
    role: "model",
    content: openingContent,
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
    { session_id: session.id, first_message: openingContent },
    { status: 201 }
  );
}
