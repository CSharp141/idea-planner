import { NextRequest, NextResponse } from "next/server";
import { createAuthClient, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const { data: { user } } = await createAuthClient().auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();

  // Return only the tags that belong to this user's projects, not the global tag
  // set (which would expose other users' tag names).
  const { data: userProjects } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user.id);

  const projectIds = (userProjects ?? []).map((p: { id: string }) => p.id);

  if (projectIds.length === 0) {
    return NextResponse.json([]);
  }

  const { data: pts } = await supabase
    .from("project_tags")
    .select("tags(id, name)")
    .in("project_id", projectIds);

  // Deduplicate by tag id
  const seen = new Set<string>();
  const tags: { id: string; name: string }[] = [];
  for (const pt of pts ?? []) {
    const tag = pt.tags as unknown as { id: string; name: string } | null;
    if (tag && !seen.has(tag.id)) {
      seen.add(tag.id);
      tags.push(tag);
    }
  }

  tags.sort((a, b) => a.name.localeCompare(b.name));
  return NextResponse.json(tags);
}

export async function POST(req: NextRequest) {
  const { data: { user } } = await createAuthClient().auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { name } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (typeof name !== "string" || name.trim().length > 50) {
    return NextResponse.json({ error: "Tag name must be 50 characters or fewer" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tags")
    .upsert({ name: name.trim().toLowerCase() }, { onConflict: "name" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
