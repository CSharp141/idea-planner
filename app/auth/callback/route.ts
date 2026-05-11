import { NextRequest, NextResponse } from "next/server";
import { createAuthClient, createAdminClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const supabase = createAuthClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  // Claim any existing projects that have no owner (one-time migration)
  const admin = createAdminClient();
  await admin
    .from("projects")
    .update({ user_id: data.user.id })
    .is("user_id", null);

  return NextResponse.redirect(`${origin}${next}`);
}
