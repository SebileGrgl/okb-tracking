-- ─────────────────────────────────────────────────────────────────────────────
-- OKB Takip — Supabase Schema
-- Supabase Dashboard > SQL Editor'de çalıştır
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Profiles ─────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  display_name         text,
  created_at           timestamptz default now(),
  onboarding_completed boolean     default false
);

alter table profiles enable row level security;

drop policy if exists "profiles: own row" on profiles;
create policy "profiles: own row" on profiles
  using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Tags ─────────────────────────────────────────────────────────────────────
create table if not exists tags (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  type       text not null check (type in ('trigger', 'obsession', 'compulsion')),
  label      text not null,
  created_at timestamptz default now(),
  unique (user_id, type, label)
);

create index if not exists tags_user_type on tags (user_id, type);

alter table tags enable row level security;
drop policy if exists "tags: own rows" on tags;
create policy "tags: own rows" on tags
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Records ──────────────────────────────────────────────────────────────────
create table if not exists records (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) on delete cascade,
  created_at          timestamptz default now(),
  anxiety_level       integer check (anxiety_level between 1 and 10),
  obsession_note      text,
  trigger_tag_ids     uuid[] default '{}',
  obsession_tag_ids   uuid[] default '{}',
  compulsion_tag_ids  uuid[] default '{}'
);

create index if not exists records_user_created on records (user_id, created_at desc);

alter table records enable row level security;
drop policy if exists "records: own rows" on records;
create policy "records: own rows" on records
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Crisis Logs ───────────────────────────────────────────────────────────────
create table if not exists crisis_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  created_at  timestamptz default now(),
  resolved_at timestamptz,
  note        text
);

create index if not exists crisis_logs_user_created on crisis_logs (user_id, created_at desc);

alter table crisis_logs enable row level security;
drop policy if exists "crisis_logs: own rows" on crisis_logs;
create policy "crisis_logs: own rows" on crisis_logs
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Emergency Contacts ────────────────────────────────────────────────────────
create table if not exists emergency_contacts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  name       text not null,
  phone      text not null,
  relation   text,
  created_at timestamptz default now()
);

alter table emergency_contacts enable row level security;
drop policy if exists "emergency_contacts: own rows" on emergency_contacts;
create policy "emergency_contacts: own rows" on emergency_contacts
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Quotes ───────────────────────────────────────────────────────────────────
create table if not exists quotes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  text       text not null,
  created_at timestamptz default now()
);

alter table quotes enable row level security;
drop policy if exists "quotes: own rows" on quotes;
create policy "quotes: own rows" on quotes
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Activities ────────────────────────────────────────────────────────────────
create table if not exists activities (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  label       text not null,
  icon        text,
  usage_count integer default 0,
  created_at  timestamptz default now()
);

alter table activities enable row level security;
drop policy if exists "activities: own rows" on activities;
create policy "activities: own rows" on activities
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Checklists ───────────────────────────────────────────────────────────────
create table if not exists checklists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  title      text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table checklists enable row level security;
drop policy if exists "checklists: own rows" on checklists;
create policy "checklists: own rows" on checklists
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Checklist Items ───────────────────────────────────────────────────────────
create table if not exists checklist_items (
  id           uuid primary key default gen_random_uuid(),
  checklist_id uuid references checklists(id) on delete cascade,
  label        text not null,
  position     integer default 0,
  created_at   timestamptz default now()
);

create index if not exists checklist_items_list on checklist_items (checklist_id, position);

alter table checklist_items enable row level security;
drop policy if exists "checklist_items: via owner" on checklist_items;
create policy "checklist_items: via owner" on checklist_items
  using (
    exists (
      select 1 from checklists c
      where c.id = checklist_id and c.user_id = auth.uid()
    )
  );

-- ── Checklist Completions ─────────────────────────────────────────────────────
create table if not exists checklist_completions (
  id               uuid primary key default gen_random_uuid(),
  checklist_id     uuid references checklists(id) on delete cascade,
  user_id          uuid references auth.users(id) on delete cascade,
  completed_at     timestamptz default now(),
  items_completed  integer,
  items_total      integer
);

create index if not exists completions_list on checklist_completions (checklist_id, completed_at desc);

alter table checklist_completions enable row level security;
drop policy if exists "completions: own rows" on checklist_completions;
create policy "completions: own rows" on checklist_completions
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
