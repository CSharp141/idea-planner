-- Run this in the Supabase SQL editor
-- Last updated: reflects multi-user auth migration and analytics_events table

create extension if not exists "uuid-ossp";

-- ============================================================
-- PROJECTS
-- ============================================================
create table public.projects (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  description text,
  github_url  text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ============================================================
-- TAGS
-- ============================================================
create table public.tags (
  id   uuid primary key default uuid_generate_v4(),
  name text not null unique
);

-- ============================================================
-- PROJECT_TAGS
-- ============================================================
create table public.project_tags (
  project_id uuid not null references public.projects(id) on delete cascade,
  tag_id     uuid not null references public.tags(id) on delete cascade,
  primary key (project_id, tag_id)
);

-- ============================================================
-- INTERVIEW_SESSIONS
-- ============================================================
create table public.interview_sessions (
  id         uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  messages   jsonb not null default '[]'::jsonb,
  summary    jsonb,
  status     text not null default 'active'
             check (status in ('active', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger sessions_updated_at
  before update on public.interview_sessions
  for each row execute function public.set_updated_at();

-- ============================================================
-- ANALYTICS EVENTS
-- Added via migration after initial schema creation.
-- All writes go through the service role key (server-side only).
-- ============================================================
create table public.analytics_events (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index analytics_events_user_id_idx on public.analytics_events(user_id);
create index analytics_events_event_name_idx on public.analytics_events(event_name);

-- ============================================================
-- ROW LEVEL SECURITY
-- All access goes through server-side service_role key
-- ============================================================
alter table public.projects enable row level security;
alter table public.tags enable row level security;
alter table public.project_tags enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.analytics_events enable row level security;

create policy "service role full access" on public.projects using (true) with check (true);
create policy "service role full access" on public.tags using (true) with check (true);
create policy "service role full access" on public.project_tags using (true) with check (true);
create policy "service role full access" on public.interview_sessions using (true) with check (true);
create policy "service role full access" on public.analytics_events using (true) with check (true);
