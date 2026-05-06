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
    router.push(`/?${params.toString()}`);
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => select(null)}
        className={cn(
          "rounded-full border px-3 py-1 text-sm transition-colors",
          !active
            ? "border-indigo-600 bg-indigo-600 text-white"
            : "border-zinc-300 text-zinc-600 hover:border-indigo-400 dark:border-zinc-600 dark:text-zinc-300"
        )}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => select(tag.name)}
          className={cn(
            "rounded-full border px-3 py-1 text-sm transition-colors",
            active === tag.name
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-zinc-300 text-zinc-600 hover:border-indigo-400 dark:border-zinc-600 dark:text-zinc-300"
          )}
        >
          #{tag.name}
        </button>
      ))}
    </div>
  );
}
