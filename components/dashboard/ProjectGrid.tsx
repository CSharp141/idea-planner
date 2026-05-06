import { ProjectListItem } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { EmptyState } from "@/components/ui/EmptyState";

export function ProjectGrid({ projects }: { projects: ProjectListItem[] }) {
  if (projects.length === 0) {
    return (
      <EmptyState
        title="No ideas yet"
        description="Capture your first idea and let AI help you develop it."
        action={{ label: "New idea", href: "/projects/new" }}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
