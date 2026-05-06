export interface Tag {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  github_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  latest_session: InterviewSession | null;
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
  ts: string;
}

export interface InterviewSummary {
  problem_statement: string;
  target_users: string;
  core_challenge: string;
  tech_approach: string;
  timeline: string;
  next_steps: string[];
  open_questions: string[];
}

export interface InterviewSession {
  id: string;
  project_id: string;
  messages: ChatMessage[];
  summary: InterviewSummary | null;
  status: "active" | "completed";
  created_at: string;
  updated_at: string;
}

export type ProjectListItem = Pick<
  Project,
  "id" | "title" | "description" | "github_url" | "created_at" | "updated_at" | "tags"
> & {
  has_summary: boolean;
};
