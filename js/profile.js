/**
 * Icon badges for profile links, keyed by the `label` field in
 * data/profile.json (case-insensitive). Generic concepts (CV, Email,
 * Google Scholar) get a hand-drawn line icon; GitHub and Bluesky use their
 * logo marks (Simple Icons paths, CC0); ORCID gets a short monogram, plus a
 * fallback for any unrecognized label.
 */
const PROFILE_ICONS = {
  cv: '<span class="monogram">CV</span>',
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
  "google scholar": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3Z"/><path d="M5 13.18v4c0 1 3 3 7 3s7-2 7-3v-4L12 17 5 13.18Z"/></svg>',
  github: Site.icons.github,
  bluesky: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/></svg>',
  orcid: '<span class="monogram">iD</span>',
};
const DEFAULT_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>';

/** Renders data/profile.json into the About section, nav, title, and footer. */
Site.load("./data/profile.json", "profile-container", (container, profile) => {
  if (profile.name) {
    document.title = profile.name;
    const navName = document.getElementById("nav-name");
    if (navName) navName.textContent = profile.name;
    const footer = document.getElementById("footer-text");
    if (footer) {
      footer.textContent = `© ${new Date().getFullYear()} ${profile.name}`;
    }
  }

  // Two-column layout: a narrow side column with the name (plus optional
  // pronunciation), role/affiliation lines and link badges, next to the bio
  // paragraphs. Collapses to a single stacked column on narrow screens (CSS).
  const wrapper = Site.el("div", "profile");
  const side = Site.el("aside", "profile-side");

  if (profile.photoPath) {
    const img = Site.el("img", "profile-photo");
    img.src = profile.photoPath;
    img.alt = profile.name || "Profile photo";
    side.appendChild(img);
  }

  const heading = Site.el("h1", "profile-name", profile.name || "");
  if (profile.pronunciation) {
    heading.appendChild(document.createTextNode(" "));
    heading.appendChild(Site.el("span", "profile-pron", `(${profile.pronunciation})`));
  }
  side.appendChild(heading);

  // `roles` is an array of lines (trusted HTML, may contain links). Older
  // data files may use `title`/`affiliation` instead; fall back to those.
  const roles = Array.isArray(profile.roles) && profile.roles.length
    ? profile.roles
    : [[profile.title, profile.affiliation].filter(Boolean).join(", ")].filter(Boolean);
  if (roles.length) {
    const roleBlock = Site.el("div", "profile-roles");
    roles.forEach((line) => {
      const p = Site.el("p", "profile-role");
      p.innerHTML = line;
      roleBlock.appendChild(p);
    });
    side.appendChild(roleBlock);
  }

  if (profile.links && profile.links.length) {
    const list = Site.el("ul", "profile-links");
    profile.links.forEach(({ label, url }) => {
      const li = document.createElement("li");
      const badge = Site.link(url, "");
      badge.className = "icon-badge";
      badge.title = label;
      badge.setAttribute("aria-label", label);
      badge.innerHTML = PROFILE_ICONS[(label || "").toLowerCase()] || DEFAULT_ICON;
      li.appendChild(badge);
      list.appendChild(li);
    });
    side.appendChild(list);
  }

  wrapper.appendChild(side);

  const body = Site.el("div", "profile-body");
  (profile.bio || []).forEach((paragraph) => {
    const p = Site.el("p", "profile-bio");
    // paragraph is trusted site-owner content from data/profile.json and may
    // contain inline links (e.g. to ./dissertation.html), same convention as
    // news.js's htmltext.
    p.innerHTML = paragraph;
    body.appendChild(p);
  });

  wrapper.appendChild(body);
  container.appendChild(wrapper);
});
