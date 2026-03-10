-- Supabase Row Level Security policies for file library MVP.
-- Apply after schema creation.

begin;

alter table public.file_admins enable row level security;
alter table public.files enable row level security;
alter table public.file_events enable row level security;

-- Cleanup old policy names from earlier drafts.
drop policy if exists files_select_own on public.files;
drop policy if exists files_insert_own on public.files;
drop policy if exists files_update_own on public.files;
drop policy if exists file_events_select_owner on public.file_events;
drop policy if exists file_events_insert_actor on public.file_events;

-- FILE ADMINS TABLE
-- Users can only see their own admin membership row.
drop policy if exists file_admins_select_own on public.file_admins;
create policy file_admins_select_own
on public.file_admins
for select
using (user_id = auth.uid());

-- No insert/update/delete policy here on purpose.
-- Manage admin allowlist from SQL editor with privileged role.

-- FILES: any authenticated user can read active (non-deleted) files.
drop policy if exists files_select_authenticated on public.files;
create policy files_select_authenticated
on public.files
for select
using (
  auth.role() = 'authenticated'
  and (
    deleted_at is null
    or exists (
      select 1
      from public.file_admins fa
      where fa.user_id = auth.uid()
    )
  )
);

-- Only listed admins can upload (insert).
drop policy if exists files_insert_admin on public.files;
create policy files_insert_admin
on public.files
for insert
with check (
  exists (
    select 1
    from public.file_admins fa
    where fa.user_id = auth.uid()
  )
  and owner_user_id = auth.uid()
  and deleted_at is null
  and deleted_by is null
);

-- Only listed admins can update metadata and soft delete/restore.
drop policy if exists files_update_admin on public.files;
create policy files_update_admin
on public.files
for update
using (
  exists (
    select 1
    from public.file_admins fa
    where fa.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.file_admins fa
    where fa.user_id = auth.uid()
  )
);

-- No delete policy on purpose: UI path should use soft delete (update), not hard delete.

-- FILE EVENTS: append-only audit log.
-- Any authenticated user can read events for active files.
drop policy if exists file_events_select_authenticated on public.file_events;
create policy file_events_select_authenticated
on public.file_events
for select
using (
  auth.role() = 'authenticated'
  and exists (
    select 1
    from public.files f
    where f.id = file_events.file_id
      and (
        f.deleted_at is null
        or exists (
          select 1
          from public.file_admins fa
          where fa.user_id = auth.uid()
        )
      )
  )
);

-- Any authenticated user can log view/download for active files.
drop policy if exists file_events_insert_viewer on public.file_events;
create policy file_events_insert_viewer
on public.file_events
for insert
with check (
  auth.role() = 'authenticated'
  and actor_user_id = auth.uid()
  and event_type in ('view', 'download')
  and exists (
    select 1
    from public.files f
    where f.id = file_events.file_id
      and f.deleted_at is null
  )
);

-- Only admins can log upload/update/delete/restore events.
drop policy if exists file_events_insert_admin_actions on public.file_events;
create policy file_events_insert_admin_actions
on public.file_events
for insert
with check (
  actor_user_id = auth.uid()
  and event_type in ('upload', 'update_meta', 'soft_delete', 'restore')
  and
  exists (
    select 1
    from public.file_admins fa
    where fa.user_id = auth.uid()
  )
);

-- No update/delete policy on purpose: keep audit log append-only.

-- STORAGE OBJECT POLICIES (bucket: library-files)
alter table storage.objects enable row level security;

drop policy if exists storage_library_read_authenticated on storage.objects;
create policy storage_library_read_authenticated
on storage.objects
for select
using (
  bucket_id = 'library-files'
  and auth.role() = 'authenticated'
  and exists (
    select 1
    from public.files f
    where f.storage_path = storage.objects.name
      and (
        f.deleted_at is null
        or exists (
          select 1
          from public.file_admins fa
          where fa.user_id = auth.uid()
        )
      )
  )
);

drop policy if exists storage_library_insert_admin on storage.objects;
create policy storage_library_insert_admin
on storage.objects
for insert
with check (
  bucket_id = 'library-files'
  and exists (
    select 1
    from public.file_admins fa
    where fa.user_id = auth.uid()
  )
);

drop policy if exists storage_library_update_admin on storage.objects;
create policy storage_library_update_admin
on storage.objects
for update
using (
  bucket_id = 'library-files'
  and exists (
    select 1
    from public.file_admins fa
    where fa.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'library-files'
  and exists (
    select 1
    from public.file_admins fa
    where fa.user_id = auth.uid()
  )
);

drop policy if exists storage_library_delete_admin on storage.objects;
create policy storage_library_delete_admin
on storage.objects
for delete
using (
  bucket_id = 'library-files'
  and exists (
    select 1
    from public.file_admins fa
    where fa.user_id = auth.uid()
  )
);

-- Optional admin override pattern (custom JWT claim).
-- Uncomment and adapt if you issue `app_role=admin` in JWT.
--
-- drop policy if exists files_admin_all on public.files;
-- create policy files_admin_all
-- on public.files
-- for all
-- using ((auth.jwt() ->> 'app_role') = 'admin')
-- with check ((auth.jwt() ->> 'app_role') = 'admin');
--
-- drop policy if exists file_events_admin_all on public.file_events;
-- create policy file_events_admin_all
-- on public.file_events
-- for all
-- using ((auth.jwt() ->> 'app_role') = 'admin')
-- with check ((auth.jwt() ->> 'app_role') = 'admin');

commit;
