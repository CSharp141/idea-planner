"use client";

import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";

interface UserNavProps {
  email: string;
}

export function UserNav({ email }: UserNavProps) {
  const router = useRouter();
  const supabase = getSupabaseClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const display = email.length > 24 ? email.slice(0, 22) + "…" : email;

  return (
    <div className="flex items-center gap-3">
      <span className="hidden sm:block text-sm text-zinc-500 dark:text-zinc-400">{display}</span>
      <button
        onClick={signOut}
        className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
