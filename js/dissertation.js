/**
 * Renders data/dissertation.json on dissertation.html:
 *   1. the dissertation title as the page heading (with a small
 *      "Dissertation" label above it), the central question, and outline
 *   2. the "big picture" block: paragraphs, then an interactive diagram
 *      (one tile per study; hovering, focusing, or clicking a tile shows its
 *      concern → intervention → effect card), then an optional closing line
 *   3. one card per study (id="study-N", a stable anchor for QR codes),
 *      headed "Study N: <paper title>", with authors, summary, and links,
 *      plus optional tool, presentations, funding, resources, and coverage.
 * Every optional piece hides itself when its data is missing or empty.
 */

/** Line icons for the Big Picture diagram, keyed by `logic[].icon`. */
const DISSERTATION_ICONS = {
  // Speaker with a slash: muting untrustworthy sources.
  mute: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 19h7l10-8v26l-10-8H8z"/><path d="M33 19l9 10M42 19l-9 10"/></svg>',
  // Two speech bubbles in party colors: an unexpected partisan encounter.
  encounter: '<svg viewBox="0 0 48 48" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="bp-blue" d="M5 9h22a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H14l-6 5v-5H5a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3z"/><path class="bp-red" d="M43 19H22a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h12l6 5v-5h3a3 3 0 0 0 3-3V22a3 3 0 0 0-3-3z"/></svg>',
  // Chatbot face in a speech bubble: the civic chatbot.
  civic: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 8h30a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H22l-9 7v-7H9a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z"/><rect x="14" y="14" width="20" height="13" rx="4"/><path d="M24 14v-3"/><circle cx="20" cy="20.5" r="1.2" fill="currentColor"/><circle cx="28" cy="20.5" r="1.2" fill="currentColor"/></svg>',
};

Site.load("./data/dissertation.json", "dissertation-container", async (container, data) => {
  const { title, intro = [], question, outline, contribution, chapters = [] } = data;
  await Site.getOwnerName();

  /** Anchor link to a section on this page. */
  const anchor = (id, text) => {
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.textContent = text;
    return a;
  };

  /**
   * "Label" heading + a list of two-line rows, or nothing when `items` is
   * empty. `renderItem(item)` returns `{ main, sub, date, place }`: `main`
   * and `sub` are arrays of nodes/strings for the first line and the muted
   * second line; `date` and `place` are right-aligned on lines one and two.
   */
  const subList = (heading, items, renderItem) => {
    if (!items.length) return null;
    const wrap = Site.el("div", "study-sublist");
    wrap.appendChild(Site.el("h3", null, heading));
    const ul = Site.el("ul", "resource-list");
    items.forEach((item) => {
      const { main = [], sub = [], date, place } = renderItem(item);
      const li = Site.el("li");
      const mainEl = Site.el("div", "row-main");
      mainEl.append(...main.filter(Boolean));
      li.appendChild(mainEl);
      const subParts = sub.filter(Boolean);
      if (subParts.length) {
        const subEl = Site.el("div", "row-sub");
        subEl.append(...subParts);
        li.appendChild(subEl);
      }
      // Date and place stack in the right column, top-aligned with line one.
      if (date || place) {
        const right = Site.el("div", "row-right");
        if (date) right.appendChild(Site.el("span", "row-date", date));
        if (place) right.appendChild(Site.el("span", "row-place", place));
        li.appendChild(right);
      }
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
    return wrap;
  };

  /**
   * Material links for a presentation as plain accent links, with "(PDF)"
   * spelled out for PDF files: "Poster (PDF)", "Slides (PDF)". If one of them has the same label as
   * the presentation's `kind`, it stands in for the kind tag; otherwise the
   * kind is shown first as muted text.
   */
  const materials = (kind, links = []) => {
    const out = [];
    const hasKindLink = links.some((l) => l.label === kind);
    if (kind && !hasKindLink) out.push(Site.el("span", "row-kind", kind));
    links.forEach(({ label, url }) => {
      if (!url) return;
      const a = Site.link(url, /\.pdf($|[?#])/i.test(url) ? `${label} (PDF)` : label);
      a.className = "material-link";
      out.push(a);
    });
    return out;
  };

  /** Joins parts with " · " separators (strings or nodes), skipping blanks. */
  const dotJoin = (parts) =>
    parts.filter(Boolean).flatMap((p, i) => (i ? [" · ", p] : [p]));

  // --- 1. Heading + framing ---------------------------------------------
  // The static <h1>Dissertation</h1> in dissertation.html becomes the
  // dissertation title, with "Dissertation" kept as a small label above it.
  const h1 = document.querySelector(".page-title");
  if (title && h1) {
    h1.textContent = title;
    h1.before(Site.el("p", "page-eyebrow", "Dissertation"));
  }
  intro.forEach((text) => container.appendChild(Site.el("p", null, text)));
  if (question) container.appendChild(Site.el("p", "dissertation-question", question));
  if (outline) container.appendChild(Site.el("p", null, outline));

  // --- 2. Big picture ----------------------------------------------------
  if (contribution) {
    const block = Site.el("div", "dissertation-block");
    block.id = "big-picture";
    if (contribution.heading) block.appendChild(Site.el("h2", null, contribution.heading));
    (contribution.paragraphs || []).forEach((text) => block.appendChild(Site.el("p", null, text)));

    const logic = contribution.logic || [];
    if (logic.length) block.appendChild(bigPictureDiagram(logic, anchor));

    if (contribution.closing) block.appendChild(Site.el("p", null, contribution.closing));
    container.appendChild(block);
  }

  // --- 3. Studies --------------------------------------------------------
  chapters.forEach((chapter, i) => {
    // Collapsible card: the <summary> (title + authors) is always visible;
    // the rest starts open and collapses on click. Opened automatically when the URL
    // targets it (#study-N, e.g. from a QR code or the diagram's links).
    const card = Site.el("div", "dissertation-block dissertation-study");
    card.id = `study-${i + 1}`;
    const details = Site.el("details");
    details.open = true; // open by default; click the title to collapse
    const head = Site.el("summary");
    head.appendChild(Site.el("p", "study-eyebrow", `Study ${i + 1}`));
    head.appendChild(Site.el("h2", null, chapter.title || `Study ${i + 1}`));
    if (chapter.authors) {
      const authorsEl = Site.el("p", "paper-authors");
      authorsEl.appendChild(Site.formatAuthors(chapter.authors));
      head.appendChild(authorsEl);
    }
    details.appendChild(head);
    card.appendChild(details);
    const block = Site.el("div", "study-body");
    details.appendChild(block);

    // Summary + paper links, separated from the tool and lists by a rule.
    if (chapter.summary || (chapter.links || []).length) {
      const intro = Site.el("div", "study-intro");
      if (chapter.summary) intro.appendChild(Site.el("p", "item-description", chapter.summary));
      if ((chapter.links || []).length) {
        const linksEl = Site.el("p", "link-tags");
        linksEl.appendChild(Site.linkTags(chapter.links));
        intro.appendChild(linksEl);
      }
      block.appendChild(intro);
    }

    const { tool, presentations = [], funding = [], resources = [], coverage = [] } = chapter;
    // Resources (e.g. Working paper → arXiv) and the tool render as a small
    // key–value list whose labels match the section labels below. Resources
    // come first unless the chapter sets `toolFirst` (e.g. when the tool is
    // the project itself).
    const facts = resources.map(({ label, url, venue }) => {
      const text = venue || url;
      return [label, [url ? Site.link(url, text) : text]];
    });
    if (tool && tool.name) {
      const value = [tool.name];
      if ((tool.links || []).length) value.push(" ", Site.linkTags(tool.links));
      if (tool.description) value.push(Site.el("span", "fact-note", tool.description));
      facts[chapter.toolFirst ? "unshift" : "push"](["Tool", value]);
    }
    if (facts.length) {
      const dl = Site.el("dl", "study-facts");
      facts.forEach(([label, value]) => {
        dl.appendChild(Site.el("dt", null, label));
        const dd = Site.el("dd");
        dd.append(...value);
        dl.appendChild(dd);
      });
      block.appendChild(dl);
    }

    // Row: Venue (linked to the event page)                  Sept. 2026
    //      Talk · Slides (PDF) · presented by X               Boston, USA
    //      "Earlier title" (only when the talk used a different title)
    const pres = subList("Presentations", presentations, ({ kind, title: t, venue, url, location, date, presenter, links = [] }) => ({
      main: [venue && (url ? Site.link(url, venue) : venue)],
      date,
      place: location,
      sub: [
        ...dotJoin([...materials(kind, links), presenter && `presented by ${presenter}`]),
        t && Site.el("span", "resource-alt-title", `“${t}”`),
      ],
    }));
    if (pres) block.appendChild(pres);

    // Row: Grant name (linked if `url`)                         2026
    //      Funder · Role: X
    const fund = subList("Funding & Awards", funding, ({ name, org, role, date, url }) => ({
      main: [name && (url ? Site.link(url, name) : name)],
      date,
      sub: dotJoin([org, role && `Role: ${role}`]),
    }));
    if (fund) block.appendChild(fund);

    // Row: Headline (linked)                               Oct. 28, 2026
    //      Outlet · note
    const cov = subList("Media Coverage", coverage, ({ outlet, title: t, url, date, note }) => ({
      main: [url ? Site.link(url, t || outlet) : t || outlet],
      date,
      sub: dotJoin([outlet, note]),
    }));
    if (cov) block.appendChild(cov);

    container.appendChild(card);
  });

  // The #study-N targets only exist after this async render, so the
  // browser's own jump-to-anchor on load misses them (QR codes link here).
  // Opening a collapsed study card first, then scrolling to it.
  const revealHash = () => {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!target) return;
    const details = target.querySelector(":scope > details");
    if (details) details.open = true;
    requestAnimationFrame(() => target.scrollIntoView());
  };
  revealHash();
  window.addEventListener("hashchange", revealHash);
  // Clicking a link to the hash already in the URL fires no hashchange.
  container.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (a && a.getAttribute("href") === location.hash) revealHash();
  });
});

/**
 * The Big Picture diagram: a row of study tiles (an ARIA tablist) above a
 * detail card (the tabpanel). Hovering, focusing, or clicking a tile — or
 * using the arrow keys — selects it; the card shows that study's
 * concern → intervention → expected effect and links to its section.
 */
function bigPictureDiagram(logic, anchor) {
  const wrap = Site.el("div", "bp");

  const tiles = Site.el("div", "bp-tiles");
  tiles.setAttribute("role", "tablist");
  tiles.setAttribute("aria-label", "Studies");
  tiles.style.setProperty("--bp-count", logic.length);

  const panel = Site.el("div", "bp-panel");
  panel.setAttribute("role", "tabpanel");
  panel.id = "bp-panel";
  panel.setAttribute("aria-live", "polite");

  const buttons = logic.map((item, i) => {
    const b = Site.el("button", "bp-tile");
    b.type = "button";
    b.id = `bp-tab-${i}`;
    b.setAttribute("role", "tab");
    b.setAttribute("aria-controls", "bp-panel");
    const icon = Site.el("span", "bp-icon");
    icon.innerHTML = DISSERTATION_ICONS[item.icon] || "";
    b.appendChild(icon);
    b.appendChild(Site.el("span", "bp-study", `Study ${item.study || i + 1}`));
    if (item.label) b.appendChild(Site.el("span", "bp-label", item.label));
    tiles.appendChild(b);
    return b;
  });

  const step = (kind, heading, text) => {
    const s = Site.el("div", `bp-step bp-step-${kind}`);
    s.appendChild(Site.el("p", "bp-step-label", heading));
    s.appendChild(Site.el("p", "bp-step-text", text));
    return s;
  };

  let current = -1;
  const select = (i, { focus = false } = {}) => {
    if (i === current) return;
    current = i;
    buttons.forEach((b, j) => {
      const on = j === i;
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
      b.classList.toggle("is-active", on);
    });
    if (focus) buttons[i].focus();

    const { problem, intervention, outcome, outcomeLabel, study } = logic[i];
    panel.setAttribute("aria-labelledby", buttons[i].id);
    panel.style.setProperty("--bp-pointer", `${((i + 0.5) / logic.length) * 100}%`);
    panel.replaceChildren();
    const flow = Site.el("div", "bp-flow");
    const steps = [
      problem && step("problem", "The concern", problem),
      intervention && step("intervention", "The intervention", intervention),
      outcome && step("outcome", outcomeLabel || "Expected effect", outcome),
    ].filter(Boolean);
    steps.forEach((s, k) => {
      if (k) {
        const arrow = Site.el("span", "bp-arrow", "→");
        arrow.setAttribute("aria-hidden", "true");
        flow.appendChild(arrow);
      }
      flow.appendChild(s);
    });
    panel.appendChild(flow);
    const more = Site.el("p", "bp-more");
    more.appendChild(anchor(`study-${study || i + 1}`, `Go to Study ${study || i + 1} →`));
    panel.appendChild(more);
    // Restart the fade-in on every switch.
    panel.classList.remove("is-fresh");
    void panel.offsetWidth;
    panel.classList.add("is-fresh");
  };

  buttons.forEach((b, i) => {
    b.addEventListener("click", () => select(i));
    b.addEventListener("mouseenter", () => select(i));
    b.addEventListener("focus", () => select(i));
    b.addEventListener("keydown", (e) => {
      const n = buttons.length;
      const next = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select((next + n) % n, { focus: true });
    });
  });

  select(0);
  wrap.appendChild(tiles);
  wrap.appendChild(panel);
  return wrap;
}
