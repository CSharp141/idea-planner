import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { upsertTags } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: pts } = await supabase
    .from("project_tags")
    .select("tags(id, name)")
    .eq("project_id", params.id);

  const tags = (pts ?? [])
    .flatMap((pt: { tags: { id: string; name: string } | { id: string; name: string }[] | null }) => {
      if (!pt.tags) return [];
      return Array.isArray(pt.tags) ? pt.tags : [pt.tags];
    });

  const { data: session } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("project_id", params.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({ ...project, tags, latest_session: session ?? null });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();
  const body = await req.json();
  const { tags, ...fields } = body;

  const updates: Record<string, unknown> = {};
  if (fields.title !== undefined) updates.title = fields.title.trim();
  if (fields.description !== undefined) updates.description = fields.description;
  if (fields.github_url !== undefined) updates.github_url = fields.github_url;
  if (fields.notes !== undefined) updates.notes = fields.notes;

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (Array.isArray(tags)) {
    // Remove all existing tags then re-upsert
    await supabase.from("project_tags").delete().eq("project_id", params.id);
    await upsertTags(supabase, params.id, tags);
  }

  // Return full project
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single();

  const { data: pts } = await supabase
    .from("project_tags")
    .select("tags(id, name)")
    .eq("project_id", params.id);

  const updatedTags = (pts ?? [])
    .flatMap((pt: { tags: { id: string; name: string } | { id: string; name: string }[] | null }) => {
      if (!pt.tags) return [];
      return Array.isArray(pt.tags) ? pt.tags : [pt.tags];
    });

  return NextResponse.json({ ...project, tags: updatedTags });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();
  const { error } = await supabase.from("projects").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
