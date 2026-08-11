/** Renders data/publications.json (array of published papers, newest first). */
Site.load("./data/publications.json", "publications-container", async (container, papers) => {
  await Site.getOwnerName();
  Site.truncate(container, papers).forEach((paper) => container.appendChild(Site.paperCard(paper)));
  Site.appendSeeAll(container, papers.length);
});
