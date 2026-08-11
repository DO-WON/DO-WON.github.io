/**
 * Light/dark theme toggle. Shares the "pref-theme" localStorage key with
 * design/violets/index.html so the preference stays in sync across pages.
 * Runs as a blocking <head> script (not deferred) so the "dark" class is
 * applied before first paint, avoiding a flash of the wrong theme.
 */
(function () {
  var pref = localStorage.getItem("pref-theme");
  if (pref === "dark" || (!pref && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  const sync = () => {
    const isDark = document.documentElement.classList.contains("dark");
    toggle.textContent = isDark ? "☀️" : "🌙";
    toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  };
  sync();

  toggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("pref-theme", isDark ? "dark" : "light");
    sync();
  });
});
