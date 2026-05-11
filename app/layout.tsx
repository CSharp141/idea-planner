import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createAuthClient } from "@/lib/supabase/server";
import { UserNav } from "@/components/ui/UserNav";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Idea Planner",
  description: "Capture and develop your project ideas",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: { user } } = await createAuthClient().auth.getUser();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased min-h-screen bg-zinc-50 dark:bg-zinc-950`}>
        <nav className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <span className="text-xl">💡</span>
              Idea Planner
            </Link>
            {user && (
              <div className="flex items-center gap-3">
                <Link
                  href="/projects/new"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  New idea
                </Link>
                <UserNav email={user.email ?? ""} />
              </div>
            )}
          </div>
        </nav>
        <main className="mx-auto max-w-5xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
