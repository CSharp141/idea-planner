"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TagInput } from "./TagInput";

interface ProjectFormProps {
  initial?: {
    id?: string;
    title: string;
    description: string;
    github_url: string;
    tags: string[];
  };
  mode: "create" | "edit";
}

export function ProjectForm({ initial, mode }: ProjectFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [githubUrl, setGithubUrl] = useState(initial?.github_url ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }
    setSaving(true);
    setError("");

    const payload = {
      title,
      description: description || null,
      github_url: githubUrl || null,
      tags,
    };

    const res = await fetch(
      mode === "create" ? "/api/projects" : `/api/projects/${initial?.id}`,
      {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      setSaving(false);
      return;
    }

    const project = await res.json();
    router.refresh();
    router.push(`/projects/${project.id}`);
  }

  const fieldClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100";

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What are you building?"
          className={fieldClass}
          autoFocus
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief overview (optional)"
          rows={3}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Tags
        </label>
        <TagInput value={tags} onChange={setTags} />
        <p className="mt-1 text-xs text-zinc-400">Press Enter or comma to add a tag</p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          GitHub URL
        </label>
        <input
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/username/repo"
          className={fieldClass}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : mode === "create" ? "Create idea" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
