import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeDate } from "@/lib/utils";
import { ProjectListItem } from "@/lib/types";

export function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col rounded-xl border border-ink-200 bg-white p-5 shadow-sm transition-all hover:border-signal-300 hover:shadow-md dark:border-ink-700 dark:bg-ink-800 dark:hover:border-signal-400"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold text-ink-900 group-hover:text-signal-500 dark:text-ink-100 dark:group-hover:text-signal-400 line-clamp-2">
          {project.title}
        </h2>
        <div className="flex shrink-0 items-center gap-1.5">
          {project.has_summary && (
            <Sparkles className="h-4 w-4 text-amber-500" role="img" aria-label="Has AI summary" />
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {project.description && (
        <p className="mb-3 text-sm text-ink-500 dark:text-ink-400 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        {project.tags.map((tag) => (
          <Badge key={tag.id} label={tag.name} />
        ))}
      </div>

      <p className="mt-3 text-xs text-ink-400 dark:text-ink-500">
        Updated {formatRelativeDate(project.updated_at)}
      </p>
    </Link>
  );
}
