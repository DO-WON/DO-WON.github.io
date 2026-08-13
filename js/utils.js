/**
 * Shared helpers for the JSON-driven sections.
 *
 * Every section module follows the same pattern:
 *   Site.load("data/foo.json", "container-id", renderFn)
 * The section stays hidden unless its JSON file loads and contains data,
 * so removing/emptying a data file cleanly removes the section.
 */
const Site = {
  ownerName: null,

  /**
   * Resolves the site owner's name (from data/profile.json), cached after
   * the first call. Used to pick out the owner's own name in author lists.
   */
  async getOwnerName() {
    if (this.ownerName === null) {
      const profile = await this.fetchJSON("./data/profile.json");
      this.ownerName = (profile && profile.name) || "";
    }
    return this.ownerName;
  },

  /**
   * Renders an author list, wrapping the site owner's name (if present) in
   * a `.self-name` span so it's picked out from co-authors.
   */
  formatAuthors(authorsStr) {
    const frag = document.createDocumentFragment();
    const idx = this.ownerName ? authorsStr.indexOf(this.ownerName) : -1;
    if (idx === -1) {
      frag.appendChild(document.createTextNode(authorsStr));
      return frag;
    }
    frag.appendChild(document.createTextNode(authorsStr.slice(0, idx)));
    frag.appendChild(this.el("span", "self-name", this.ownerName));
    frag.appendChild(document.createTextNode(authorsStr.slice(idx + this.ownerName.length)));
    return frag;
  },

  /**
   * Fetch a JSON data file. Returns null (instead of throwing) when the
   * file is missing or malformed so a broken file hides its section
   * rather than breaking the page. Errors are logged to the console.
   */
  async fetchJSON(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`Failed to load ${path}:`, err);
      return null;
    }
  },

  /**
   * Load a data file and render it into a container. Reveals the parent
   * <section> only when there is data to show.
   */
  async load(dataPath, containerId, render) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = await this.fetchJSON(dataPath);
    const isEmpty =
      data == null ||
      (Array.isArray(data) && data.length === 0) ||
      (typeof data === "object" && Object.keys(data).length === 0);
    if (isEmpty) return;

    render(container, data);
    const section = container.closest("section");
    if (section) section.hidden = false;
  },

  /** Create an element with a class and optional text content. */
  el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  },

  /**
   * Render one paper card (shared by publications and working papers).
   * Fields used: title, url, authors, publication, year, pdfPath, bibPath.
   */
  paperCard(paper) {
    const card = this.el("article", "paper");

    const title = this.el("p", "paper-title");
    if (paper.url) title.appendChild(this.link(paper.url, paper.title));
    else title.textContent = paper.title;
    card.appendChild(title);

    if (paper.authors) {
      const authors = this.el("p", "paper-authors");
      authors.appendChild(this.formatAuthors(paper.authors));
      card.appendChild(authors);
    }

    const venue = [paper.publication, paper.year].filter(Boolean).join(", ");
    if (venue) card.appendChild(this.el("p", "paper-venue", venue));

    const links = this.el("p", "paper-links");
    if (paper.pdfPath) links.appendChild(this.link(paper.pdfPath, "[pdf]"));
    if (paper.bibPath) links.appendChild(this.link(paper.bibPath, "[bib]"));
    if (links.childNodes.length) card.appendChild(links);

    return card;
  },

  /** Create an external link (opens in a new tab). */
  link(href, text) {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = text;
    a.target = "_blank";
    a.rel = "noopener";
    return a;
  },

  /**
   * Homepage section previews show only the most recent few items, with a
   * link to a dedicated page listing everything. A container opts into
   * this by setting `data-limit` (item count) and `data-see-all` (page
   * URL) in index.html; the standalone listing pages omit both attributes
   * so their containers render the full, untruncated list.
   *
   * Call `Site.truncate(container, items)` to get the (possibly shortened)
   * array to render, then `Site.appendSeeAll(container, items.length)`
   * after rendering to add the "See all" link when items were cut.
   */
  truncate(container, items) {
    const limit = parseInt(container.dataset.limit, 10);
    if (!limit || items.length <= limit) return items;
    return items.slice(0, limit);
  },

  /** Appends a "See all <label>" link if `totalCount` exceeds the
   *  container's `data-limit` and it has a `data-see-all` URL. */
  appendSeeAll(container, totalCount) {
    const limit = parseInt(container.dataset.limit, 10);
    const href = container.dataset.seeAll;
    if (!limit || totalCount <= limit || !href) return;
    const p = this.el("p", "see-all");
    const a = document.createElement("a");
    a.href = href;
    a.textContent = container.dataset.seeAllLabel || "See all →";
    p.appendChild(a);
    container.appendChild(p);
  },
};

// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  if (!nav || !toggle) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll(".nav-links a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
});
