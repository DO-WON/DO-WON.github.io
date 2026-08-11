/** Renders data/dissertation.json (array of dissertation chapters). */
Site.load("./data/dissertation.json", "dissertation-container", async (container, chapters) => {
  await Site.getOwnerName();
  chapters.forEach(({ title, authors, status, summary, url }) => {
    const card = Site.el("article", "paper");

    const heading = Site.el("p", "paper-title");
    if (url) heading.appendChild(Site.link(url, title));
    else heading.textContent = title;
    card.appendChild(heading);

    if (authors) {
      const authorsEl = Site.el("p", "paper-authors");
      authorsEl.appendChild(Site.formatAuthors(authors));
      card.appendChild(authorsEl);
    }
    if (status) card.appendChild(Site.el("p", "paper-venue", status));
    if (summary) card.appendChild(Site.el("p", "item-description", summary));

    container.appendChild(card);
  });
});
