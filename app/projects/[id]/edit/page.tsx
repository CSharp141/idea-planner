"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { Spinner } from "@/components/ui/Spinner";

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<{
    id: string;
    title: string;
    description: string;
    github_url: string;
    tags: { name: string }[];
  } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load project");
        return r.json();
      })
      .then(setProject)
      .catch(() => setError(true));
  }, [params.id]);

  if (error) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center">
        <p className="text-sm text-red-500">Failed to load project. Please go back and try again.</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Edit Idea</h1>
      <ProjectForm
        mode="edit"
        initial={{
          id: project.id,
          title: project.title,
          description: project.description ?? "",
          github_url: project.github_url ?? "",
          tags: project.tags.map((t) => t.name),
        }}
      />
    </div>
  );
}
