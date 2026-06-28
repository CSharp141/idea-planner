import { ProjectListItem } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { EmptyState } from "@/components/ui/EmptyState";

export function ProjectGrid({ projects }: { projects: ProjectListItem[] }) {
  if (projects.length === 0) {
    return (
      <EmptyState
        title="Nothing on the runway yet"
        description="Add your first idea and run a preflight check on it before you start building."
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
