import { NextRequest, NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase/server";
import { track } from "@/lib/analytics";

const CLIENT_EVENTS = ["summary_viewed"] as const;
type ClientEvent = (typeof CLIENT_EVENTS)[number];

// Max serialised byte size for the entire properties object
const MAX_PROPERTIES_BYTES = 2048;

function sanitiseProperties(raw: unknown): Record<string, string | number | boolean | null> | null {
  if (raw == null) return {};
  if (typeof raw !== "object" || Array.isArray(raw)) return null;

  const obj = raw as Record<string, unknown>;
  const result: Record<string, string | number | boolean | null> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      result[key] = value;
    }
    // silently drop non-scalar values (arrays, nested objects) rather than rejecting the whole request
  }

  if (JSON.stringify(result).length > MAX_PROPERTIES_BYTES) return null;
  return result;
}

export async function POST(req: NextRequest) {
  const { data: { user } } = await createAuthClient().auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await req.json();
  const { event } = body;

  if (!CLIENT_EVENTS.includes(event as ClientEvent)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const properties = sanitiseProperties(body.properties);
  if (properties === null) {
    return NextResponse.json({ ok: false, error: "invalid properties" }, { status: 400 });
  }

  await track(user.id, event as ClientEvent, properties);
  return NextResponse.json({ ok: true });
}
