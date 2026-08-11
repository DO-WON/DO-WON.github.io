# Data File Schemas

Schemas and examples for every file under `data/`. Optional fields are marked; each file is rendered by the matching `js/*.js` module.

> **Note:** These schemas describe the template as shipped. If the site has been redesigned (via `/setup-site` or manually), the live `data/*.json` files and `js/*.js` renderers are the ground truth. When they diverge from this file, follow the code and update this file to match.

> **Note:** Most homepage sections only show their most recent few entries (`data-limit` on the container in `index.html`), with a "See all →" link to a full listing page at the repo root (e.g. `news.html`). Adding entries to a `data/*.json` file works the same regardless — the homepage and the full listing page both read the same file, just with different truncation. See "Homepage previews + See all pages" in `CLAUDE.md`.

## data/profile.json — name, bio, links

Object. Rendered by `js/profile.js` (also sets the page title, nav name, and footer).

```json
{
  "name": "Dr. Jane Placeholder",
  "title": "Assistant Professor of Something Interesting",
  "affiliation": "University of Somewhere",
  "photoPath": "./assets/images/headshot.svg",
  "bio": [
    "First paragraph of the bio.",
    "Second paragraph of the bio."
  ],
  "links": [
    { "label": "Google Scholar", "url": "https://scholar.google.com/..." },
    { "label": "Email", "url": "mailto:jane@example.edu" }
  ]
}
```

- `bio` is an array of paragraphs. Each paragraph is rendered via `innerHTML` (trusted site-owner content, same convention as `news.json`'s `htmltext`), so it may contain inline HTML like `<a href="...">links</a>` — e.g. linking out to `./dissertation.html`.
- Optional: `photoPath` (omit to render without a photo).

## data/publications.json — published papers

Array, ordered by year (newest first). Rendered by `js/publications.js`.

```json
{
  "title": "A very important finding about an interesting phenomenon",
  "authors": "Jane Placeholder, Collaborator One, Collaborator Two",
  "publication": "Journal of Important Findings",
  "year": "2025",
  "url": "https://doi.org/10.0000/example.2025",
  "pdfPath": "./docs/publications/2025_Placeholder_ImportantFinding/2025_Placeholder_ImportantFinding.pdf",
  "bibPath": "./docs/publications/2025_Placeholder_ImportantFinding/cite.bib"
}
```

- `year` is a string. `url` is the canonical DOI/publisher link.
- Optional: `pdfPath`, `bibPath` (links only render when present).
- Shared-first-authorship is marked with `†` after author names.
- `authors` should spell the site owner's name exactly as it appears in `data/profile.json`'s `name` field — the renderer (`Site.formatAuthors` in `js/utils.js`) matches that substring and renders it in monospace to pick it out from co-authors. This applies to `publications`, `working_papers`, and `dissertation` alike.

## data/working_papers.json — preprints / under review

Array, newest first. Rendered by `js/working_papers.js`.

```json
{
  "title": "A new preprint that is currently under review",
  "authors": "Jane Placeholder, Collaborator Three",
  "url": "https://doi.org/10.48550/arXiv.0000.00000",
  "id": "modal_placeholder_preprint",
  "pdfPath": "./docs/publications/0_Placeholder_NewPreprint/0_Placeholder_NewPreprint.pdf",
  "bibPath": "./docs/publications/0_Placeholder_NewPreprint/cite.bib"
}
```

- `id` is a unique identifier: `modal_[lowercase_short_identifier]` (author name + key title word).
- Optional: `pdfPath`, `bibPath`, `publication` (status note, e.g. `"Under review at Journal X"`).

## data/dissertation.json — dissertation chapters

Local addition (not part of the upstream template's 8 default sections). Array, in chapter order. Rendered by `js/dissertation.js` using the same card style as papers. Page-only: this section has no preview on `index.html` (see "Page-only sections" in `CLAUDE.md`) — it's rendered in full on `dissertation.html`, reachable via an inline link in the bio paragraph, not the nav.

```json
{
  "title": "Chapter title",
  "authors": "Co-author One, Co-author Two",
  "status": "Field experiment; manuscript in preparation",
  "summary": "One or two sentences on the research question and findings so far.",
  "url": "https://example.org/project-page"
}
```

- Optional: `authors`, `status` (shown in place of a venue line), `summary`, `url` (title links out when present).

## data/news.json — news items

Array of year groups, newest year first; items within a year are newest first. Rendered by `js/news.js`.

```json
{
  "year": "2026",
  "items": [
    {
      "type": "Preprint",
      "htmltext": "New preprint: <a href='https://doi.org/...' target='_blank'>Paper Title</a>."
    }
  ]
}
```

- `type` is one of: `Publication`, `Preprint`, `Talk`, `Award`, `Media`, `Tool`, `General`.
- `htmltext` conventions: single-quoted HTML attributes; links as `<a href='URL' target='_blank'>`; `<em>` for venues; `<code>` for software names. 1–2 sentences, professional tone, emojis only for big milestones.
- Per-type patterns:
  - Publication: `Our paper <a>Title</a> was published in <em>Journal</em>.`
  - Preprint: just the linked title: `New preprint: <a>Title</a>.`
  - Talk: `Gave an invited talk at <a>Event</a>...` or `...accepted for a poster/talk at <a>Conf</a>.`
  - Award: `Honored to receive [award] from <a>Org</a>.`
  - Media: `<a>Outlet</a> covered our paper <a>Title</a>.`
  - Tool: `Created <a><code>name</code></a> — description.`

## data/talks.json — talks and presentations

Array, newest first. Rendered by `js/talks.js`.

```json
{
  "title": "A very important finding about an interesting phenomenon",
  "location": "Workshop on Interesting Things, University of Somewhere",
  "date": "2026",
  "link": "https://example.edu"
}
```

- `date` is a year string (a fuller date like `"March 2026"` also works).
- Optional: `link` (title renders as plain text without it).

## data/software.json — software and tools

Array. Rendered by `js/software.js`.

```json
{
  "title": "example-package",
  "description": "A Python package that does something useful from the command line.",
  "href": "https://github.com/username/example-package"
}
```

## data/ongoing_projects.json — ongoing projects

Array. Rendered by `js/ongoing_projects.js`.

```json
{
  "title": "A large ongoing research project",
  "description": "A multi-year effort to understand an important phenomenon."
}
```

## data/teaching.json — courses taught

Array, newest first. Rendered by `js/teaching.js`.

```json
{
  "title": "Introduction to Interesting Things",
  "role": "Instructor",
  "institution": "University of Somewhere",
  "term": "Spring 2026",
  "description": "An undergraduate introduction to the field.",
  "link": "./docs/teaching/syllabus.pdf"
}
```

- Optional: `description`, `link` (e.g. a syllabus URL or PDF — local addition on top of the upstream schema; when present, the title links to it).

## data/blog.json — long-form posts

Local addition (not part of the upstream template's 8 default sections). Array, newest first. Rendered by `js/blog.js` as a linked list; each entry points at a hand-authored static page under `blog/<slug>/index.html` (there's no markdown engine in a no-build site, so post bodies are plain HTML, not JSON). Page-only: this section has no preview on `index.html` (see "Page-only sections" in `CLAUDE.md`) — it's rendered in full on `blog.html`, which stays in the nav on every page.

```json
{
  "title": "Post title",
  "date": "2026-01-15",
  "url": "./blog/post-slug/index.html",
  "summary": "One-sentence summary shown in the list.",
  "tags": ["tag-one"]
}
```

- Optional: `summary`, `tags` (array of strings, shown alongside the date).

## data/contact.json — contact blurb

Local addition (not part of the upstream template's 8 default sections). Object. Rendered by `js/contact.js`. Never truncated — no "see all" page.

```json
{
  "blurb": "Feel free to reach out if you'd like to chat about my research or teaching.",
  "email": "jane@example.edu"
}
```

- `email` is rendered as a `mailto:` link. Keep it in sync with the "Email" entry in `data/profile.json`'s `links` array — they're separate fields by design (each section reads only its own JSON file), not a bug.

## docs/publications/ directory convention

Each paper has a directory under `docs/publications/` containing its PDF and a `cite.bib`:

- **Working papers (unpublished):** `0_LastName_ShortTitle/` (the `0` prefix means unpublished)
- **Published papers:** `YYYY_LastName_ShortTitle/` (year prefix)
- `ShortTitle` = first 2–3 significant title words, no spaces (e.g., `ImportantFinding`)
