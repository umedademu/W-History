(() => {
  const storageKey = "w-history-theme";
  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");

  function storedTheme() {
    try {
      const value = localStorage.getItem(storageKey);
      return value === "dark" || value === "light" ? value : null;
    } catch {
      return null;
    }
  }

  function preferredTheme() {
    return storedTheme() ?? (systemPreference.matches ? "dark" : "light");
  }

  function updateButton(button) {
    const dark = document.documentElement.dataset.theme === "dark";
    button.setAttribute("aria-pressed", String(dark));
    button.setAttribute("aria-label", dark ? "ライトテーマに切り替える" : "ダークテーマに切り替える");
    button.querySelector(".theme-toggle-icon").textContent = dark ? "☀" : "☾";
    button.querySelector(".theme-toggle-label").textContent = dark ? "ライト" : "ダーク";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelectorAll("[data-theme-toggle]").forEach(updateButton);
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // 保存できない環境でも、このページを開いている間は切り替えを有効にする。
    }
  }

  function createButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.dataset.themeToggle = "";
    button.innerHTML = '<span class="theme-toggle-icon" aria-hidden="true"></span><span class="theme-toggle-label"></span>';
    button.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      saveTheme(next);
      applyTheme(next);
    });
    updateButton(button);
    return button;
  }

  applyTheme(preferredTheme());

  document.addEventListener("DOMContentLoaded", () => {
    const button = createButton();
    const storyHeader = document.querySelector(".story-header");
    const siteNavigation = document.querySelector(".site-header nav");
    if (storyHeader) {
      const actions = document.createElement("div");
      actions.className = "theme-actions";
      const version = storyHeader.querySelector(".version");
      if (version) actions.append(version);
      actions.append(button);
      storyHeader.append(actions);
      storyHeader.classList.add("has-theme-toggle");
    } else if (siteNavigation) {
      siteNavigation.append(button);
    } else {
      button.classList.add("theme-toggle-floating");
      document.body.prepend(button);
    }
  });

  systemPreference.addEventListener("change", () => {
    if (!storedTheme()) applyTheme(preferredTheme());
  });

  window.addEventListener("storage", event => {
    if (event.key === storageKey) applyTheme(preferredTheme());
  });
})();
