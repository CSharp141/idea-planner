import { Plane, GitBranch, Sparkles, Search, Plus } from "lucide-react";

/**
 * Faithful, lightweight recreations of the real product surfaces, framed in a
 * browser chrome. Replaces placeholder gradient boxes with something that
 * actually shows the UI.
 */
export function BrowserFrame({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-2xl shadow-black/40">
      {/* chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-ink-950/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
        <div className="ml-3 flex flex-1 items-center gap-1.5 rounded-md bg-ink-800/70 px-2.5 py-1 text-[10px] text-ink-500">
          <Plane className="h-3 w-3 -rotate-45 text-signal-500/70" aria-hidden="true" />
          <span className="font-mono">preflight.app{path}</span>
        </div>
      </div>
      <div className="bg-ink-950 p-4">{children}</div>
    </div>
  );
}

export function InterviewMock() {
  return (
    <BrowserFrame path="/projects/realtime-collab">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] font-medium text-horizon-400">AI</span>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-ink-800 px-3 py-2 text-xs leading-relaxed text-ink-200">
            Who specifically is going to use this, and why would they pick it over a notes app?
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-[10px] font-medium text-ink-500">You</span>
          <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-signal-500 px-3 py-2 text-xs leading-relaxed text-ink-950">
            Developers who want structure without the overhead of a full PM tool.
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] font-medium text-horizon-400">AI</span>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-ink-800 px-3 py-2 text-xs leading-relaxed text-ink-200">
            What&apos;s the one part you&apos;re least confident about?
            <span className="ml-0.5 inline-block h-3 w-1 translate-y-0.5 animate-pulse bg-horizon-400" />
          </div>
        </div>
        <div className="mt-1 flex items-center gap-2 rounded-lg border border-white/10 bg-ink-900 px-3 py-2">
          <span className="flex-1 text-[11px] text-ink-500">Type your answer…</span>
          <span className="rounded-md bg-signal-500 px-2 py-1 text-[10px] font-semibold text-ink-950">Send</span>
        </div>
      </div>
    </BrowserFrame>
  );
}

const CARDS = [
  { title: "Realtime collab editor", tags: ["saas", "ws"], summary: true },
  { title: "CLI for changelogs", tags: ["devtool"], summary: false },
  { title: "Habit tracker for makers", tags: ["mobile"], summary: true },
  { title: "Invoice parser API", tags: ["api", "ai"], summary: false },
];

export function DashboardMock() {
  return (
    <BrowserFrame path="/dashboard">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-ink-100">Your ideas</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-signal-500 px-2 py-1 text-[10px] font-semibold text-ink-950">
            <Plus className="h-3 w-3" aria-hidden="true" /> New idea
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-ink-900 px-2.5 py-1.5">
          <Search className="h-3 w-3 text-ink-500" aria-hidden="true" />
          <span className="text-[11px] text-ink-500">Filter by tag…</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {CARDS.map((c) => (
            <div key={c.title} className="flex flex-col gap-2 rounded-lg border border-white/10 bg-ink-900 p-2.5">
              <div className="flex items-start justify-between gap-1">
                <span className="text-[11px] font-medium leading-tight text-ink-100">{c.title}</span>
                {c.summary && <Sparkles className="h-3 w-3 shrink-0 text-signal-500" aria-hidden="true" />}
              </div>
              <div className="flex flex-wrap gap-1">
                {c.tags.map((t) => (
                  <span key={t} className="rounded-full bg-horizon-500/10 px-1.5 py-0.5 text-[9px] font-medium text-horizon-300">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

export function GithubMock() {
  return (
    <BrowserFrame path="/projects/realtime-collab">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-ink-100">Realtime collab editor</span>
          <Sparkles className="h-3.5 w-3.5 text-signal-500" aria-hidden="true" />
        </div>
        <p className="text-[11px] leading-relaxed text-ink-400">
          A collaborative editor with presence and conflict-free sync, aimed at small product teams.
        </p>
        <div className="flex flex-wrap gap-1">
          {["saas", "websockets", "crdt"].map((t) => (
            <span key={t} className="rounded-full bg-horizon-500/10 px-2 py-0.5 text-[9px] font-medium text-horizon-300">
              #{t}
            </span>
          ))}
        </div>
        <a className="flex items-center gap-2 rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-[11px] text-ink-200">
          <GitBranch className="h-3.5 w-3.5 text-ink-300" aria-hidden="true" />
          <span className="font-mono text-ink-300">github.com/you/realtime-collab</span>
          <span className="ml-auto text-horizon-400">Open ↗</span>
        </a>
      </div>
    </BrowserFrame>
  );
}
