import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { upsertTags } from "@/lib/db";
import { Tag } from "@/lib/types";

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const tag = req.nextUrl.searchParams.get("tag");

  let projectIds: string[] | null = null;

  if (tag) {
    const { data: tagRow } = await supabase
      .from("tags")
      .select("id")
      .eq("name", tag)
      .single();

    if (!tagRow) return NextResponse.json([]);

    const { data: pts } = await supabase
      .from("project_tags")
      .select("project_id")
      .eq("tag_id", tagRow.id);

    projectIds = (pts ?? []).map((r: { project_id: string }) => r.project_id);
    if (projectIds.length === 0) return NextResponse.json([]);
  }

  let query = supabase
    .from("projects")
    .select("id, title, description, github_url, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (projectIds) query = query.in("id", projectIds);

  const { data: projects, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: allPts } = await supabase
    .from("project_tags")
    .select("project_id, tags(id, name)");

  const { data: sessions } = await supabase
    .from("interview_sessions")
    .select("project_id, summary")
    .eq("status", "completed");

  const sessionMap = new Map<string, boolean>();
  (sessions ?? []).forEach((s: { project_id: string; summary: unknown }) => {
    if (s.summary) sessionMap.set(s.project_id, true);
  });

  const tagMap = new Map<string, Tag[]>();
  (allPts ?? []).forEach((pt: { project_id: string; tags: Tag | Tag[] | null }) => {
    if (!pt.tags) return;
    const tagList = Array.isArray(pt.tags) ? pt.tags : [pt.tags];
    const existing = tagMap.get(pt.project_id) ?? [];
    tagMap.set(pt.project_id, [...existing, ...tagList]);
  });

  const result = (projects ?? []).map((p) => ({
    ...p,
    tags: tagMap.get(p.id) ?? [],
    has_summary: sessionMap.has(p.id),
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const { title, description, github_url, tags = [] } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({ title: title.trim(), description, github_url })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (tags.length > 0) {
    await upsertTags(supabase, project.id, tags);
  }

  return NextResponse.json(project, { status: 201 });
}
