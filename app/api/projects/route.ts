import { NextRequest, NextResponse } from "next/server";
import { createAuthClient, createAdminClient } from "@/lib/supabase/server";
import { upsertTags } from "@/lib/db";
import { Tag } from "@/lib/types";
import { track } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { data: { user } } = await createAuthClient().auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
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
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (projectIds) query = query.in("id", projectIds);

  const { data: projects, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });

  const userProjectIds = (projects ?? []).map((p) => p.id);

  const { data: allPts } = userProjectIds.length
    ? await supabase.from("project_tags").select("project_id, tags(id, name)").in("project_id", userProjectIds)
    : { data: [] };

  const { data: sessions } = userProjectIds.length
    ? await supabase.from("interview_sessions").select("project_id, summary").eq("status", "completed").in("project_id", userProjectIds)
    : { data: [] };

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
  const { data: { user } } = await createAuthClient().auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const body = await req.json();
  const { title, description, github_url, tags = [] } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (typeof title !== "string" || title.trim().length > 200) {
    return NextResponse.json({ error: "Title must be 200 characters or fewer" }, { status: 400 });
  }
  if (description != null && (typeof description !== "string" || description.length > 2000)) {
    return NextResponse.json({ error: "Description must be 2000 characters or fewer" }, { status: 400 });
  }
  if (!Array.isArray(tags) || tags.length > 20) {
    return NextResponse.json({ error: "A project may have at most 20 tags" }, { status: 400 });
  }
  for (const tag of tags) {
    if (typeof tag !== "string" || tag.trim().length === 0 || tag.trim().length > 50) {
      return NextResponse.json({ error: "Each tag must be between 1 and 50 characters" }, { status: 400 });
    }
  }

  if (github_url != null && github_url !== "") {
    try {
      const parsed = new URL(github_url);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        return NextResponse.json({ error: "github_url must be a valid URL" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "github_url must be a valid URL" }, { status: 400 });
    }
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({ title: title.trim(), description, github_url: github_url || null, user_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to create project" }, { status: 500 });

  if (tags.length > 0) {
    await upsertTags(supabase, project.id, tags);
  }

  await track(user.id, "project_created", { project_id: project.id });

  return NextResponse.json(project, { status: 201 });
}
