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
        "inline-flex items-center gap-1 rounded-full bg-horizon-500/10 px-2.5 py-0.5 text-xs font-medium text-horizon-700 dark:bg-horizon-500/15 dark:text-horizon-300",
        className
      )}
    >
      #{label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full hover:text-horizon-900 dark:hover:text-horizon-100"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
