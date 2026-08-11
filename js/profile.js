/**
 * Icon badges for profile links, keyed by the `label` field in
 * data/profile.json (case-insensitive). Generic concepts (CV, Email,
 * Google Scholar) get a hand-drawn line icon; brand-specific services
 * (GitHub, LinkedIn, Twitter, ORCID) get a short monogram instead of a
 * reconstructed logo mark, plus a fallback for any unrecognized label.
 */
const PROFILE_ICONS = {
  cv: '<span class="monogram">CV</span>',
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
  "google scholar": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3Z"/><path d="M5 13.18v4c0 1 3 3 7 3s7-2 7-3v-4L12 17 5 13.18Z"/></svg>',
  github: '<span class="monogram">GH</span>',
  linkedin: '<span class="monogram">in</span>',
  twitter: '<span class="monogram">X</span>',
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

  const wrapper = Site.el("div", "profile");

  if (profile.photoPath) {
    const img = Site.el("img", "profile-photo");
    img.src = profile.photoPath;
    img.alt = profile.name || "Profile photo";
    wrapper.appendChild(img);
  }

  const body = Site.el("div", "profile-body");
  body.appendChild(Site.el("h1", null, profile.name || ""));

  const role = [profile.title, profile.affiliation].filter(Boolean).join(", ");
  if (role) body.appendChild(Site.el("p", "profile-role", role));

  (profile.bio || []).forEach((paragraph) => {
    const p = Site.el("p", "profile-bio");
    // paragraph is trusted site-owner content from data/profile.json and may
    // contain inline links (e.g. to ./dissertation.html), same convention as
    // news.js's htmltext.
    p.innerHTML = paragraph;
    body.appendChild(p);
  });

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
    body.appendChild(list);
  }

  wrapper.appendChild(body);
  container.appendChild(wrapper);
});
