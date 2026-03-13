-- CUBER Phase 0 — Supabase Schema
-- Run this in the Supabase SQL editor

-- Co-founders who can comment and approve
create table if not exists cofounders (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  approved boolean default false,
  approved_at timestamptz,
  created_at timestamptz default now()
);

-- Per-section comments
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  section_id text not null,
  cofounder_id uuid references cofounders(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Approval actions (log)
create table if not exists approval_actions (
  id uuid default gen_random_uuid() primary key,
  cofounder_id uuid references cofounders(id) on delete cascade,
  action text not null check (action in ('approved', 'changes_requested')),
  note text,
  created_at timestamptz default now()
);

-- Task anything conversations (anonymous, no auth required)
create table if not exists conversations (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  messages jsonb not null default '[]'::jsonb,
  brief_generated boolean default false,
  brief_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable realtime
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table cofounders;
alter publication supabase_realtime add table approval_actions;

-- Row Level Security

-- Cofounders: anyone can read, only service role can write
alter table cofounders enable row level security;
create policy "Public read cofounders" on cofounders for select using (true);

-- Comments: anyone can read, cofounders can insert
alter table comments enable row level security;
create policy "Public read comments" on comments for select using (true);
create policy "Cofounders insert comments" on comments for insert with check (true);

-- Approval actions: anyone can read, cofounders can insert
alter table approval_actions enable row level security;
create policy "Public read approvals" on approval_actions for select using (true);
create policy "Cofounders insert approvals" on approval_actions for insert with check (true);

-- Conversations: public insert and read (anonymous)
alter table conversations enable row level security;
create policy "Public read conversations" on conversations for select using (true);
create policy "Public insert conversations" on conversations for insert with check (true);
create policy "Public update conversations" on conversations for update using (true);
