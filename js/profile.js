/**
 * Icon badges for profile links, keyed by the `label` field in
 * data/profile.json (case-insensitive). Generic concepts (CV, Email,
 * Google Scholar) get a hand-drawn line icon; GitHub and Bluesky use their
 * logo marks (Simple Icons paths, CC0); the remaining brand services
 * (LinkedIn, Twitter, ORCID) get a short monogram, plus a fallback for any
 * unrecognized label.
 */
const PROFILE_ICONS = {
  cv: '<span class="monogram">CV</span>',
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
  "google scholar": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3Z"/><path d="M5 13.18v4c0 1 3 3 7 3s7-2 7-3v-4L12 17 5 13.18Z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
  bluesky: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/></svg>',
  linkedin: '<span class="monogram">in</span>',
  twitter: '<span class="monogram">X</span>',
  orcid: '<span class="monogram">iD</span>',
};
const DEFAULT_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>';

/** Renders data/profile.json into the About section, nav, title, and footer.
 *  `name` is used for the nav/title/footer (and author highlighting) only. */
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

  // Optional photo. The current site omits `photoPath` so the bio starts
  // immediately; the name itself is only shown in the site header (nav),
  // never repeated as an <h1> here.
  if (profile.photoPath) {
    const img = Site.el("img", "profile-photo");
    img.src = profile.photoPath;
    img.alt = profile.name || "Profile photo";
    wrapper.appendChild(img);
  }

  const body = Site.el("div", "profile-body");

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
