# Do Won Kim — Academic Website

A JSON-driven personal academic website: vanilla HTML/CSS/JS, no build step, deployable to GitHub Pages as-is.

## Architecture (the one rule that matters)

**Content lives in `data/*.json`, never in HTML.** Each section of `index.html` is rendered client-side by a matching `js/*.js` module via the `Site.load` helper in `js/utils.js`. A section whose data file is missing, empty, or malformed hides itself silently.

| Section | Data file | Renderer |
| --- | --- | --- |
| About/profile | `data/profile.json` | `js/profile.js` |
| News | `data/news.json` | `js/news.js` |
| Publications | `data/publications.json` | `js/publications.js` |
| Working papers | `data/working_papers.json` | `js/working_papers.js` |
| Ongoing projects | `data/ongoing_projects.json` | `js/ongoing_projects.js` |
| Talks | `data/talks.json` | `js/talks.js` |
| Teaching | `data/teaching.json` | `js/teaching.js` |
| Software | `data/software.json` | `js/software.js` |
| Contact | `data/contact.json` | `js/contact.js` |

`dissertation`, `blog`, and `contact` are local additions on top of the upstream `cc-academic-website` template (which ships the other 8 sections only) — they follow the identical `Site.load` pattern, so treat them the same way when redesigning or adding data. `dissertation` and `blog` aren't rendered on the homepage at all (see "Page-only sections" below) — their data files and renderers are used only by `dissertation.html`/`blog.html`, not `index.html`.

Schemas are documented in `.claude/skills/update-site-data/references/schemas.md`. If you change a schema or renderer, update that file in the same session.

## Homepage previews + "See all" pages

Most homepage sections show only the most recent few entries, with a link to a dedicated page listing everything — a local addition on top of the upstream template. This is controlled entirely by data attributes on the section's container `<div>` in `index.html`:

- `data-limit="N"` — show at most N items on the homepage.
- `data-see-all="./news.html"` — URL of the full listing page; the "See all →" link only appears when there are more items than `data-limit`.
- `data-see-all-label="See all news →"` — link text.

The shared logic lives in `Site.truncate(container, items)` and `Site.appendSeeAll(container, items.length)` in `js/utils.js`; each renderer calls both. `news.js` is a special case since `data/news.json` is grouped by year — when `data-limit` is set it flattens all years into one recent-items list instead of grouping by year, and prefixes each item's year onto its bold month (e.g. `<strong>2026 Jun.</strong>`) since the flattened list has no year headers to supply that context; the full `news.html` listing keeps just the month under its year headings.

The full listing pages (`news.html`, `publications.html`, `working-papers.html`, `projects.html`, `talks.html`, `teaching.html`, `software.html`, `blog.html`, `dissertation.html`) live at the repo root — sibling to `index.html`, not nested in a subdirectory — specifically so they can reuse the same `./`-relative paths to `css/`, `js/`, and `data/` with no path-rewriting. Each loads the same renderer script as the homepage, but its container has no `data-limit`, so it renders the full list. `about` and `contact` are always short enough that they're never truncated and have no "see all" page.

### Page-only sections (no homepage presence)

`dissertation` and `blog` have a full listing page but **no section on `index.html` at all** — not even a truncated preview. This differs from the pattern above (which always shows a homepage preview).

- **Blog** stays in the nav (`<li><a href="./blog.html">Blog</a></li>` on every page, including `index.html`), linking straight to `blog.html` since there's no homepage anchor to scroll to.
- **Dissertation** has no nav entry at all. It's reachable only via an inline link in the bio paragraph in `data/profile.json` (`For more details, see my <a href="./dissertation.html">dissertation</a>.`). This means `js/profile.js` renders bio paragraphs via `innerHTML`, not `textContent` — bio text is trusted site-owner content and may contain inline HTML links, same convention as `news.js`'s `htmltext` field.

If you re-add a homepage preview for either section later, follow the standard pattern above instead (add the `<section>` back to `index.html` with a `data-limit`/`data-see-all` container, restore its `<script>` tag, and restore its nav anchor link).

## Content outside the data/JS system

- `blog/<slug>/index.html` — one hand-authored static page per long-form blog post (there's no markdown engine in a no-build site). `data/blog.json` only holds the list metadata (title/date/url/summary) that links to these pages.
- `design/violets/index.html` — a standalone, self-contained architecture-diagram page for the VIOLETS dissertation project. It has its own inline CSS/JS and is not rendered through `Site.load`; it's linked from the `dissertation` section's Chapter 3 entry.
- `assets/topic_maps/` — two large exported Plotly HTML visualizations, kept as directly-linkable static files, not wired into the nav.

## Conventions

- Entries in data files go newest-first; match each file's existing indentation.
- Local paths in data files use a `./` prefix (e.g., `./docs/publications/...`).
- Per-paper assets live in `docs/publications/0_LastName_ShortTitle/` (working papers) or `docs/publications/YYYY_LastName_ShortTitle/` (published), each with a `cite.bib` and the PDF.
- After editing any `data/*.json`, validate it: `python3 -m json.tool data/<file>.json`.

## Skills

- `/setup-site` — design/build the site from reference URLs, screenshots, or design notes (initial setup or redesign).
- `/update-site-data` — add/convert papers, news, talks, software, projects, teaching, or profile edits.
- `/preview-site` — validate data files, serve locally (`python3 -m http.server`), and verify sections render.

## Preview

`python3 -m http.server 8000` from the repo root, then open `http://127.0.0.1:8000/`. Opening `index.html` via `file://` will NOT work — `fetch` needs HTTP.
