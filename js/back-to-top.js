/**
 * "Back to top" button, shared by every page (including blog posts).
 * Appears in the bottom-right corner once the reader has scrolled past
 * roughly one screen, and scrolls smoothly back to the top on click
 * (instantly when the reader prefers reduced motion).
 */
document.addEventListener("DOMContentLoaded", () => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "back-to-top";
  button.setAttribute("aria-label", "Back to top");
  button.title = "Back to top";
  button.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';
  document.body.appendChild(button);

  const update = () => {
    button.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.8);
  };
  window.addEventListener("scroll", update, { passive: true });
  update();

  button.addEventListener("click", () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
});
