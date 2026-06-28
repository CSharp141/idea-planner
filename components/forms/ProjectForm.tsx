"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
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
      setError(data.error ?? "Couldn't save this idea — check the fields and try again.");
      setSaving(false);
      return;
    }

    const project = await res.json();
    router.refresh();
    router.push(`/projects/${project.id}`);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What are you building?"
          autoFocus
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">
          Description
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief overview (optional)"
          rows={3}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">
          Tags
        </label>
        <TagInput value={tags} onChange={setTags} />
        <p className="mt-1 text-xs text-ink-400">Press Enter or comma to add a tag</p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">
          GitHub URL
        </label>
        <Input
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/username/repo"
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
