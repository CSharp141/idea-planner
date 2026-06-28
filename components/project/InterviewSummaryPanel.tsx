import { InterviewSummary } from "@/lib/types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
        {label}
      </dt>
      <dd className="text-sm text-ink-700 dark:text-ink-300">{value}</dd>
    </div>
  );
}

function ListRow({ label, items }: { label: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
        {label}
      </dt>
      <dd>
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-ink-700 dark:text-ink-300">
              <span className="mt-0.5 shrink-0 text-horizon-500">•</span>
              {item}
            </li>
          ))}
        </ul>
      </dd>
    </div>
  );
}

export function InterviewSummaryPanel({ summary }: { summary: InterviewSummary }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
        AI Summary
      </h2>
      <div className="rounded-xl border border-horizon-200 bg-horizon-50/60 p-5 dark:border-horizon-900 dark:bg-horizon-950/30">
        <dl className="space-y-4">
          <Row label="Problem" value={summary.problem_statement} />
          <Row label="Target Users" value={summary.target_users} />
          <Row label="Core Challenge" value={summary.core_challenge} />
          <Row label="Tech Approach" value={summary.tech_approach} />
          <Row label="Timeline" value={summary.timeline} />
          <ListRow label="Next Steps" items={summary.next_steps} />
          <ListRow label="Open Questions" items={summary.open_questions} />
        </dl>
      </div>
    </section>
  );
}
