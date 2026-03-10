(function () {
  var DEFAULT_FOLDER_URL = "https://drive.google.com/drive/folders/1Quiw9zk1ALPEZnxPfd-5iw0JvzLguVxt?usp=sharing";

  var els = {
    status: document.getElementById("lib-status"),
    openFolderBtn: document.getElementById("lib-open-folder"),
    openUploadBtn: document.getElementById("lib-open-upload"),
    copyLinkBtn: document.getElementById("lib-copy-folder-link"),
  };

  function setStatus(message, isError) {
    if (!els.status) {
      return;
    }

    els.status.textContent = message;
    els.status.classList.toggle("library-status-error", Boolean(isError));
  }

  function parseFolderId(url) {
    if (!url) {
      return "";
    }

    var match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : "";
  }

  function getFolderUrl() {
    var localConfig = window.LibraryLocalConfig || {};
    if (typeof localConfig.driveFolderUrl === "string" && localConfig.driveFolderUrl.trim()) {
      return localConfig.driveFolderUrl.trim();
    }
    return DEFAULT_FOLDER_URL;
  }

  function getFolderId() {
    var localConfig = window.LibraryLocalConfig || {};
    if (typeof localConfig.driveFolderId === "string" && localConfig.driveFolderId.trim()) {
      return localConfig.driveFolderId.trim();
    }
    return parseFolderId(getFolderUrl());
  }

  function getEmbedUrl() {
    var folderId = getFolderId();
    if (!folderId) {
      return "";
    }
    return "https://drive.google.com/embeddedfolderview?id=" + folderId + "#list";
  }

  function emitDriveReady() {
    window.dispatchEvent(
      new CustomEvent("library:drive-ready", {
        detail: {
          folderUrl: getFolderUrl(),
          embedUrl: getEmbedUrl(),
        },
      })
    );
  }

  function openFolder() {
    window.open(getFolderUrl(), "_blank", "noopener");
    setStatus("Opened shared folder in a new tab.", false);
  }

  function openUploadView() {
    var folderId = getFolderId();
    var uploadUrl = folderId
      ? "https://drive.google.com/drive/folders/" + folderId
      : getFolderUrl();

    window.open(uploadUrl, "_blank", "noopener");
    setStatus("Opened Drive folder. Use New > File upload.", false);
  }

  async function copyFolderLink() {
    var folderUrl = getFolderUrl();
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
        throw new Error("Clipboard API unavailable.");
      }
      await navigator.clipboard.writeText(folderUrl);
      setStatus("Folder link copied.", false);
    } catch (_error) {
      setStatus("Copy failed. Use this link: " + folderUrl, true);
    }
  }

  function bindEvents() {
    if (els.openFolderBtn) {
      els.openFolderBtn.addEventListener("click", openFolder);
    }

    if (els.openUploadBtn) {
      els.openUploadBtn.addEventListener("click", openUploadView);
    }

    if (els.copyLinkBtn) {
      els.copyLinkBtn.addEventListener("click", copyFolderLink);
    }
  }

  function init() {
    bindEvents();

    if (!getEmbedUrl()) {
      setStatus("Drive folder configuration is invalid.", true);
      emitDriveReady();
      return;
    }

    setStatus("Google Drive folder ready.", false);
    emitDriveReady();
  }

  window.LibraryDrive = {
    getFolderUrl: getFolderUrl,
    getEmbedUrl: getEmbedUrl,
  };

  init();
})();
