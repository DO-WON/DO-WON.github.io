/** Renders data/blog.json (array of long-form posts, newest first). */
Site.load("./data/blog.json", "blog-container", (container, posts) => {
  Site.truncate(container, posts).forEach(({ title, date, url, summary, tags }) => {
    const item = Site.el("div", "item");
    const heading = Site.el("p", "item-title");
    if (url) heading.appendChild(Site.link(url, title));
    else heading.textContent = title;
    item.appendChild(heading);

    const meta = [date, ...(tags || [])].filter(Boolean).join(" — ");
    if (meta) item.appendChild(Site.el("p", "item-meta", meta));

    if (summary) {
      item.appendChild(Site.el("p", "item-description", summary));
    }
    container.appendChild(item);
  });
  Site.appendSeeAll(container, posts.length);
});
