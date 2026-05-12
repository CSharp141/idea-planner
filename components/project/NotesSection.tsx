"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Pencil, X, Check } from "lucide-react";

interface NotesSectionProps {
  projectId: string;
  initialNotes: string | null;
}

export function NotesSection({ projectId, initialNotes }: NotesSectionProps) {
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [draft, setDraft] = useState(notes);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  async function save() {
    setSaving(true);
    setSaveError(false);
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: draft }),
    });
    setSaving(false);
    if (!res.ok) {
      setSaveError(true);
      return;
    }
    setNotes(draft);
    setEditing(false);
  }

  function cancel() {
    setDraft(notes);
    setEditing(false);
    setSaveError(false);
  }

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Notes
        </h2>
        {!editing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setDraft(notes); setEditing(true); setSaveError(false); }}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={6}
            autoFocus
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 resize-none"
            placeholder="Add your notes here…"
          />
          {saveError && (
            <p className="text-sm text-red-500">Failed to save notes. Please try again.</p>
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={save} disabled={saving}>
              <Check className="h-3.5 w-3.5" />
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button size="sm" variant="ghost" onClick={cancel} disabled={saving}>
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          {notes ? (
            <p className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">{notes}</p>
          ) : (
            <p className="text-sm text-zinc-400 italic">No notes yet. Click Edit to add some.</p>
          )}
        </div>
      )}
    </section>
  );
}
