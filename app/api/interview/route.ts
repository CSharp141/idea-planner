import { NextRequest, NextResponse } from "next/server";
import { createAuthClient, createAdminClient } from "@/lib/supabase/server";
import { generateOpeningMessage } from "@/lib/ai";
import { ChatMessage } from "@/lib/types";
import { track } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  const { data: { user } } = await createAuthClient().auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { project_id } = await req.json();

  if (!project_id) {
    return NextResponse.json({ error: "project_id is required" }, { status: 400 });
  }

  const { data: project } = await supabase
    .from("projects")
    .select("title, description")
    .eq("id", project_id)
    .eq("user_id", user.id)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Return the existing active session rather than spawning a new AI call each time
  const { data: existingSession } = await supabase
    .from("interview_sessions")
    .select("id, messages")
    .eq("project_id", project_id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingSession) {
    const messages = existingSession.messages as ChatMessage[];
    const firstModelMsg = messages.find((m) => m.role === "model");
    return NextResponse.json(
      { session_id: existingSession.id, first_message: firstModelMsg?.content ?? "" },
      { status: 200 }
    );
  }

  const openingContent = await generateOpeningMessage(
    project.title ?? "Untitled project",
    project.description
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

  if (error) return NextResponse.json({ error: "Failed to create interview session" }, { status: 500 });

  await track(user.id, "interview_started", { project_id, session_id: session.id });

  return NextResponse.json(
    { session_id: session.id, first_message: openingContent },
    { status: 201 }
  );
}
