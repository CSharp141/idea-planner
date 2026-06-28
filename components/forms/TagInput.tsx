"use client";

import { useState, KeyboardEvent, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/lib/types";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ value, onChange }: TagInputProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    fetch("/api/tags")
      .then((r) => r.json())
      .then((tags: Tag[]) => {
        const filtered = tags.filter(
          (t) =>
            t.name.includes(input.toLowerCase()) &&
            !value.includes(t.name)
        );
        setSuggestions(filtered.slice(0, 5));
      });
  }, [input, value]);

  function addTag(name: string) {
    const clean = name.trim().toLowerCase();
    if (clean && !value.includes(clean)) {
      onChange([...value, clean]);
    }
    setInput("");
    setShowSuggestions(false);
  }

  function removeTag(name: string) {
    onChange(value.filter((t) => t !== name));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  return (
    <div
      className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-ink-300 bg-white px-3 py-2 focus-within:border-signal-400 focus-within:ring-1 focus-within:ring-signal-400 dark:border-ink-600 dark:bg-ink-800 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag) => (
        <Badge key={tag} label={tag} onRemove={() => removeTag(tag)} />
      ))}
      <div className="relative flex-1 min-w-24">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={value.length === 0 ? "Add tags…" : ""}
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink-400"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute left-0 top-full z-10 mt-1 w-48 rounded-lg border border-ink-200 bg-white py-1 shadow-lg dark:border-ink-700 dark:bg-ink-900">
            {suggestions.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onMouseDown={() => addTag(s.name)}
                  className="w-full px-3 py-1.5 text-left text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800"
                >
                  #{s.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
