# File Library Platform Plan (Auth + Drive UI + Audit + Future RAG)

**Date**: 2026-03-10
**Status**: Draft
**Repo**: `indiansinrichmondbc.github.io`

## Objective
Add a secure file library to the current GitHub Pages site where each user has their own password-based login, can browse files like Google Drive, can create/read/update/delete (soft delete), and all actions are auditable by user identity. The same foundation should support RAG search later.

## Reality Check for GitHub Pages
GitHub Pages is static hosting only. It cannot safely hold admin secrets or run secure backend logic by itself.

This means:
- Frontend can stay on GitHub Pages.
- Auth + storage + audit logic must run on managed backend services.
- If custom privileged API logic is needed, use serverless functions (Supabase Edge Functions, Cloudflare Workers, or Vercel Functions).

## Recommended Platform
Primary recommendation: **Supabase**

Why:
- Email/password authentication out of the box.
- Postgres database with Row Level Security (RLS).
- Object storage buckets for docs/images.
- Built-in SQL + triggers for audit trail.
- Easy extension path for vector search and embeddings later.

Alternative options:
- Appwrite (similar all-in-one stack).
- Firebase + Cloud Functions (good auth/storage, different query model).
- Cloudflare R2 + D1 + Auth stack (more assembly work).

## Requirement Mapping

### 1) Simple password authentication (separate passwords)
Implementation:
- Use Supabase Auth with email + password.
- One Supabase `auth.users` identity per person.
- Optional invite-only onboarding (admin creates user invites).
- Password reset via email link.

Security notes:
- Enforce minimum password policy.
- Add optional MFA in phase 2.

### 2) See files like Google Drive
Implementation:
- Build a file explorer UI (table/card hybrid):
  - Name, type, owner, size, tags, updated date.
  - Folder-style navigation (or virtual folders via path prefixes).
  - Sort, filter, and search by metadata.
- Store binary files in Supabase Storage bucket (`library-files`).
- Store file metadata in Postgres table (`files`).

### 3) Allow CRUD on files (soft delete)
Implementation:
- `files` table supports `deleted_at` and `deleted_by`.
- Delete action marks row soft-deleted (no hard delete in UI path).
- Storage object can be retained until retention window expires.
- Optional scheduled cleanup function for objects soft-deleted > N days.

### 4) Track who viewed/deleted/added files
Implementation:
- Create append-only `file_events` audit table.
- Events: `upload`, `view`, `download`, `update_meta`, `soft_delete`, `restore`.
- Every event records `actor_user_id`, `file_id`, timestamp, IP/user-agent (if available), and context.
- UI shows per-file timeline + admin audit dashboard.

### 5) Later use RAG for search
Implementation path:
- Add text extraction pipeline for supported docs (PDF, DOCX, TXT, images via OCR if needed).
- Chunk extracted text, generate embeddings, store vectors in Postgres (`pgvector`) or external vector DB.
- Hybrid search:
  - Metadata filter first.
  - Semantic retrieval second.
  - Response grounding with links back to source files/chunks.

## Proposed Data Model (Supabase/Postgres)

### `files`
- `id` (uuid, pk)
- `storage_path` (text, unique)
- `filename` (text)
- `mime_type` (text)
- `size_bytes` (bigint)
- `owner_user_id` (uuid)
- `folder_path` (text)
- `tags` (text[])
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `deleted_at` (timestamptz, nullable)
- `deleted_by` (uuid, nullable)

### `file_permissions` (if sharing rules are needed)
- `id` (uuid, pk)
- `file_id` (uuid)
- `user_id` (uuid)
- `role` (`viewer` | `editor` | `owner`)

### `file_events` (append-only)
- `id` (bigserial, pk)
- `file_id` (uuid)
- `actor_user_id` (uuid)
- `event_type` (text)
- `event_at` (timestamptz default now())
- `metadata` (jsonb)

### `file_chunks` (phase 4 for RAG)
- `id` (uuid)
- `file_id` (uuid)
- `chunk_index` (int)
- `chunk_text` (text)
- `embedding` (vector)
- `token_count` (int)

## Access Control Model (RLS)
- Users can read/write only files they own or are explicitly granted.
- Soft-deleted files hidden by default for non-admins.
- Audit log inserts allowed through controlled DB function or secure API path to avoid tampering.
- No direct client-side admin key usage.

## Architecture Options

### Option A: Keep GitHub Pages + Supabase (recommended initial)
- Keep existing static site deployment.
- Add a protected app section (JS app) that talks to Supabase directly with anon key.
- RLS enforces security boundary.
- Use Supabase Edge Functions only for privileged workflows (optional).

Pros:
- Minimal migration.
- Fastest path to MVP.

Cons:
- Advanced backend workflows require additional function layer.

### Option B: Move frontend to Vercel/Netlify + Supabase
- Same Supabase backend.
- Better CI/CD + serverless integration for custom APIs.

Pros:
- Cleaner full-stack expansion for RAG pipelines.

Cons:
- Hosting migration effort.

## UI/UX Plan for File Section
- New nav item: `File Library`.
- Auth screens: Sign in, Forgot password, Reset.
- Main layout:
  - Left sidebar: folders/tags.
  - Top toolbar: upload, new folder, filters, search.
  - Main pane: file grid/list toggle.
  - Right panel (optional): details + activity timeline.
- Actions:
  - Upload
  - Rename / edit metadata
  - Move folder
  - Soft delete
  - Restore
  - Download

## Phased Delivery Plan

### Phase 0: Foundation (1-2 days)
- Create Supabase project.
- Configure Auth (email/password).
- Create schema: `files`, `file_events`, optional `file_permissions`.
- Set RLS policies.

Exit criteria:
- User can sign in/out.
- Authenticated user can see own empty library.

### Phase 1: File CRUD MVP (3-5 days)
- Implement upload + metadata insert.
- Implement list view + file preview metadata.
- Implement soft delete + restore.
- Add basic event logging for upload/view/delete.

Exit criteria:
- End-to-end CRUD (with soft delete) working for authenticated users.

### Phase 2: Audit & Admin (2-3 days)
- Add richer `file_events` logging and timeline UI.
- Build simple admin audit view (filter by user/event/file/date).
- Add retention policy job for old deleted objects.

Exit criteria:
- Admin can trace who uploaded/viewed/deleted any file.

### Phase 3: Sharing + Roles (optional, 2-4 days)
- Add `file_permissions` and share UI.
- Support viewer/editor roles.

Exit criteria:
- Controlled sharing beyond owner-only access.

### Phase 4: RAG Search (1-2 weeks)
- Build extraction/chunking/embedding pipeline.
- Add semantic search endpoint + UI.
- Show citations back to original files.

Exit criteria:
- Search returns relevant chunks with source traceability.

## Risks and Mitigations
- Risk: Exposing privileged keys in frontend.
  - Mitigation: only use anon key client-side, enforce RLS, keep service role in server functions only.
- Risk: Event log gaps from client-only logging.
  - Mitigation: use DB triggers and/or controlled function calls for critical events.
- Risk: Storage and embedding costs grow quickly.
  - Mitigation: lifecycle policies, size limits, staged embedding only for selected file types.

## Immediate Repo Changes to Plan Next
1. Add a technical design doc for Supabase schema + RLS SQL.
2. Add implementation checklist doc with endpoint and UI tasks.
3. Add a small prototype page (`/library`) wired to Supabase Auth and list API.

## Decision Needed
Choose one path now:
1. **Option A**: Keep GitHub Pages + Supabase (fast MVP).
2. **Option B**: Migrate frontend hosting to Vercel/Netlify + Supabase (better long-term full-stack).
