import { createServerClient } from "./supabase/server";
import { upsertTags } from "./db";
import { generateSummary, sendInterviewMessage, buildSystemPrompt } from "./gemini";
import { generateOpeningMessage } from "./ai";
import { ChatMessage, InterviewSummary, Tag } from "./types";

export interface McpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export const TOOLS: McpTool[] = [
  {
    name: "list_projects",
    description: "List all idea planner projects with id, title, description, tags, and whether they have an interview summary.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_project",
    description: "Get full project details including notes, github_url, tags, and the latest interview summary.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: { type: "string", description: "Project UUID" },
      },
      required: ["project_id"],
    },
  },
  {
    name: "create_project",
    description: "Create a new project idea.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        github_url: { type: "string" },
        tags: { type: "array", items: { type: "string" } },
      },
      required: ["title"],
    },
  },
  {
    name: "update_project",
    description: "Update one or more fields on a project. Pass only the fields you want to change. Use this to write notes.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: { type: "string", description: "Project UUID" },
        title: { type: "string" },
        description: { type: "string" },
        github_url: { type: "string" },
        notes: { type: "string", description: "Free-form notes about the project. Replaces existing notes." },
        tags: { type: "array", items: { type: "string" }, description: "Full list of tags. Replaces existing tags." },
      },
      required: ["project_id"],
    },
  },
  {
    name: "start_interview",
    description: "Start an AI interview session for a project. Returns the session_id and the first question to answer.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: { type: "string", description: "Project UUID" },
      },
      required: ["project_id"],
    },
  },
  {
    name: "send_message",
    description: "Send a message in an active interview session and get the AI interviewer's next response.",
    inputSchema: {
      type: "object",
      properties: {
        session_id: { type: "string", description: "Interview session UUID" },
        message: { type: "string", description: "Your answer or message to the interviewer" },
      },
      required: ["session_id", "message"],
    },
  },
  {
    name: "complete_interview",
    description: "Generate and save a structured summary for a completed interview session.",
    inputSchema: {
      type: "object",
      properties: {
        session_id: { type: "string", description: "Interview session UUID" },
      },
      required: ["session_id"],
    },
  },
  {
    name: "get_interview_summary",
    description: "Get the latest completed interview summary for a project.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: { type: "string", description: "Project UUID" },
      },
      required: ["project_id"],
    },
  },
];

type ToolArgs = Record<string, unknown>;

function text(value: unknown): { content: Array<{ type: "text"; text: string }> } {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] };
}

function err(message: string): { isError: true; content: Array<{ type: "text"; text: string }> } {
  return { isError: true, content: [{ type: "text", text: message }] };
}

export async function callTool(name: string, args: ToolArgs) {
  const supabase = createServerClient();

  switch (name) {
    case "list_projects": {
      const { data: projects, error } = await supabase
        .from("projects")
        .select("id, title, description, github_url, created_at, updated_at")
        .order("updated_at", { ascending: false });

      if (error) return err(error.message);

      const { data: allPts } = await supabase
        .from("project_tags")
        .select("project_id, tags(id, name)");

      const { data: sessions } = await supabase
        .from("interview_sessions")
        .select("project_id, summary")
        .eq("status", "completed");

      const sessionMap = new Map<string, boolean>();
      (sessions ?? []).forEach((s: { project_id: string; summary: unknown }) => {
        if (s.summary) sessionMap.set(s.project_id, true);
      });

      const tagMap = new Map<string, Tag[]>();
      (allPts ?? []).forEach((pt: { project_id: string; tags: Tag | Tag[] | null }) => {
        if (!pt.tags) return;
        const tagList = Array.isArray(pt.tags) ? pt.tags : [pt.tags];
        const existing = tagMap.get(pt.project_id) ?? [];
        tagMap.set(pt.project_id, [...existing, ...tagList]);
      });

      const result = (projects ?? []).map((p) => ({
        ...p,
        tags: tagMap.get(p.id) ?? [],
        has_summary: sessionMap.has(p.id),
      }));

      return text(result);
    }

    case "get_project": {
      const project_id = args.project_id as string;

      const { data: project, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", project_id)
        .single();

      if (error || !project) return err("Project not found");

      const { data: pts } = await supabase
        .from("project_tags")
        .select("tags(id, name)")
        .eq("project_id", project_id);

      const tags = (pts ?? []).flatMap(
        (pt: { tags: Tag | Tag[] | null }) => {
          if (!pt.tags) return [];
          return Array.isArray(pt.tags) ? pt.tags : [pt.tags];
        }
      );

      const { data: session } = await supabase
        .from("interview_sessions")
        .select("id, summary, status, created_at, updated_at")
        .eq("project_id", project_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return text({ ...project, tags, latest_session: session ?? null });
    }

    case "create_project": {
      const { title, description, github_url, tags } = args as {
        title: string;
        description?: string;
        github_url?: string;
        tags?: string[];
      };

      if (!title?.trim()) return err("title is required");

      const { data: project, error } = await supabase
        .from("projects")
        .insert({ title: title.trim(), description, github_url })
        .select()
        .single();

      if (error) return err(error.message);

      if (tags && tags.length > 0) {
        await upsertTags(supabase, project.id, tags);
      }

      return text(project);
    }

    case "update_project": {
      const { project_id, tags, ...fields } = args as {
        project_id: string;
        title?: string;
        description?: string;
        github_url?: string;
        notes?: string;
        tags?: string[];
      };

      const updates: Record<string, unknown> = {};
      if (fields.title !== undefined) updates.title = fields.title.trim();
      if (fields.description !== undefined) updates.description = fields.description;
      if (fields.github_url !== undefined) updates.github_url = fields.github_url;
      if (fields.notes !== undefined) updates.notes = fields.notes;

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from("projects")
          .update(updates)
          .eq("id", project_id);

        if (error) return err(error.message);
      }

      if (Array.isArray(tags)) {
        await supabase.from("project_tags").delete().eq("project_id", project_id);
        await upsertTags(supabase, project_id, tags);
      }

      const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", project_id)
        .single();

      return text({ updated: true, project });
    }

    case "start_interview": {
      const project_id = args.project_id as string;

      const { data: project } = await supabase
        .from("projects")
        .select("title, description")
        .eq("id", project_id)
        .single();

      const openingContent = await generateOpeningMessage(
        project?.title ?? "Untitled project",
        project?.description
      );

      const firstMessage: ChatMessage = {
        role: "model",
        content: openingContent,
        ts: new Date().toISOString(),
      };

      const { data: session, error } = await supabase
        .from("interview_sessions")
        .insert({ project_id, messages: [firstMessage], status: "active" })
        .select()
        .single();

      if (error) return err(error.message);

      return text({ session_id: session.id, first_message: openingContent });
    }

    case "send_message": {
      const { session_id, message } = args as { session_id: string; message: string };

      const { data: session, error: fetchError } = await supabase
        .from("interview_sessions")
        .select("messages, projects(title, description)")
        .eq("id", session_id)
        .single();

      if (fetchError || !session) return err("Session not found");

      const sessionProject = (session.projects as unknown) as { title: string; description: string | null } | null;
      const systemPrompt = sessionProject
        ? buildSystemPrompt(sessionProject.title, sessionProject.description)
        : buildSystemPrompt("Untitled project");

      const userMsg: ChatMessage = {
        role: "user",
        content: message,
        ts: new Date().toISOString(),
      };
      const messagesWithUser: ChatMessage[] = [...session.messages, userMsg];

      let aiResponse: string;
      try {
        aiResponse = await sendInterviewMessage(messagesWithUser, systemPrompt);
      } catch (e) {
        return err(e instanceof Error ? e.message : "Gemini error");
      }

      const modelMsg: ChatMessage = {
        role: "model",
        content: aiResponse,
        ts: new Date().toISOString(),
      };

      await supabase
        .from("interview_sessions")
        .update({ messages: [...messagesWithUser, modelMsg] })
        .eq("id", session_id);

      return text({ response: aiResponse });
    }

    case "complete_interview": {
      const session_id = args.session_id as string;

      const { data: session, error: fetchError } = await supabase
        .from("interview_sessions")
        .select("messages")
        .eq("id", session_id)
        .single();

      if (fetchError || !session) return err("Session not found");

      let summary: InterviewSummary;
      try {
        const raw = await generateSummary(session.messages);
        summary = JSON.parse(raw) as InterviewSummary;
      } catch {
        return err("Failed to generate summary");
      }

      const { error } = await supabase
        .from("interview_sessions")
        .update({ summary, status: "completed" })
        .eq("id", session_id);

      if (error) return err(error.message);

      return text({ summary });
    }

    case "get_interview_summary": {
      const project_id = args.project_id as string;

      const { data: session } = await supabase
        .from("interview_sessions")
        .select("id, summary, created_at")
        .eq("project_id", project_id)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!session || !session.summary) {
        return text({ summary: null, message: "No completed interview summary found for this project." });
      }

      return text({ session_id: session.id, summary: session.summary });
    }

    default:
      return err(`Unknown tool: ${name}`);
  }
}
