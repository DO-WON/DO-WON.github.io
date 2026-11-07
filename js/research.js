/**
 * Renders data/research.json on research.html: an intro, then one block per
 * theme with an overview paragraph and full-width sub-theme cards, each
 * listing selected work (type tag + title + link icon + year).
 *
 * An item with `dissertationChapter: N` pulls its title from the Nth
 * entry of data/dissertation.json, so chapters live in one file shared with
 * dissertation.html; its title links to that chapter's first link.
 */
Site.load("./data/research.json", "research-container", async (container, { intro, callout, themes = [] }) => {
  const needsChapters = themes.some((t) =>
    (t.subthemes || []).some((s) => (s.items || []).some((i) => i.dissertationChapter))
  );
  const dissertation = needsChapters ? await Site.fetchJSON("./data/dissertation.json") : null;
  const chapters = (dissertation && dissertation.chapters) || [];

  // `intro` is a string or an array of paragraphs (trusted site-owner HTML).
  (Array.isArray(intro) ? intro : intro ? [intro] : []).forEach((html) => {
    const p = Site.el("p", "research-intro");
    p.innerHTML = html;
    container.appendChild(p);
  });

  // At-a-glance overview: one tile per theme that has a `summary`,
  // linking to the theme's section below.
  const overviewThemes = themes.filter((t) => t.summary);
  if (overviewThemes.length) {
    const ol = Site.el("ol", "research-overview");
    overviewThemes.forEach((theme) => {
      const li = Site.el("li");
      const a = document.createElement("a");
      a.href = `#${theme.id}`;
      a.className = "overview-tile";
      // Short name = the part of the title before the colon ("Access").
      a.appendChild(Site.el("span", "overview-name", theme.title.split(":")[0]));
      a.appendChild(Site.el("span", "overview-summary", theme.summary));
      li.appendChild(a);
      ol.appendChild(li);
    });
    container.appendChild(ol);
  }

  // Optional one-line callout under the overview (e.g. the dissertation),
  // linking to a page on this site in the same tab.
  if (callout && callout.url) {
    const a = document.createElement("a");
    a.href = callout.url;
    a.className = "research-callout";
    if (callout.label) a.appendChild(Site.el("span", "callout-label", callout.label));
    // Title plus an optional muted note tying it back to the themes above.
    const body = Site.el("span", "callout-body");
    if (callout.text) body.appendChild(Site.el("span", "callout-text", callout.text));
    if (callout.note) body.appendChild(Site.el("span", "callout-note", callout.note));
    a.appendChild(body);
    a.appendChild(Site.el("span", "callout-arrow", "→"));
    container.appendChild(a);
  }

  const renderItem = (item) => {
    const chapter = item.dissertationChapter ? chapters[item.dissertationChapter - 1] : null;
    const title = (chapter || item).title;
    // A chapter links to its first paper link, else its first resource
    // (e.g. the arXiv preprint), else its own section on the dissertation page.
    const url = chapter
      ? (chapter.links || [])[0]?.url ||
        (chapter.resources || [])[0]?.url ||
        `./dissertation.html#study-${item.dissertationChapter}`
      : item.url;
    if (!title) return null;

    // Three aligned columns: type tag | title | year.
    const li = Site.el("li", "work-item");
    const typeCell = Site.el("span", "work-type-cell");
    // `type` (Journal, Conference, Working Paper, Poster, Talk, ...) follows
    // the CV's section headings.
    if (item.type) typeCell.appendChild(Site.el("span", "work-type", item.type));
    li.appendChild(typeCell);

    // Titles are plain text; the link is an icon in its own column
    // (GitHub / PDF / external page), opening in a new tab.
    const titleEl = Site.el("span", "work-title", title);
    if (item.authors) titleEl.title = item.authors;
    li.appendChild(titleEl);

    const linkCell = Site.el("span", "work-link");
    // A poster's PDF gets the poster icon rather than the document icon.
    const isPosterPdf = item.type === "Poster" && /\.pdf($|[?#])/i.test(url || "");
    if (url) linkCell.appendChild(Site.iconLink(url, isPosterPdf ? `Poster (PDF): ${title}` : `Open: ${title}`, isPosterPdf ? "poster" : undefined));
    li.appendChild(linkCell);

    if (item.year) li.appendChild(Site.el("span", "work-year", item.year));
    return li;
  };

  themes.forEach((theme) => {
    const block = Site.el("div", "research-theme");
    block.id = theme.id;
    block.appendChild(Site.el("h2", null, theme.title));
    if (theme.description) {
      const desc = Site.el("p", "theme-description");
      desc.innerHTML = theme.description;
      block.appendChild(desc);
    }

    // Sub-themes stack as full-width cards (one per row) so long paper
    // titles stay on one or two lines and the years line up on the right.
    const subthemes = theme.subthemes || [];
    const grid = Site.el("div", "subtheme-grid");
    subthemes.forEach((sub) => {
      // Optional `lead`: a bridging sentence shown just above the card.
      if (sub.lead) grid.appendChild(Site.el("p", "subtheme-lead", sub.lead));
      const card = Site.el("div", "subtheme");
      card.appendChild(Site.el("h3", "subtheme-title", sub.title));
      if (sub.description) card.appendChild(Site.el("p", "subtheme-description", sub.description));

      const items = (sub.items || []).map(renderItem).filter(Boolean);
      if (items.length) {
        const list = Site.el("ul", "work-list");
        items.forEach((li) => list.appendChild(li));
        card.appendChild(list);
      }
      grid.appendChild(card);
    });
    block.appendChild(grid);

    container.appendChild(block);
  });

  const cv = Site.el("p", "see-all");
  const a = document.createElement("a");
  a.href = "./docs/cv.pdf";
  a.textContent = "Full list of papers and talks in my CV →";
  cv.appendChild(a);
  container.appendChild(cv);

  // Themes render after page load, so the browser's own jump to
  // research.html#<theme-id> has already missed; redo it once they exist.
  const target = location.hash && document.getElementById(location.hash.slice(1));
  if (target) requestAnimationFrame(() => target.scrollIntoView());
});
