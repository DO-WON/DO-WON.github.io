/** Renders data/working_papers.json (array of preprints, newest first). */
Site.load("./data/working_papers.json", "working-papers-container", async (container, papers) => {
  await Site.getOwnerName();
  Site.truncate(container, papers).forEach((paper) => container.appendChild(Site.paperCard(paper)));
  Site.appendSeeAll(container, papers.length);
});
