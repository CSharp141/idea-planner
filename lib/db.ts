import { createAdminClient } from "./supabase/server";

export async function upsertTags(
  supabase: ReturnType<typeof createAdminClient>,
  projectId: string,
  tagNames: string[]
) {
  const cleaned = tagNames.map((t: string) => t.trim().toLowerCase()).filter(Boolean);
  if (cleaned.length === 0) return;

  for (const name of cleaned) {
    const { data: tag } = await supabase
      .from("tags")
      .upsert({ name }, { onConflict: "name" })
      .select()
      .single();

    if (tag) {
      await supabase
        .from("project_tags")
        .upsert({ project_id: projectId, tag_id: tag.id }, { onConflict: "project_id,tag_id" });
    }
  }
}
