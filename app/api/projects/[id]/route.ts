import { NextRequest, NextResponse } from "next/server";
import { createAuthClient, createAdminClient } from "@/lib/supabase/server";
import { upsertTags } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data: { user } } = await createAuthClient().auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
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
  const { data: { user } } = await createAuthClient().auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const body = await req.json();
  const { tags, ...fields } = body;

  // Validate fields that are being updated
  if (fields.title !== undefined) {
    if (typeof fields.title !== "string" || !fields.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (fields.title.trim().length > 200) {
      return NextResponse.json({ error: "Title must be 200 characters or fewer" }, { status: 400 });
    }
  }
  if (fields.description !== undefined && fields.description != null) {
    if (typeof fields.description !== "string" || fields.description.length > 2000) {
      return NextResponse.json({ error: "Description must be 2000 characters or fewer" }, { status: 400 });
    }
  }
  if (fields.notes !== undefined && fields.notes != null) {
    if (typeof fields.notes !== "string" || fields.notes.length > 50000) {
      return NextResponse.json({ error: "Notes must be 50000 characters or fewer" }, { status: 400 });
    }
  }
  if (tags !== undefined && Array.isArray(tags)) {
    if (tags.length > 20) {
      return NextResponse.json({ error: "A project may have at most 20 tags" }, { status: 400 });
    }
    for (const tag of tags) {
      if (typeof tag !== "string" || tag.trim().length === 0 || tag.trim().length > 50) {
        return NextResponse.json({ error: "Each tag must be between 1 and 50 characters" }, { status: 400 });
      }
    }
  }

  const updates: Record<string, unknown> = {};
  if (fields.title !== undefined) updates.title = fields.title.trim();
  if (fields.description !== undefined) updates.description = fields.description;
  if (fields.github_url !== undefined) {
    if (fields.github_url != null && fields.github_url !== "") {
      try {
        const parsed = new URL(fields.github_url);
        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
          return NextResponse.json({ error: "github_url must be a valid URL" }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ error: "github_url must be a valid URL" }, { status: 400 });
      }
    }
    updates.github_url = fields.github_url || null;
  }
  if (fields.notes !== undefined) updates.notes = fields.notes;

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (error) return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }

  if (Array.isArray(tags)) {
    await supabase.from("project_tags").delete().eq("project_id", params.id);
    await upsertTags(supabase, params.id, tags);
  }

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
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
  const { data: { user } } = await createAuthClient().auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
