/**
 * Builds one <li> for a news item. When `year` is given (homepage preview,
 * which flattens items across years with no year headers), it's inserted
 * before the item's bold month, e.g. "<strong>Jun.</strong>" becomes
 * "<strong>2026 Jun.</strong>".
 */
function newsListItem({ type, htmltext }, year) {
  const li = document.createElement("li");
  if (type) li.appendChild(Site.el("span", "news-type", type));
  const span = document.createElement("span");
  // htmltext is trusted site-owner content from data/news.json
  span.innerHTML = year ? htmltext.replace(/<strong>/, `<strong>${year} `) : htmltext;
  span.querySelectorAll("a").forEach((a) => a.setAttribute("rel", "noopener"));
  li.appendChild(span);
  return li;
}

/** Renders data/news.json (array of year groups, newest first). */
Site.load("./data/news.json", "news-container", (container, years) => {
  const limit = parseInt(container.dataset.limit, 10);

  if (limit) {
    // Homepage preview: flatten to the most recent items, no year headers,
    // so each item gets its year prefixed before the month instead.
    const flat = years.flatMap(({ year, items }) => (items || []).map((item) => ({ item, year })));
    const list = Site.el("ul", "news-list");
    flat.slice(0, limit).forEach(({ item, year }) => list.appendChild(newsListItem(item, year)));
    container.appendChild(list);
    Site.appendSeeAll(container, flat.length);
    return;
  }

  years.forEach(({ year, items }) => {
    if (!items || !items.length) return;
    const group = Site.el("div", "news-year");
    group.appendChild(Site.el("h3", null, year));

    const list = Site.el("ul", "news-list");
    items.forEach((item) => list.appendChild(newsListItem(item)));

    group.appendChild(list);
    container.appendChild(group);
  });
});
