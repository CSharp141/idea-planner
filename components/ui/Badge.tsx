import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

export function Badge({ label, onRemove, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
        className
      )}
    >
      #{label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full hover:text-indigo-900 dark:hover:text-indigo-100"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
