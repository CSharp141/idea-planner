"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TranscriptViewer({ messages }: { messages: ChatMessage[] }) {
  const [open, setOpen] = useState(false);

  if (!messages?.length) return null;

  return (
    <section>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-ink-200 bg-white px-4 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200 dark:hover:bg-ink-700"
      >
        <span>Interview transcript ({messages.length} messages)</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {open && (
        <div className="mt-2 space-y-2 rounded-lg border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-800">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-xl px-3 py-2 text-sm",
                  msg.role === "user"
                    ? "bg-signal-500 text-ink-950"
                    : "bg-ink-100 text-ink-800 dark:bg-ink-700 dark:text-ink-200"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
