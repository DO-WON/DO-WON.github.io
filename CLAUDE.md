# Academic Website

A JSON-driven personal academic website: vanilla HTML/CSS/JS, no build step, deployable to GitHub Pages as-is. Built on the `cc-academic-website` template.

## Architecture (the one rule that matters)

**Content lives in `data/*.json`, never in HTML.** Each section is rendered client-side by a matching `js/*.js` module via the `Site.load` helper in `js/utils.js`. A section whose data file is missing, empty, or malformed hides itself silently.

Sections added on top of the upstream template follow the identical `Site.load` pattern, so treat them the same way when redesigning or adding data.

Schemas are documented in `.claude/skills/update-site-data/references/schemas.md`. If you change a schema or renderer, update that file in the same session.

## Homepage previews + "See all" pages

Homepage sections can show only the most recent few entries, with a link to a full listing page. This is controlled by data attributes on the section's container `<div>` in `index.html`:

- `data-limit="N"`: show at most N items on the homepage.
- `data-see-all="./news.html"`: URL of the full listing page; the "See all →" link appears only when there are more items than `data-limit`.
- `data-see-all-label="See all news →"`: link text.

Each renderer calls `Site.truncate(container, items)` and `Site.appendSeeAll(container, items.length)` from `js/utils.js`.

Full listing pages live at the repo root, sibling to `index.html`, so they reuse the same `./`-relative paths to `css/`, `js/`, and `data/` with no path rewriting. Each loads the same renderer script(s) as the homepage; its containers have no `data-limit`, so they render the full list.

Some sections are page-only (a listing page with no homepage preview). To give one a homepage preview, add its `<section>` to `index.html` with a `data-limit`/`data-see-all` container and restore its `<script>` tag.

Text fields rendered via `innerHTML` (e.g. profile bio paragraphs, news `htmltext`) are trusted site-owner content and may contain inline HTML links.

## Content outside the data/JS system

- `blog/<slug>/index.html`: one hand-authored static page per long-form blog post (no markdown engine in a no-build site). `data/blog.json` only holds the list metadata that links to these pages.
- `design/`: standalone, self-contained pages with their own inline CSS/JS, not rendered through `Site.load`.
- `js/back-to-top.js`: a floating "back to top" button loaded (with `defer`, right after `theme.js`) on every page, including blog posts (`../../js/back-to-top.js`). Add the same `<script>` tag to any new page.

## Conventions

- Entries in data files go newest-first; match each file's existing indentation.
- Local paths in data files use a `./` prefix (e.g., `./docs/publications/...`).
- Per-paper assets live in `docs/publications/0_LastName_ShortTitle/` (working papers) or `docs/publications/YYYY_LastName_ShortTitle/` (published), each with a `cite.bib` and the PDF.
- After editing any `data/*.json`, validate it: `python3 -m json.tool data/<file>.json`.

## Preview

`python3 -m http.server 8000` from the repo root, then open `http://127.0.0.1:8000/`. Opening `index.html` via `file://` will NOT work, because `fetch` needs HTTP.
