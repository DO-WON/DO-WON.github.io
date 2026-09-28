/**
 * Renders data/research.json on research.html: an intro, then one block per
 * theme with an overview paragraph and a grid of sub-theme columns, each
 * listing selected work (title + year).
 *
 * An item with `dissertationChapter: N` pulls its title/url from the Nth
 * entry of data/dissertation.json, so chapters live in one file shared with
 * dissertation.html.
 */
Site.load("./data/research.json", "research-container", async (container, { intro, themes = [] }) => {
  const needsChapters = themes.some((t) =>
    (t.subthemes || []).some((s) => (s.items || []).some((i) => i.dissertationChapter))
  );
  const dissertation = needsChapters ? await Site.fetchJSON("./data/dissertation.json") : null;
  const chapters = (dissertation && dissertation.chapters) || [];

  if (intro) {
    const p = Site.el("p", "research-intro");
    p.innerHTML = intro; // trusted site-owner content; may contain links
    container.appendChild(p);
  }

  const renderItem = (item) => {
    const chapter = item.dissertationChapter ? chapters[item.dissertationChapter - 1] : null;
    const { title, url } = chapter || item;
    if (!title) return null;

    const li = Site.el("li", "work-item");
    const titleEl = Site.el("span", "work-title");
    if (url) titleEl.appendChild(Site.link(url, title));
    else titleEl.textContent = title;
    if (item.authors) titleEl.title = item.authors;
    li.appendChild(titleEl);

    const meta = chapter ? `Ch. ${item.dissertationChapter}` : item.year;
    if (meta) li.appendChild(Site.el("span", "work-year", meta));
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

    // Column count follows the card count: 1 → full width, 3 → three
    // columns, otherwise two (so 2 and 4 cards stay even).
    const subthemes = theme.subthemes || [];
    const cols = subthemes.length === 1 ? 1 : subthemes.length === 3 ? 3 : 2;
    const grid = Site.el("div", `subtheme-grid cols-${cols}`);
    subthemes.forEach((sub) => {
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
