import Link from "next/link";
import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Wrap in a link to this href. Pass null to render the mark only. */
  href?: string | null;
  showWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
}

export function Logo({
  href = "/",
  showWordmark = true,
  className,
  wordmarkClassName,
}: LogoProps) {
  const mark = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-signal-500/15 ring-1 ring-signal-500/30">
        {/* Angled up like takeoff — a deliberate mark, not a stock icon. */}
        <Plane className="h-4 w-4 -rotate-45 text-signal-500" aria-hidden="true" />
      </span>
      {showWordmark && (
        <span className={cn("font-display text-lg font-semibold tracking-tight", wordmarkClassName)}>
          Preflight
        </span>
      )}
    </span>
  );

  if (href === null) return mark;
  return (
    <Link href={href} className="inline-flex items-center" aria-label="Preflight home">
      {mark}
    </Link>
  );
}
