-- Supabase starter schema for file library MVP.
-- Run in Supabase SQL editor.

begin;

create extension if not exists pgcrypto;

create table if not exists public.file_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default timezone('utc', now()),
  added_by uuid references auth.users(id) on delete set null
);

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  filename text not null check (char_length(filename) > 0),
  mime_type text not null default 'application/octet-stream',
  size_bytes bigint not null default 0 check (size_bytes >= 0),
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  folder_path text not null default '/',
  tags text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  constraint files_delete_consistency
    check (deleted_at is not null or deleted_by is null)
);

create table if not exists public.file_events (
  id bigserial primary key,
  file_id uuid not null references public.files(id) on delete restrict,
  actor_user_id uuid not null references auth.users(id) on delete restrict,
  event_type text not null check (
    event_type in (
      'upload',
      'view',
      'download',
      'update_meta',
      'soft_delete',
      'restore'
    )
  ),
  event_at timestamptz not null default timezone('utc', now()),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_files_owner_deleted
  on public.files (owner_user_id, deleted_at);

create index if not exists idx_file_admins_added_at
  on public.file_admins (added_at desc);

create index if not exists idx_files_folder_path
  on public.files (folder_path);

create index if not exists idx_file_events_file_time
  on public.file_events (file_id, event_at desc);

create index if not exists idx_file_events_actor_time
  on public.file_events (actor_user_id, event_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_files_set_updated_at on public.files;

create trigger trg_files_set_updated_at
before update on public.files
for each row
execute function public.set_updated_at();

commit;
