import { NextRequest, NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase/server";
import { track } from "@/lib/analytics";

const CLIENT_EVENTS = ["summary_viewed"] as const;
type ClientEvent = (typeof CLIENT_EVENTS)[number];

export async function POST(req: NextRequest) {
  const { data: { user } } = await createAuthClient().auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const { event, properties } = await req.json();
  if (!CLIENT_EVENTS.includes(event as ClientEvent)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await track(user.id, event as ClientEvent, properties ?? {});
  return NextResponse.json({ ok: true });
}
