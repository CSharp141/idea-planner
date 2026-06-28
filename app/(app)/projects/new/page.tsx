import { ProjectForm } from "@/components/forms/ProjectForm";

export const metadata = { title: "New Idea — Preflight" };

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold text-ink-900 dark:text-ink-100">New Idea</h1>
      <ProjectForm mode="create" />
    </div>
  );
}
