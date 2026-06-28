"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tag } from "@/lib/types";

export function TagFilterBar({ tags }: { tags: Tag[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("tag");

  function select(name: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (name) {
      params.set("tag", name);
    } else {
      params.delete("tag");
    }
    // Use replace so tag filtering doesn't pollute the browser history stack.
    router.replace(`/?${params.toString()}`);
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
      <button
        type="button"
        onClick={() => select(null)}
        aria-pressed={!active}
        className={cn(
          "rounded-full border px-3 py-1 text-sm transition-colors",
          !active
            ? "border-signal-500 bg-signal-500 text-ink-950"
            : "border-ink-300 text-ink-600 hover:border-signal-400 dark:border-ink-600 dark:text-ink-300"
        )}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag.id}
          type="button"
          onClick={() => select(tag.name)}
          aria-pressed={active === tag.name}
          className={cn(
            "rounded-full border px-3 py-1 text-sm transition-colors",
            active === tag.name
              ? "border-signal-500 bg-signal-500 text-ink-950"
              : "border-ink-300 text-ink-600 hover:border-signal-400 dark:border-ink-600 dark:text-ink-300"
          )}
        >
          #{tag.name}
        </button>
      ))}
    </div>
  );
}
