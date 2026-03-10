(function () {
  const BUCKET_NAME = "library-files";

  let currentUser = null;
  let supabaseClient = null;
  let isCurrentUserAdmin = false;
  let filesCache = [];

  const els = {
    status: document.getElementById("lib-files-status"),
    fileInput: document.getElementById("lib-upload-file"),
    folderInput: document.getElementById("lib-upload-folder"),
    tagsInput: document.getElementById("lib-upload-tags"),
    uploadBtn: document.getElementById("lib-upload-btn"),
    refreshBtn: document.getElementById("lib-refresh-files"),
    searchInput: document.getElementById("lib-search"),
    showDeletedInput: document.getElementById("lib-show-deleted"),
    filesBody: document.getElementById("lib-files-body"),
  };

  function isReady() {
    return (
      els.status &&
      els.fileInput &&
      els.folderInput &&
      els.tagsInput &&
      els.uploadBtn &&
      els.refreshBtn &&
      els.searchInput &&
      els.showDeletedInput &&
      els.filesBody
    );
  }

  function setStatus(message, isError) {
    if (!els.status) {
      return;
    }

    els.status.textContent = message;
    els.status.classList.toggle("library-status-error", Boolean(isError));
  }

  function parseTags(raw) {
    return raw
      .split(",")
      .map(function (tag) {
        return tag.trim();
      })
      .filter(function (tag) {
        return tag.length > 0;
      });
  }

  function formatBytes(size) {
    if (!Number.isFinite(size) || size < 0) {
      return "0 B";
    }

    if (size < 1024) {
      return size + " B";
    }

    if (size < 1024 * 1024) {
      return (size / 1024).toFixed(1) + " KB";
    }

    if (size < 1024 * 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(1) + " MB";
    }

    return (size / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  }

  function formatDate(value) {
    if (!value) {
      return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString();
  }

  function normalizeFolderPath(input) {
    const raw = (input || "/").trim();
    if (!raw) {
      return "/";
    }

    const withSlashes = raw.replace(/\\+/g, "/");
    const withoutTrailing = withSlashes.replace(/\/$/, "");
    if (withoutTrailing === "") {
      return "/";
    }

    return withoutTrailing.startsWith("/") ? withoutTrailing : "/" + withoutTrailing;
  }

  function buildStoragePath(userId, folderPath, filename) {
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const timestamp = Date.now();
    const folderNoLead = folderPath === "/" ? "root" : folderPath.replace(/^\//, "");
    return userId + "/" + folderNoLead + "/" + timestamp + "-" + safeFilename;
  }

  function applyClientSideFilters() {
    const query = els.searchInput.value.trim().toLowerCase();
    const showDeleted = els.showDeletedInput.checked;

    return filesCache.filter(function (file) {
      if (!showDeleted && file.deleted_at) {
        return false;
      }

      if (!query) {
        return true;
      }

      const filename = (file.filename || "").toLowerCase();
      const folder = (file.folder_path || "").toLowerCase();
      const tags = Array.isArray(file.tags) ? file.tags.join(" ").toLowerCase() : "";
      return filename.includes(query) || folder.includes(query) || tags.includes(query);
    });
  }

  function renderRows() {
    const filtered = applyClientSideFilters();

    if (filtered.length === 0) {
      els.filesBody.innerHTML = '<tr><td colspan="6">No files found.</td></tr>';
      return;
    }

    const rows = filtered
      .map(function (file) {
        const deleted = Boolean(file.deleted_at);
        const status = deleted ? "Soft-deleted" : "Active";
        const actions = deleted
          ? (isCurrentUserAdmin
              ? '<button class="library-btn library-btn-muted" data-action="restore" data-id="' + file.id + '">Restore</button>'
              : "")
          : '<button class="library-btn library-btn-muted" data-action="view" data-id="' + file.id + '">View</button>' +
            '<button class="library-btn library-btn-muted" data-action="download" data-id="' + file.id + '">Download</button>' +
            (isCurrentUserAdmin
              ? '<button class="library-btn library-btn-muted" data-action="delete" data-id="' + file.id + '">Soft Delete</button>'
              : "");

        return (
          "<tr>" +
          "<td>" + (file.filename || "-") + "</td>" +
          "<td>" + (file.folder_path || "/") + "</td>" +
          "<td>" + formatBytes(file.size_bytes || 0) + "</td>" +
          "<td>" + formatDate(file.updated_at || file.created_at) + "</td>" +
          "<td>" + status + "</td>" +
          '<td class="library-action-cell">' + actions + "</td>" +
          "</tr>"
        );
      })
      .join("");

    els.filesBody.innerHTML = rows;
  }

  async function logEvent(fileId, eventType, metadata) {
    if (!supabaseClient || !currentUser) {
      return;
    }

    await supabaseClient.from("file_events").insert({
      file_id: fileId,
      actor_user_id: currentUser.id,
      event_type: eventType,
      metadata: metadata || {},
    });
  }

  async function loadFiles() {
    if (!supabaseClient || !currentUser) {
      filesCache = [];
      renderRows();
      return;
    }

    setStatus("Loading files...", false);

    const result = await supabaseClient
      .from("files")
      .select("id, filename, storage_path, folder_path, size_bytes, tags, created_at, updated_at, deleted_at")
      .order("updated_at", { ascending: false })
      .limit(500);

    if (result.error) {
      setStatus(result.error.message, true);
      return;
    }

    filesCache = result.data || [];
    renderRows();
    setStatus("Loaded " + filesCache.length + " file(s).", false);
  }

  async function uploadCurrentFile() {
        if (!isCurrentUserAdmin) {
          setStatus("You are authenticated but not allowed to upload files.", true);
          return;
        }

    if (!supabaseClient || !currentUser) {
      setStatus("Sign in first.", true);
      return;
    }

    const file = els.fileInput.files && els.fileInput.files[0];
    if (!file) {
      setStatus("Choose a file first.", true);
      return;
    }

    const folderPath = normalizeFolderPath(els.folderInput.value);
    const tags = parseTags(els.tagsInput.value || "");
    const storagePath = buildStoragePath(currentUser.id, folderPath, file.name);

    setStatus("Uploading file...", false);

    const storageUpload = await supabaseClient.storage.from(BUCKET_NAME).upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (storageUpload.error) {
      setStatus(storageUpload.error.message, true);
      return;
    }

    const metadataInsert = await supabaseClient
      .from("files")
      .insert({
        storage_path: storagePath,
        filename: file.name,
        mime_type: file.type || "application/octet-stream",
        size_bytes: file.size,
        owner_user_id: currentUser.id,
        folder_path: folderPath,
        tags: tags,
      })
      .select("id")
      .single();

    if (metadataInsert.error) {
      setStatus(metadataInsert.error.message, true);
      return;
    }

    await logEvent(metadataInsert.data.id, "upload", {
      filename: file.name,
      size_bytes: file.size,
      folder_path: folderPath,
    });

    els.fileInput.value = "";
    els.tagsInput.value = "";
    setStatus("Upload complete.", false);
    await loadFiles();
  }

  function findFileById(fileId) {
    return filesCache.find(function (item) {
      return item.id === fileId;
    });
  }

  async function createSignedUrl(storagePath) {
    const signed = await supabaseClient.storage.from(BUCKET_NAME).createSignedUrl(storagePath, 180);
    if (signed.error) {
      throw new Error(signed.error.message);
    }
    return signed.data.signedUrl;
  }

  async function softDeleteFile(file) {
    const result = await supabaseClient
      .from("files")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: currentUser.id,
      })
      .eq("id", file.id)
      .is("deleted_at", null);

    if (result.error) {
      throw new Error(result.error.message);
    }

    await logEvent(file.id, "soft_delete", { filename: file.filename });
  }

  async function restoreFile(file) {
    const result = await supabaseClient
      .from("files")
      .update({
        deleted_at: null,
        deleted_by: null,
      })
      .eq("id", file.id);

    if (result.error) {
      throw new Error(result.error.message);
    }

    await logEvent(file.id, "restore", { filename: file.filename });
  }

  async function handleTableAction(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }

    if (!supabaseClient || !currentUser) {
      setStatus("Sign in first.", true);
      return;
    }

    const fileId = button.getAttribute("data-id");
    const action = button.getAttribute("data-action");
    const file = findFileById(fileId);

    if (!file) {
      setStatus("File no longer exists in current list. Refresh and try again.", true);
      return;
    }

    button.disabled = true;

    try {
      if (action === "view") {
        const signedUrl = await createSignedUrl(file.storage_path);
        window.open(signedUrl, "_blank", "noopener");
        await logEvent(file.id, "view", { filename: file.filename });
        setStatus("Opened file preview.", false);
      }

      if (action === "download") {
        const signedUrl = await createSignedUrl(file.storage_path);
        const link = document.createElement("a");
        link.href = signedUrl;
        link.download = file.filename || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        await logEvent(file.id, "download", { filename: file.filename });
        setStatus("Download started.", false);
      }

      if (action === "delete") {
        if (!isCurrentUserAdmin) {
          throw new Error("You are not allowed to delete files.");
        }
        await softDeleteFile(file);
        setStatus("File soft-deleted.", false);
        await loadFiles();
      }

      if (action === "restore") {
        if (!isCurrentUserAdmin) {
          throw new Error("You are not allowed to restore files.");
        }
        await restoreFile(file);
        setStatus("File restored.", false);
        await loadFiles();
      }
    } catch (error) {
      setStatus(error.message || "Action failed.", true);
    } finally {
      button.disabled = false;
    }
  }

  function onAuthStateChanged(event) {
    currentUser = event.detail ? event.detail.user : null;
    if (!currentUser) {
      isCurrentUserAdmin = false;
      els.uploadBtn.disabled = true;
      filesCache = [];
      renderRows();
      setStatus("Sign in to load files.", false);
      return;
    }

    loadAdminMembership().then(loadFiles);
  }

  async function loadAdminMembership() {
    if (!supabaseClient || !currentUser) {
      isCurrentUserAdmin = false;
      els.uploadBtn.disabled = true;
      return;
    }

    const result = await supabaseClient
      .from("file_admins")
      .select("user_id")
      .eq("user_id", currentUser.id)
      .maybeSingle();

    if (result.error) {
      isCurrentUserAdmin = false;
      els.uploadBtn.disabled = true;
      setStatus("Signed in. Could not verify admin upload permissions.", true);
      return;
    }

    isCurrentUserAdmin = Boolean(result.data && result.data.user_id);
    els.uploadBtn.disabled = !isCurrentUserAdmin;
  }

  function onClientReady(event) {
    supabaseClient = event.detail ? event.detail.client : null;
    if (!supabaseClient) {
      isCurrentUserAdmin = false;
      els.uploadBtn.disabled = true;
      filesCache = [];
      renderRows();
    }
  }

  function bindEvents() {
    els.uploadBtn.addEventListener("click", uploadCurrentFile);
    els.refreshBtn.addEventListener("click", loadFiles);
    els.searchInput.addEventListener("input", renderRows);
    els.showDeletedInput.addEventListener("change", renderRows);
    els.filesBody.addEventListener("click", handleTableAction);

    window.addEventListener("library:auth-state", onAuthStateChanged);
    window.addEventListener("library:client-ready", onClientReady);

    if (window.LibraryAuth && typeof window.LibraryAuth.getClient === "function") {
      supabaseClient = window.LibraryAuth.getClient();
    }
  }

  function init() {
    if (!isReady()) {
      return;
    }

    bindEvents();
    els.uploadBtn.disabled = true;
    renderRows();
    setStatus("Sign in to load files.", false);
  }

  init();
})();
