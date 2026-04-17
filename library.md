---
layout: default
title: File Library
permalink: /library/
description: Secure file library login for community members.
---

<div class="library-shell">
  <div class="library-hero">
    <p class="library-eyebrow">Shared Workspace</p>
    <h1 class="library-title">Google Drive Library</h1>
    <p class="library-subtitle">Use this shared folder as the community drop location. Google controls authentication and permissions.</p>
  </div>

  <section class="library-card" id="lib-drive-actions-card">
    <h2>Drop Location</h2>
    <p class="library-help">Authenticated Google users can upload and browse files directly in this shared folder.</p>
    <div class="library-actions">
      <button id="lib-open-folder" type="button" class="library-btn">Open Shared Folder</button>
      <button id="lib-open-upload" type="button" class="library-btn">Upload to Folder</button>
      <button id="lib-copy-folder-link" type="button" class="library-btn library-btn-muted">Copy Folder Link</button>
    </div>
    <p class="library-drive-note">If you are not signed in, Google Drive will ask you to authenticate before access.</p>
    <p id="lib-status" class="library-status" aria-live="polite"></p>
  </section>

  <section class="library-card" id="lib-drive-browser-card">
    <h2>Shared Files</h2>
    <p class="library-help">Browse files uploaded by authenticated users in the embedded folder view below.</p>
    <div class="library-actions">
      <button id="lib-refresh-files" type="button" class="library-btn library-btn-muted">Refresh View</button>
    </div>
    <iframe
      id="lib-drive-frame"
      class="library-drive-frame"
      title="Community Google Drive Folder"
      loading="lazy"
      referrerpolicy="no-referrer"
      src=""
    ></iframe>
    <p id="lib-files-status" class="library-status" aria-live="polite"></p>
  </section>
</div>

{% assign library_local_config = site.static_files | where: "path", "/assets/js/library/local-config.js" | first %}
{% if library_local_config %}
  <script src="{{ '/assets/js/library/local-config.js' | relative_url }}"></script>
{% endif %}
<script src="{{ '/assets/js/library/auth.js' | relative_url }}"></script>
<script src="{{ '/assets/js/library/files.js' | relative_url }}"></script>
