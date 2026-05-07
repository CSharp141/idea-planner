"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Pencil, Trash2, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { NotesSection } from "@/components/project/NotesSection";
import { InterviewSummaryPanel } from "@/components/project/InterviewSummaryPanel";
import { TranscriptViewer } from "@/components/project/TranscriptViewer";
import { InterviewModal } from "@/components/interview/InterviewModal";
import { formatRelativeDate } from "@/lib/utils";
import { Project } from "@/lib/types";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetch(`/api/projects/${params.id}`);
    if (!res.ok) { router.push("/"); return; }
    setProject(await res.json());
    setLoading(false);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [params.id]);

  async function deleteProject() {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/projects/${params.id}`, { method: "DELETE" });
    router.refresh();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!project) return null;

  const session = project.latest_session;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <div className="mb-1 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
            {project.title}
          </h1>
          <div className="flex shrink-0 items-center gap-2">
            <Link href={`/projects/${project.id}/edit`}>
              <Button variant="ghost" size="sm">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={deleteProject} disabled={deleting}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {project.description && (
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">{project.description}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag.id} label={tag.name} />
          ))}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              GitHub
            </a>
          )}
        </div>

        <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
          Updated {formatRelativeDate(project.updated_at)}
        </p>
      </div>

      {/* AI Interview button */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">AI Interview</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {session?.status === "completed"
                ? "Interview complete — summary saved below"
                : "Chat with AI to develop this idea"}
            </p>
          </div>
          <Button onClick={() => setInterviewOpen(true)}>
            <MessageSquare className="h-4 w-4" />
            {session ? "New interview" : "Start interview"}
          </Button>
        </div>
      </div>

      {/* AI Summary */}
      {session?.summary && <InterviewSummaryPanel summary={session.summary} />}

      {/* Transcript */}
      {session?.messages && session.messages.length > 0 && (
        <TranscriptViewer messages={session.messages} />
      )}

      {/* Notes */}
      <NotesSection projectId={project.id} initialNotes={project.notes} />

      <InterviewModal
        projectId={project.id}
        open={interviewOpen}
        onClose={() => {
          setInterviewOpen(false);
          load();
        }}
      />
    </div>
  );
}
