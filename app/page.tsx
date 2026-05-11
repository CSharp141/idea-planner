import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createAuthClient, createAdminClient } from "@/lib/supabase/server";
import { ProjectGrid } from "@/components/dashboard/ProjectGrid";
import { TagFilterBar } from "@/components/dashboard/TagFilterBar";
import { ProjectListItem, Tag } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getProjects(userId: string, tag?: string): Promise<ProjectListItem[]> {
  const supabase = createAdminClient();

  let projectIds: string[] | null = null;

  if (tag) {
    const { data: tagRow } = await supabase
      .from("tags")
      .select("id")
      .eq("name", tag)
      .single();

    if (!tagRow) return [];

    const { data: pts } = await supabase
      .from("project_tags")
      .select("project_id")
      .eq("tag_id", tagRow.id);

    projectIds = (pts ?? []).map((r: { project_id: string }) => r.project_id);
    if (projectIds.length === 0) return [];
  }

  let query = supabase
    .from("projects")
    .select("id, title, description, github_url, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (projectIds) query = query.in("id", projectIds);

  const { data: projects } = await query;
  if (!projects) return [];

  const userProjectIds = projects.map((p) => p.id);

  const [{ data: allPts }, { data: sessions }] = await Promise.all([
    userProjectIds.length
      ? supabase.from("project_tags").select("project_id, tags(id, name)").in("project_id", userProjectIds)
      : Promise.resolve({ data: [] }),
    userProjectIds.length
      ? supabase.from("interview_sessions").select("project_id, summary").eq("status", "completed").in("project_id", userProjectIds)
      : Promise.resolve({ data: [] }),
  ]);

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

  return projects.map((p) => ({
    ...p,
    tags: tagMap.get(p.id) ?? [],
    has_summary: sessionMap.has(p.id),
  }));
}

async function getTags(): Promise<Tag[]> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("tags").select("id, name").order("name");
  return data ?? [];
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const { data: { user } } = await createAuthClient().auth.getUser();
  if (!user) redirect("/login");

  const [projects, tags] = await Promise.all([
    getProjects(user.id, searchParams.tag),
    getTags(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">My Ideas</h1>
        <span className="text-sm text-zinc-500">{projects.length} project{projects.length !== 1 ? "s" : ""}</span>
      </div>

      <Suspense>
        <TagFilterBar tags={tags} />
      </Suspense>

      <ProjectGrid projects={projects} />
    </div>
  );
}
