import Link from "next/link";
import { Plus } from "lucide-react";
import { createAuthClient } from "@/lib/supabase/server";
import { UserNav } from "@/components/ui/UserNav";
import { Logo } from "@/components/ui/Logo";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const {
    data: { user },
  } = await createAuthClient().auth.getUser();

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <nav className="sticky top-0 z-40 border-b border-ink-200 bg-white/80 backdrop-blur dark:border-ink-800 dark:bg-ink-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Logo href="/dashboard" wordmarkClassName="text-ink-900 dark:text-ink-100" />
          {user && (
            <div className="flex items-center gap-3">
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-1.5 rounded-lg bg-signal-500 px-3 py-1.5 text-sm font-medium text-ink-950 hover:bg-signal-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                New idea
              </Link>
              <UserNav email={user.email ?? ""} />
            </div>
          )}
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
