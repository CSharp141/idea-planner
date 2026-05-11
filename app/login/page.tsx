"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { getSupabaseClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "magic";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100";

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  async function handleOAuth(provider: "google" | "github") {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    if (mode === "magic") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${origin}/auth/callback` },
      });
      setLoading(false);
      if (error) setError(error.message);
      else setInfo("Check your email for the magic link.");
      return;
    }

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) setError(error.message);
      else { router.push("/"); router.refresh(); }
      return;
    }

    // signup
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setInfo("Check your email to confirm your account.");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-8">
        <div className="mb-6 text-center">
          <div className="text-3xl mb-2">💡</div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Idea Planner</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Sign in to your ideas</p>
        </div>

        {/* OAuth buttons */}
        <div className="space-y-2">
          <Button
            variant="secondary"
            className="w-full"
            disabled={loading}
            onClick={() => handleOAuth("google")}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            disabled={loading}
            onClick={() => handleOAuth("github")}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            Continue with GitHub
          </Button>
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 border-t border-zinc-200 dark:border-zinc-700" />
          <span className="text-xs text-zinc-400">or</span>
          <div className="flex-1 border-t border-zinc-200 dark:border-zinc-700" />
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          {mode !== "magic" && (
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          {info && <p className="text-sm text-green-600 dark:text-green-400">{info}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner className="h-4 w-4" /> : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send magic link"}
          </Button>
        </form>

        {/* Mode switchers */}
        <div className="mt-4 flex flex-col gap-1.5 text-center text-xs text-zinc-500 dark:text-zinc-400">
          {mode === "signin" && (
            <>
              <button type="button" className="hover:text-indigo-600" onClick={() => { setMode("signup"); setError(null); setInfo(null); }}>
                No account? Create one
              </button>
              <button type="button" className="hover:text-indigo-600" onClick={() => { setMode("magic"); setError(null); setInfo(null); }}>
                Sign in with magic link instead
              </button>
            </>
          )}
          {mode === "signup" && (
            <button type="button" className="hover:text-indigo-600" onClick={() => { setMode("signin"); setError(null); setInfo(null); }}>
              Already have an account? Sign in
            </button>
          )}
          {mode === "magic" && (
            <button type="button" className="hover:text-indigo-600" onClick={() => { setMode("signin"); setError(null); setInfo(null); }}>
              Use password instead
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
