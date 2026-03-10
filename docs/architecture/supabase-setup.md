# Supabase Setup Guide (File Library MVP)

**Date**: 2026-03-10
**Scope**: Auth + Storage + DB + RLS for `files` and `file_events`

## 1) Create Supabase Project
1. Go to Supabase dashboard and create a new project.
2. Choose a strong project DB password and region near your users.
3. Wait for project provisioning to finish.

## 2) Enable Auth (Email + Password)
1. Open `Authentication` -> `Providers`.
2. Enable `Email` provider.
3. Keep `Confirm email` enabled for production. Disable only for local test if needed.
4. Set redirect URL(s):
- Local: `http://localhost:4000/library/`
- Production: `https://indiansinrichmondbc.github.io/library/`

## 3) Run SQL in Correct Order
Run these scripts in Supabase SQL editor:
1. `docs/architecture/supabase-schema.sql`
2. `docs/architecture/rls-policies.sql`

Then add users who are allowed to upload/delete:
```sql
insert into public.file_admins (user_id)
values
  ('USER_UUID_1'),
  ('USER_UUID_2')
on conflict (user_id) do nothing;
```

Tip:
- You can get user UUIDs from `Authentication` -> `Users` in Supabase dashboard.

## 4) Create Private Storage Bucket
1. Open `Storage` -> `Buckets` -> `Create bucket`.
2. Name: `library-files`
3. Set bucket as `Private`.
4. Do not make it public.

Recommended object path format:
- `<user_id>/<folder_path>/<filename>`
- Example: `f4d2...-uuid/invoices/2026-03.pdf`

## 5) Frontend Keys and Safe Usage
From `Project Settings` -> `API` copy:
- `Project URL` -> use as `SUPABASE_URL`
- `anon public` key -> use as `SUPABASE_ANON_KEY`

Security rule:
- Never expose `service_role` key in frontend code or static site files.

For this GitHub Pages repo:
- Client can safely use anon key only.
- Data safety depends on strict RLS.

## 6) Minimal Client Initialization (Browser)
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const supabaseUrl = 'YOUR_SUPABASE_URL';
  const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
  const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);
</script>
```

## 7) Policy Validation Queries
Use SQL editor for basic checks.

### 7.1 Verify tables and RLS status
```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('files', 'file_events')
order by tablename;
```

Expected:
- `rowssecurity = true` for both tables.

### 7.2 Verify policies exist
```sql
select schemaname, tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('files', 'file_events')
order by tablename, policyname;
```

Expected policy names:
- `file_admins_select_own`
- `files_select_authenticated`
- `files_insert_admin`
- `files_update_admin`
- `file_events_select_authenticated`
- `file_events_insert_viewer`
- `file_events_insert_admin_actions`

### 7.3 Verify hard delete is blocked by policy design
There should be no `DELETE` policy for `public.files`.
```sql
select policyname, cmd
from pg_policies
where schemaname = 'public' and tablename = 'files' and cmd = 'DELETE';
```

Expected:
- zero rows.

## 8) App-Level Validation Flow
After wiring frontend auth and file UI:
1. Sign in as User A.
2. If User A is in `file_admins`, upload one file and confirm row in `files`.
3. Confirm one `upload` row in `file_events`.
4. Soft delete the file and confirm:
- `deleted_at` is not null
- `deleted_by` equals User A id
- `soft_delete` event exists
5. Sign in as User B (not in `file_admins`) and verify:
- User A files are visible.
- Upload and soft delete are blocked by RLS.

Visibility model:
- Any authenticated user can view active files.
- Only `file_admins` users can upload, soft delete, or restore.
- Soft-deleted files are visible only to `file_admins` users.

## 9) Signed URL Pattern (Private Downloads)
For private bucket downloads, generate short-lived signed URLs from client SDK:
- Expiry example: 60 seconds to 5 minutes.
- Regenerate on demand for download/preview actions.

## 10) Common Mistakes to Avoid
- Using service role key in browser code.
- Making `library-files` bucket public.
- Relying on frontend checks without RLS.
- Hard deleting rows from `files` in normal UI flow.
- Logging audit events without actor/file linkage.
- Forgetting to add allowed upload/delete users into `public.file_admins`.

## 11) Next File to Add
When ready, add:
- `docs/architecture/rag-prep.md`

This should define `file_chunks` schema and embedding pipeline trigger points.
