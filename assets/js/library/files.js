(function () {
  var currentEmbedUrl = "";

  var els = {
    status: document.getElementById("lib-files-status"),
    refreshBtn: document.getElementById("lib-refresh-files"),
    frame: document.getElementById("lib-drive-frame"),
  };

  function setStatus(message, isError) {
    if (!els.status) {
      return;
    }

    els.status.textContent = message;
    els.status.classList.toggle("library-status-error", Boolean(isError));
  }

  function loadFrame(embedUrl) {
    if (!els.frame) {
      return;
    }

    if (!embedUrl) {
      els.frame.removeAttribute("src");
      setStatus("Unable to load folder preview. Check Drive folder settings.", true);
      return;
    }

    currentEmbedUrl = embedUrl;
    els.frame.src = embedUrl;
    setStatus("Loaded Google Drive folder preview.", false);
  }

  function refreshFrame() {
    if (!els.frame || !currentEmbedUrl) {
      setStatus("Nothing to refresh yet.", true);
      return;
    }

    var cacheBustedUrl = currentEmbedUrl + (currentEmbedUrl.indexOf("?") === -1 ? "?" : "&") + "ts=" + Date.now();
    els.frame.src = cacheBustedUrl;
    setStatus("Refreshing folder preview...", false);
  }

  function onDriveReady(event) {
    var detail = event.detail || {};
    loadFrame(detail.embedUrl || "");
  }

  function bindEvents() {
    if (els.refreshBtn) {
      els.refreshBtn.addEventListener("click", refreshFrame);
    }

    window.addEventListener("library:drive-ready", onDriveReady);

    if (window.LibraryDrive && typeof window.LibraryDrive.getEmbedUrl === "function") {
      loadFrame(window.LibraryDrive.getEmbedUrl());
    }
  }

  function init() {
    bindEvents();
    if (!els.frame) {
      setStatus("Drive preview element is missing.", true);
    }
  }

  init();
})();
