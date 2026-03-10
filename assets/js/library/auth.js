(function () {
  const CONFIG_STORAGE_KEY = "library.supabase.config";
  const localConfig = window.LibraryLocalConfig || null;

  let supabaseClient = null;

  const els = {
    urlInput: document.getElementById("lib-supabase-url"),
    anonKeyInput: document.getElementById("lib-supabase-anon-key"),
    saveConfigBtn: document.getElementById("lib-save-config"),
    clearConfigBtn: document.getElementById("lib-clear-config"),
    authView: document.getElementById("lib-auth-view"),
    appView: document.getElementById("lib-app-view"),
    status: document.getElementById("lib-status"),
    userEmail: document.getElementById("lib-user-email"),
    signOutBtn: document.getElementById("lib-sign-out"),
    signInForm: document.getElementById("lib-sign-in-form"),
    signUpForm: document.getElementById("lib-sign-up-form"),
    resetForm: document.getElementById("lib-reset-form"),
  };

  function emit(eventName, detail) {
    window.dispatchEvent(new CustomEvent(eventName, { detail: detail }));
  }

  function setStatus(message, isError) {
    els.status.textContent = message;
    els.status.classList.toggle("library-status-error", Boolean(isError));
  }

  function setSignedInState(user) {
    if (user) {
      els.authView.classList.add("library-hidden");
      els.appView.classList.remove("library-hidden");
      els.userEmail.textContent = user.email || user.id;
      return;
    }

    els.authView.classList.remove("library-hidden");
    els.appView.classList.add("library-hidden");
    els.userEmail.textContent = "-";
    emit("library:auth-state", { user: user || null });
  }

  function announceSignedInState(user) {
    emit("library:auth-state", { user: user || null });
  }

  function saveConfig(url, anonKey) {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({ url, anonKey }));
  }

  function clearConfig() {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
    els.urlInput.value = "";
    els.anonKeyInput.value = "";
    supabaseClient = null;
    setSignedInState(null);
    setStatus("Connection settings cleared.", false);
    emit("library:client-ready", { client: null });
  }

  function readConfig() {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function tryInitClient(url, anonKey) {
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      setStatus("Supabase SDK did not load. Refresh the page and try again.", true);
      return false;
    }

    if (!url || !anonKey) {
      setStatus("Enter Supabase URL and anon key first.", true);
      return false;
    }

    try {
      supabaseClient = window.supabase.createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });

      supabaseClient.auth.onAuthStateChange(function (_event, session) {
        const user = session ? session.user : null;
        setSignedInState(user);
        announceSignedInState(user);
      });

      emit("library:client-ready", { client: supabaseClient });

      return true;
    } catch (error) {
      setStatus("Unable to initialize Supabase client.", true);
      return false;
    }
  }

  async function hydrateSession() {
    if (!supabaseClient) {
      setSignedInState(null);
      return;
    }

    const result = await supabaseClient.auth.getSession();
    if (result.error) {
      setStatus(result.error.message, true);
      setSignedInState(null);
      return;
    }

    setSignedInState(result.data && result.data.session ? result.data.session.user : null);
    announceSignedInState(result.data && result.data.session ? result.data.session.user : null);
    if (result.data && result.data.session) {
      setStatus("Session restored.", false);
    } else {
      setStatus("Ready. Please sign in.", false);
    }
  }

  async function onSignInSubmit(event) {
    event.preventDefault();
    if (!supabaseClient) {
      setStatus("Save Supabase connection first.", true);
      return;
    }

    const email = document.getElementById("lib-sign-in-email").value.trim();
    const password = document.getElementById("lib-sign-in-password").value;

    const result = await supabaseClient.auth.signInWithPassword({ email, password });
    if (result.error) {
      setStatus(result.error.message, true);
      return;
    }

    setStatus("Signed in successfully.", false);
    setSignedInState(result.data.user || null);
    announceSignedInState(result.data.user || null);
    event.target.reset();
  }

  async function onSignUpSubmit(event) {
    event.preventDefault();
    if (!supabaseClient) {
      setStatus("Save Supabase connection first.", true);
      return;
    }

    const email = document.getElementById("lib-sign-up-email").value.trim();
    const password = document.getElementById("lib-sign-up-password").value;

    const result = await supabaseClient.auth.signUp({ email, password });
    if (result.error) {
      setStatus(result.error.message, true);
      return;
    }

    if (result.data && result.data.user && !result.data.session) {
      setStatus("Account created. Check your email to confirm before signing in.", false);
    } else {
      setStatus("Account created and signed in.", false);
      setSignedInState(result.data.user || null);
      announceSignedInState(result.data.user || null);
    }

    event.target.reset();
  }

  async function onResetSubmit(event) {
    event.preventDefault();
    if (!supabaseClient) {
      setStatus("Save Supabase connection first.", true);
      return;
    }

    const email = document.getElementById("lib-reset-email").value.trim();

    const result = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/library/",
    });

    if (result.error) {
      setStatus(result.error.message, true);
      return;
    }

    setStatus("Password reset link sent if the account exists.", false);
    event.target.reset();
  }

  async function onSignOut() {
    if (!supabaseClient) {
      setSignedInState(null);
      return;
    }

    const result = await supabaseClient.auth.signOut();
    if (result.error) {
      setStatus(result.error.message, true);
      return;
    }

    setSignedInState(null);
    announceSignedInState(null);
    setStatus("Signed out.", false);
  }

  async function onSaveConfig() {
    const url = els.urlInput.value.trim();
    const anonKey = els.anonKeyInput.value.trim();

    const initialized = tryInitClient(url, anonKey);
    if (!initialized) {
      return;
    }

    saveConfig(url, anonKey);
    setStatus("Connection saved.", false);
    await hydrateSession();
  }

  function wireEvents() {
    els.saveConfigBtn.addEventListener("click", onSaveConfig);
    els.clearConfigBtn.addEventListener("click", clearConfig);
    els.signInForm.addEventListener("submit", onSignInSubmit);
    els.signUpForm.addEventListener("submit", onSignUpSubmit);
    els.resetForm.addEventListener("submit", onResetSubmit);
    els.signOutBtn.addEventListener("click", onSignOut);
  }

  async function init() {
    wireEvents();

    if (
      localConfig &&
      typeof localConfig.supabaseUrl === "string" &&
      typeof localConfig.supabaseAnonKey === "string"
    ) {
      const urlFromLocal = localConfig.supabaseUrl.trim();
      const anonFromLocal = localConfig.supabaseAnonKey.trim();
      if (urlFromLocal && anonFromLocal) {
        els.urlInput.value = urlFromLocal;
        els.anonKeyInput.value = anonFromLocal;
        const initializedFromLocal = tryInitClient(urlFromLocal, anonFromLocal);
        if (initializedFromLocal) {
          saveConfig(urlFromLocal, anonFromLocal);
          setStatus("Loaded Supabase config from local file.", false);
          await hydrateSession();
          return;
        }
      }
    }

    const config = readConfig();
    if (!config) {
      setStatus("Add Supabase URL and anon key to start.", false);
      setSignedInState(null);
      return;
    }

    els.urlInput.value = config.url || "";
    els.anonKeyInput.value = config.anonKey || "";

    const initialized = tryInitClient(config.url, config.anonKey);
    if (!initialized) {
      return;
    }

    await hydrateSession();
  }

  window.LibraryAuth = {
    getClient: function () {
      return supabaseClient;
    },
  };

  init();
})();
