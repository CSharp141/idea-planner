import { createAdminClient } from "@/lib/supabase/server";

type EventName =
  | "app_visited"
  | "project_created"
  | "interview_started"
  | "interview_completed"
  | "summary_viewed";

type Properties = Record<string, string | number | boolean | null>;

export async function track(
  userId: string,
  event: EventName,
  properties: Properties = {}
): Promise<void> {
  try {
    await createAdminClient().from("analytics_events").insert({
      user_id: userId,
      event_name: event,
      properties,
    });
  } catch {
    // Never throw — analytics must not break the app
  }
}
