---
layout: default
title: File Library
permalink: /library/
description: Secure file library login for community members.
---

<div class="library-shell">
  <h1 class="library-title">File Library</h1>
  <p class="library-subtitle">Sign in with your own account to access private files.</p>

  <section class="library-card" id="lib-config-card">
    <h2>Supabase Connection</h2>
    <p class="library-help">Add your Supabase project URL and anon key once on this browser. These values are saved in local storage for this device only.</p>
    <div class="library-grid-2">
      <label>
        Supabase URL
        <input id="lib-supabase-url" type="url" placeholder="https://your-project.supabase.co" autocomplete="off" />
      </label>
      <label>
        Supabase Anon Key
        <input id="lib-supabase-anon-key" type="text" placeholder="eyJ..." autocomplete="off" />
      </label>
    </div>
    <div class="library-actions">
      <button id="lib-save-config" type="button" class="library-btn">Save Connection</button>
      <button id="lib-clear-config" type="button" class="library-btn library-btn-muted">Clear</button>
    </div>
  </section>

  <section class="library-card" id="lib-auth-card">
    <h2>Authentication</h2>
    <div id="lib-auth-view">
      <form id="lib-sign-in-form" class="library-form">
        <h3>Sign In</h3>
        <label>
          Email
          <input id="lib-sign-in-email" type="email" required autocomplete="email" />
        </label>
        <label>
          Password
          <input id="lib-sign-in-password" type="password" required autocomplete="current-password" />
        </label>
        <button class="library-btn" type="submit">Sign In</button>
      </form>

      <form id="lib-sign-up-form" class="library-form">
        <h3>Create Account</h3>
        <label>
          Email
          <input id="lib-sign-up-email" type="email" required autocomplete="email" />
        </label>
        <label>
          Password
          <input id="lib-sign-up-password" type="password" minlength="8" required autocomplete="new-password" />
        </label>
        <button class="library-btn" type="submit">Create Account</button>
      </form>

      <form id="lib-reset-form" class="library-form">
        <h3>Reset Password</h3>
        <label>
          Email
          <input id="lib-reset-email" type="email" required autocomplete="email" />
        </label>
        <button class="library-btn library-btn-muted" type="submit">Send Reset Link</button>
      </form>
    </div>

    <div id="lib-app-view" class="library-hidden">
      <p><strong>Signed in as:</strong> <span id="lib-user-email">-</span></p>
      <div class="library-actions">
        <button id="lib-sign-out" type="button" class="library-btn">Sign Out</button>
      </div>

      <section class="library-file-panel">
        <h3>My Files</h3>
        <div class="library-grid-2">
          <label>
            Upload File
            <input id="lib-upload-file" type="file" />
          </label>
          <label>
            Folder Path
            <input id="lib-upload-folder" type="text" value="/" placeholder="/invoices" />
          </label>
        </div>
        <label>
          Tags (comma separated)
          <input id="lib-upload-tags" type="text" placeholder="invoice, march" />
        </label>
        <div class="library-actions">
          <button id="lib-upload-btn" type="button" class="library-btn">Upload</button>
          <button id="lib-refresh-files" type="button" class="library-btn library-btn-muted">Refresh</button>
        </div>

        <div class="library-grid-2">
          <label>
            Search
            <input id="lib-search" type="text" placeholder="Search by filename or tag" />
          </label>
          <label class="library-checkbox-label">
            <input id="lib-show-deleted" type="checkbox" />
            Show soft-deleted files
          </label>
        </div>

        <div class="library-table-wrap">
          <table class="library-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Folder</th>
                <th>Size</th>
                <th>Updated</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="lib-files-body">
              <tr><td colspan="6">No files loaded yet.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <p id="lib-status" class="library-status" aria-live="polite"></p>
    <p id="lib-files-status" class="library-status" aria-live="polite"></p>
  </section>
</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="{{ '/assets/js/library/local-config.js' | relative_url }}"></script>
<script src="{{ '/assets/js/library/auth.js' | relative_url }}"></script>
<script src="{{ '/assets/js/library/files.js' | relative_url }}"></script>
