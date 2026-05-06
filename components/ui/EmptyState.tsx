import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 text-5xl">💡</div>
      <h2 className="mb-2 text-lg font-semibold text-zinc-800 dark:text-zinc-100">{title}</h2>
      <p className="mb-6 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
