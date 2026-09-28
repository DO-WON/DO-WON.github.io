/**
 * Renders data/dissertation.json on dissertation.html: the dissertation
 * title, framing intro, and central question, then one block per chapter
 * organized by the dimension of the information environment it targets.
 */
Site.load("./data/dissertation.json", "dissertation-container", async (container, { title, intro = [], question, outline, chapters = [] }) => {
  await Site.getOwnerName();

  if (title) container.appendChild(Site.el("p", "dissertation-title", title));
  intro.forEach((text) => container.appendChild(Site.el("p", null, text)));
  if (question) container.appendChild(Site.el("p", "dissertation-question", question));
  if (outline) container.appendChild(Site.el("p", null, outline));

  chapters.forEach((chapter, i) => {
    const block = Site.el("div", "dissertation-study");
    const label = chapter.dimension ? `Study ${i + 1}: ${chapter.dimension}` : `Study ${i + 1}`;
    block.appendChild(Site.el("h2", null, label));
    if (chapter.question) block.appendChild(Site.el("p", "theme-description", chapter.question));
    block.appendChild(Site.chapterCard(chapter));
    container.appendChild(block);
  });
});
