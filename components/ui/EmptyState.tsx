import Link from "next/link";
import { Plane } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-signal-500/10 ring-1 ring-signal-500/30">
        <Plane className="h-5 w-5 -rotate-45 text-signal-500" aria-hidden="true" />
      </div>
      <h2 className="mb-2 text-lg font-semibold text-ink-800 dark:text-ink-100">{title}</h2>
      <p className="mb-6 max-w-sm text-sm text-ink-500 dark:text-ink-400">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-signal-500 px-4 py-2 text-sm font-medium text-ink-950 hover:bg-signal-600 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
