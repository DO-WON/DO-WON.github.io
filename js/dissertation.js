/**
 * Renders data/dissertation.json on dissertation.html:
 *   1. the dissertation title as the page heading (with a small
 *      "Dissertation" label above it), the central question, and outline
 *   2. a table of contents (Big Picture + one entry per study)
 *   3. the "big picture" block: paragraphs, then an interactive diagram
 *      (one tile per study; hovering, focusing, or clicking a tile shows its
 *      concern → intervention → effect card), then a closing line
 *   4. one card per study (id="study-N", a stable anchor for QR codes),
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

  // Each study is headed by its paper title; the dimension, guiding
  // question, and status are covered by the Big Picture diagram instead.
  const studyLabel = (chapter, i) =>
    chapter.title ? `Study ${i + 1}: ${chapter.title}` : `Study ${i + 1}`;

  /** Anchor link to a section on this page. */
  const anchor = (id, text) => {
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.textContent = text;
    return a;
  };

  /** "Label" heading + <ul> of items, or nothing when `items` is empty. */
  const subList = (heading, items, renderItem) => {
    if (!items.length) return null;
    const wrap = Site.el("div", "study-sublist");
    wrap.appendChild(Site.el("h3", null, heading));
    const ul = Site.el("ul", "resource-list");
    items.forEach((item) => {
      const li = Site.el("li");
      renderItem(li, item);
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
    return wrap;
  };

  /** Appends " · meta · meta" in muted text for the non-empty parts. */
  const appendMeta = (li, parts) => {
    const text = parts.filter(Boolean).join(" · ");
    if (text) li.appendChild(Site.el("span", "resource-meta", ` · ${text}`));
  };

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

  // --- 2. Table of contents ----------------------------------------------
  const toc = Site.el("nav", "dissertation-toc");
  toc.setAttribute("aria-label", "Contents");
  toc.appendChild(Site.el("p", "toc-label", "Contents"));
  const tocList = Site.el("ol");
  if (contribution) {
    const li = Site.el("li");
    li.appendChild(anchor("big-picture", contribution.heading || "The Big Picture"));
    tocList.appendChild(li);
  }
  chapters.forEach((chapter, i) => {
    const li = Site.el("li");
    li.appendChild(anchor(`study-${i + 1}`, studyLabel(chapter, i)));
    tocList.appendChild(li);
  });
  toc.appendChild(tocList);
  container.appendChild(toc);

  // --- 3. Big picture ----------------------------------------------------
  if (contribution) {
    const block = Site.el("div", "dissertation-block");
    block.id = "big-picture";
    block.appendChild(Site.el("h2", null, contribution.heading || "The Big Picture"));
    (contribution.paragraphs || []).forEach((text) => block.appendChild(Site.el("p", null, text)));

    const logic = contribution.logic || [];
    if (logic.length) block.appendChild(bigPictureDiagram(logic, anchor));

    if (contribution.closing) block.appendChild(Site.el("p", null, contribution.closing));
    container.appendChild(block);
  }

  // --- 4. Studies --------------------------------------------------------
  chapters.forEach((chapter, i) => {
    // Collapsible card: the <summary> (title + authors) is always visible;
    // the rest starts open and collapses on click. Opened automatically when the URL
    // targets it (#study-N, e.g. from a QR code or the diagram's links).
    const card = Site.el("div", "dissertation-block dissertation-study");
    card.id = `study-${i + 1}`;
    const details = Site.el("details");
    details.open = true; // open by default; click the title to collapse
    const head = Site.el("summary");
    head.appendChild(Site.el("h2", null, studyLabel(chapter, i)));
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
    // Resources (e.g. "Working paper: arXiv") and the tool render as plain
    // "Label: value" lines with no heading. Resources come first unless the
    // chapter sets `toolFirst` (e.g. VIOLETS, where the tool is the project).
    const resourceLines = resources.map(({ label, url, venue }) => {
      const p = Site.el("p", "study-tool");
      p.appendChild(Site.el("strong", null, `${label}: `));
      const text = venue || url;
      p.appendChild(url ? Site.link(url, text) : document.createTextNode(text));
      return p;
    });

    let toolLine = null;
    if (tool && tool.name) {
      toolLine = Site.el("p", "study-tool");
      toolLine.appendChild(Site.el("strong", null, "Tool: "));
      toolLine.appendChild(document.createTextNode(tool.name));
      if (tool.description) toolLine.appendChild(Site.el("span", "resource-meta", `. ${tool.description}`));
      if ((tool.links || []).length) {
        toolLine.appendChild(document.createTextNode(" "));
        toolLine.appendChild(Site.linkTags(tool.links));
      }
    }

    const lines = chapter.toolFirst ? [toolLine, ...resourceLines] : [...resourceLines, toolLine];
    lines.filter(Boolean).forEach((line) => block.appendChild(line));

    // [Talk] Venue, Location · date · presented by X  [Slides]
    //   "Earlier title" (only when the talk used a different title)
    const pres = subList("Presentations", presentations, (li, { kind, title: t, venue, location, date, presenter, links = [] }) => {
      if (kind) li.appendChild(Site.el("span", "work-type", kind));
      li.appendChild(document.createTextNode(` ${[venue, location].filter(Boolean).join(", ")}`));
      appendMeta(li, [date, presenter && `presented by ${presenter}`]);
      if (links.length) {
        li.appendChild(document.createTextNode(" "));
        li.appendChild(Site.linkTags(links));
      }
      if (t) li.appendChild(Site.el("span", "resource-alt-title", `“${t}”`));
    });
    if (pres) block.appendChild(pres);

    const fund = subList("Funding & Awards", funding, (li, { name, org, role, date, url }) => {
      const text = [name, org].filter(Boolean).join(", ");
      li.appendChild(url ? Site.link(url, text) : document.createTextNode(text));
      appendMeta(li, [role && `Role: ${role}`, date]);
    });
    if (fund) block.appendChild(fund);

    const cov = subList("In the News", coverage, (li, { outlet, title: t, url, date, note }) => {
      if (outlet) li.appendChild(Site.el("strong", null, `${outlet}: `));
      li.appendChild(url ? Site.link(url, t || outlet) : document.createTextNode(t || ""));
      appendMeta(li, [date, note]);
    });
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
