/**
 * Renders data/teaching.json on teaching.html:
 *   - `intro` paragraph(s) and an optional `interests` key–value list
 *     (same small-label style as the dissertation page's TOOL rows);
 *   - one labelled group per `groups` entry (Instructor, Workshops &
 *     Tutorials, Mentoring, Teaching Assistant), each a list of two-line rows:
 *
 *       Title                                               Term
 *       Institution · Instructor: Name · Syllabus (PDF) · Slides
 *       Detail (what the course was, or who was mentored)
 *
 * Material links are text ("Syllabus (PDF)", "Slides (Korean)"), matching
 * the dissertation page; GitHub links show the GitHub icon. Empty groups
 * hide themselves.
 */
Site.load("./data/teaching.json", "teaching-container", (container, { intro, interests = [], groups = [] }) => {
  (Array.isArray(intro) ? intro : intro ? [intro] : []).forEach((html) => {
    const p = Site.el("p", "teaching-intro");
    p.innerHTML = html; // trusted site-owner content
    container.appendChild(p);
  });

  if (interests.length) {
    const wrap = Site.el("div", "study-sublist");
    wrap.appendChild(Site.el("h3", null, "Teaching Interests"));
    const dl = Site.el("dl", "study-facts");
    interests.forEach(({ label, text }) => {
      dl.appendChild(Site.el("dt", null, label));
      dl.appendChild(Site.el("dd", null, text));
    });
    wrap.appendChild(dl);
    container.appendChild(wrap);
  }

  // Material links: GitHub becomes the GitHub icon; others are text with
  // the format/language spelled out, e.g. "Slides (Korean)",
  // "Syllabus (PDF)".
  const materialLink = ({ label, url, lang }) => {
    if (/github\.com/i.test(url)) return Site.iconLink(url, label || "GitHub");
    const notes = [/\.pdf($|[?#])/i.test(url) && "PDF", lang].filter(Boolean);
    const a = Site.link(url, notes.length ? `${label} (${notes.join(", ")})` : label);
    a.className = "material-link";
    return a;
  };

  groups.forEach(({ label, items = [] }) => {
    if (!items.length) return;
    const wrap = Site.el("div", "study-sublist");
    if (label) wrap.appendChild(Site.el("h3", null, label));
    const ul = Site.el("ul", "resource-list");

    items.forEach(({ title, detail, institution, instructor, term, links = [], evaluation }) => {
      const li = Site.el("li");
      li.appendChild(Site.el("div", "row-main", title));
      // `term` is a string, or an array of lines for multi-semester runs.
      if (term && term.length) {
        const right = Site.el("div", "row-right");
        (Array.isArray(term) ? term : [term]).forEach((line) => right.appendChild(Site.el("span", "row-date", line)));
        li.appendChild(right);
      }
      // Line 2: institution · material links. Line 3: detail (what/who).
      const parts = [institution, instructor && `Instructor: ${instructor}`, ...links.filter((l) => l.url).map(materialLink)].filter(Boolean);
      if (parts.length) {
        const sub = Site.el("div", "row-sub");
        parts.forEach((part, i) => {
          if (i) sub.append(" · ");
          sub.append(part);
        });
        li.appendChild(sub);
      }
      if (detail) li.appendChild(Site.el("div", "row-sub row-note", detail));

      // Optional student-evaluation summary, with translated comments
      // tucked into a collapsible "Student comments (N)".
      if (evaluation && evaluation.summary) {
        const ev = Site.el("div", "row-eval");
        ev.appendChild(Site.el("p", "eval-summary", evaluation.summary));
        const quotes = evaluation.quotes || [];
        if (quotes.length) {
          const det = Site.el("details", "eval-quotes");
          det.appendChild(Site.el("summary", null, `Student comments (${quotes.length})`));
          quotes.forEach((q) => det.appendChild(Site.el("blockquote", null, `“${q}”`)));
          if (evaluation.note) det.appendChild(Site.el("p", "eval-note", evaluation.note));
          ev.appendChild(det);
        }
        li.appendChild(ev);
      }
      ul.appendChild(li);
    });

    wrap.appendChild(ul);
    container.appendChild(wrap);
  });
});
