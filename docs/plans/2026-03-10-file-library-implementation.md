# Implementation Plan: File Library on Supabase

**Date**: 2026-03-10
**Status**: Draft
**Depends on**: `docs/plans/2026-03-10-file-library-platform-plan.md`

## Build Approach
Start with owner-only private libraries, then add sharing and RAG. Keep frontend static and use Supabase for auth, data, storage, and policy enforcement.

## Tech Decisions
- Frontend: Existing static site (GitHub Pages) with modular JavaScript.
- Backend services: Supabase Auth + Postgres + Storage.
- Optional backend code: Supabase Edge Functions for privileged jobs.
- Audit: Postgres table + trigger/function path.

## Directory Additions (proposed)
- `docs/architecture/supabase-schema.sql`
- `docs/architecture/rls-policies.sql`
- `assets/js/library/`
- `assets/js/library/auth.js`
- `assets/js/library/files.js`
- `assets/js/library/audit.js`
- `library.md`

## Task List

### Task 1: Add environment and configuration guide
Files:
- Create `docs/architecture/supabase-setup.md`

Steps:
1. Document required Supabase values:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
2. Document where secrets must never be used (service role key).
3. Add local testing instructions.

Acceptance:
- New contributor can configure project without exposing secrets.

### Task 2: Define database schema
Files:
- Create `docs/architecture/supabase-schema.sql`

Steps:
1. Create `files` table.
2. Create `file_events` table.
3. Add indexes:
- `files(owner_user_id, deleted_at)`
- `files(folder_path)`
- `file_events(file_id, event_at desc)`

Acceptance:
- SQL applies cleanly in Supabase SQL editor.

### Task 3: Add RLS policies
Files:
- Create `docs/architecture/rls-policies.sql`

Steps:
1. Enable RLS on `files` and `file_events`.
2. Policy: users can access their own files only.
3. Policy: users can insert events only for files they can access.
4. Add admin override policy (optional, role-based).

Acceptance:
- Cross-user access is blocked in policy tests.

### Task 4: Set up storage bucket
Supabase config:
- Bucket: `library-files`
- Private bucket.

Steps:
1. Uploads write to path pattern: `<user_id>/<folder_path>/<filename>`.
2. Store canonical path in `files.storage_path`.
3. Generate signed URLs for download/preview.

Acceptance:
- User can upload and fetch signed URL only for authorized objects.

### Task 5: Create auth flow in frontend
Files:
- Create `assets/js/library/auth.js`
- Create `library.md`

Steps:
1. Add sign-in form (email/password).
2. Add sign-out button.
3. Add session restore on page load.
4. Redirect unauthenticated users to sign-in view.

Acceptance:
- User can login/logout and session persists across refresh.

### Task 6: Implement file listing UI (Drive-like)
Files:
- Create `assets/js/library/files.js`
- Update `assets/css/style.scss` with library-specific styles.

Steps:
1. Render files list with columns: name, type, size, modified.
2. Add folder breadcrumbs.
3. Add sort + simple metadata search.
4. Show empty state and loading state.

Acceptance:
- Logged-in user can browse own files smoothly on desktop/mobile.

### Task 7: Implement CRUD with soft delete
Files:
- Update `assets/js/library/files.js`

Steps:
1. Upload file:
- Upload object to bucket.
- Insert row in `files`.
- Insert `upload` event in `file_events`.
2. Update metadata:
- Rename/tags/folder path update.
- Insert `update_meta` event.
3. Soft delete:
- Set `deleted_at` and `deleted_by`.
- Insert `soft_delete` event.
4. Restore:
- Clear `deleted_at` and `deleted_by`.
- Insert `restore` event.

Acceptance:
- No hard delete via UI path.
- Deleted files disappear from default list and can be restored.

### Task 8: Add view and download event tracking
Files:
- Update `assets/js/library/audit.js`

Steps:
1. On preview open, insert `view` event.
2. On signed URL download action, insert `download` event.
3. Add debounce/guard so one open action does not spam events.

Acceptance:
- Event timeline reflects real user activity with minimal duplicates.

### Task 9: Add audit timeline UI
Files:
- Update `library.md`
- Update `assets/js/library/audit.js`

Steps:
1. Show per-file activity timeline (latest first).
2. Admin mode (optional) with filters by user/date/event type.

Acceptance:
- You can identify who uploaded/viewed/deleted a file from UI.

### Task 10: Prepare RAG schema and ingestion hooks (no full RAG yet)
Files:
- Create `docs/architecture/rag-prep.md`

Steps:
1. Define `file_chunks` schema with vector column.
2. Define ingestion trigger points (on upload/update).
3. Define queue/job approach for extraction and embedding.

Acceptance:
- RAG extension can start without schema redesign.

## QA Checklist
- Login fails gracefully with wrong password.
- Users cannot access each other's files.
- Soft delete hides file from primary list.
- Restore returns file correctly.
- Audit events are generated for upload/view/delete/restore.
- Signed URLs expire and cannot be reused indefinitely.
- UI remains usable on mobile widths.

## Rollout Strategy
1. Internal alpha with 2-3 users.
2. Validate auth + CRUD + audit first.
3. Add more file types and metadata fields.
4. Begin RAG ingestion only after stable usage patterns.

## Out of Scope (for MVP)
- Public sharing links.
- Real-time collaboration.
- Full-text OCR for all image types.
- Natural language Q&A over documents.

## Success Metrics
- 100% of file actions tied to authenticated user ID.
- Zero cross-user data leakage in RLS tests.
- <2s median file list load for typical user library.
- Audit trail coverage for at least: upload, view, delete, restore.
