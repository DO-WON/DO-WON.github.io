/** Renders data/teaching.json (array of courses, newest first). */
Site.load("./data/teaching.json", "teaching-container", (container, courses) => {
  Site.truncate(container, courses).forEach(({ title, role, institution, term, description, link }) => {
    const item = Site.el("div", "item");
    const heading = Site.el("p", "item-title");
    if (link) heading.appendChild(Site.link(link, title));
    else heading.textContent = title;
    item.appendChild(heading);

    const meta = [role, institution, term].filter(Boolean).join(" — ");
    if (meta) item.appendChild(Site.el("p", "item-meta", meta));

    if (description) {
      item.appendChild(Site.el("p", "item-description", description));
    }
    container.appendChild(item);
  });
  Site.appendSeeAll(container, courses.length);
});
