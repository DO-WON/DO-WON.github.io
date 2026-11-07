# Data File Schemas

Schemas and examples for every file under `data/`. Optional fields are marked; each file is rendered by the matching `js/*.js` module.

> **Note:** These schemas describe the template as shipped. If the site has been redesigned (via `/setup-site` or manually), the live `data/*.json` files and `js/*.js` renderers are the ground truth. When they diverge from this file, follow the code and update this file to match.

> **Note:** Most homepage sections only show their most recent few entries (`data-limit` on the container in `index.html`), with a "See all →" link to a full listing page at the repo root (e.g. `news.html`). Adding entries to a `data/*.json` file works the same regardless — the homepage and the full listing page both read the same file, just with different truncation. See "Homepage previews + See all pages" in `CLAUDE.md`.

## data/profile.json — name, roles, bio, links

Object. Rendered by `js/profile.js` (also sets the page title, nav name, and footer). The About section is a two-column layout: a narrow side column with the name (plus optional pronunciation), the `roles` lines and the link badges, next to the `bio` paragraphs. It stacks into one column on screens narrower than 700px.

```json
{
  "name": "Dr. Jane Placeholder",
  "pronunciation": "Jāne",
  "roles": [
    "PhD Candidate, <a href=\"https://ischool.example.edu/\">Information</a>",
    "University of Somewhere",
    "Advised by <a href=\"https://example.edu/adv\">Advisor Name</a>"
  ],
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

- `name` is rendered as the heading of the side column and also drives the nav name, page title, footer, and author highlighting in paper lists.
- `pronunciation` (optional) is shown in muted text in parentheses after the name.
- `roles` is an array of short lines shown under the name (position, department, affiliation, advisors…). Each line is rendered via `innerHTML`, so it may contain inline links. Legacy `title`/`affiliation` fields are still accepted as a single-line fallback when `roles` is absent.
- `bio` is an array of paragraphs. Each paragraph is rendered via `innerHTML` (trusted site-owner content, same convention as `news.json`'s `htmltext`), so it may contain inline HTML like `<a href="...">links</a>` (e.g. a link to another page of the site). Don't repeat the position/affiliation here; that belongs in `roles`.
- `links` render as icon badges under the roles. Icons are keyed by `label` (case-insensitive) in `PROFILE_ICONS` in `js/profile.js`; unknown labels get a generic external-link icon.
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

## data/dissertation.json — dissertation overview and chapters

Local addition (not part of the upstream template's default sections). An object rendered by `js/dissertation.js` on `dissertation.html` (page-only: no preview on `index.html`). `data/research.json` references chapters by position (`dissertationChapter: N`), so keep chapter order stable.

```json
{
  "title": "Dissertation title",
  "contribution": {
    "heading": "Optional section heading (omit for none)",
    "paragraphs": ["Plain-text paragraph."],
    "logic": [
      { "study": 1, "icon": "mute", "label": "Short tile label",
        "problem": "The concern this study addresses.",
        "intervention": "What the study does.",
        "outcomeLabel": "Finding",
        "outcome": "Result, or the expected effect." }
    ],
    "closing": "Closing paragraph."
  },
  "chapters": [
    {
      "title": "Chapter / paper title",
      "authors": "Jane Placeholder, Co-author One",
      "summary": "One or two sentences on the design and findings.",
      "links": [{ "label": "Paper", "url": "https://doi.org/..." }],
      "resources": [{ "label": "Working paper", "venue": "arXiv", "url": "https://arxiv.org/abs/..." }],
      "tool": { "name": "Tool name", "description": "Optional one line.", "links": [{ "label": "GitHub", "url": "https://github.com/..." }] },
      "presentations": [
        { "kind": "Poster", "venue": "Conference name", "url": "https://event-page...", "location": "City, Country", "date": "Sept. 2026",
          "links": [{ "label": "Poster", "url": "./docs/dissertation/..." }] }
      ],
      "funding": [{ "name": "Grant name", "org": "Funder", "date": "2026", "url": "https://..." }],
      "coverage": [{ "outlet": "Outlet", "title": "Headline", "date": "Oct. 2026", "note": "optional, e.g. segment time", "url": "https://..." }]
    }
  ]
}
```

- `title` becomes the page `<h1>`, with a small "Dissertation" label above it.
- `contribution` (optional) renders the paragraphs, then `logic` as an interactive diagram: one tile per study (`icon`: `mute` | `encounter` | `civic`, from `DISSERTATION_ICONS` in `js/dissertation.js`), and selecting a tile shows its concern → intervention → outcome card linking to `#study-N`. `outcomeLabel` defaults to "Expected effect"; set it to `"Finding"` once a study has results.
- Each chapter renders as a collapsible card (`<details>`, open by default) headed by a small "Study N" label and the chapter `title`, with `authors` always visible and everything else inside.
- Each study gets a stable anchor `#study-N` (1-based chapter position) that may be printed in QR codes, so don't reorder chapters. A `#study-N` URL opens and scrolls to that card.
- All fields are optional except each chapter's `title`; empty arrays hide their block.
- `links` render as bracketed link tags below the summary; a `GitHub` label renders as the GitHub logo (`Site.icons.github`, via `Site.linkTags`).
- `resources` and `tool` render as a small key–value list (label → linked value), resources first (set `"toolFirst": true` on a chapter to put the tool first). `presentations` (newest first; `kind` is a tag like Talk/Poster; `url` links the venue name to the event page; `links` hold materials such as `Slides`/`Poster`/`Extended abstract` PDFs, shown as "Label (PDF)" links; a link whose label equals `kind` replaces the kind tag; optional `title` and `presenter`), `funding` (optional `role`, `url`), and `coverage` render as lists under their own headings.
- `research.json` items with `dissertationChapter` link to the chapter's first `links` entry, falling back to its first `resources` entry, then `#study-N`.
- Legacy fields `dimension`, `question`, `status`, `intro`, and `outline` are accepted but not rendered.

## data/research.json — Research page themes

Local addition. Object rendered by `js/research.js` on `research.html` (page-only; linked from the nav), styled like the rest of the site (plain text, hairline rules): an intro, then per theme an `h2`, an overview paragraph (how the theme connects to the others), and a grid of sub-theme columns, each listing selected work as title + year.

```json
{
  "intro": "Intro paragraph (HTML allowed, e.g. a link to ./docs/cv.pdf).",
  "themes": [
    {
      "id": "theme-one",
      "title": "Theme Title",
      "description": "Theme overview paragraph (HTML allowed).",
      "subthemes": [
        {
          "title": "Sub-theme Title",
          "description": "Guiding question for this card.",
          "items": [
            {
              "type": "Journal",
              "title": "Paper title",
              "authors": "Jane Placeholder, Co-author",
              "url": "https://doi.org/...",
              "year": "2026"
            },
            { "type": "Working Paper", "dissertationChapter": 1, "year": "2026" }
          ]
        }
      ]
    }
  ]
}
```

- `id` is the anchor (`research.html#theme-one`).
- Items are compact: `title` (linked when `url` is set; opens in a new tab) and `year` on the right. `authors` is optional and shown only as a hover tooltip; the full citation lives in the CV.
- `type` is shown as a small tag before the title. Use the CV's section headings, picking the most advanced output for each work: `Journal`, `Conference` (refereed proceedings), `Working Paper`, `Talk`, `Poster`, `Tutorial`, `Software`.
- `dissertationChapter: N` pulls the title (and link) from the Nth entry of `data/dissertation.json`, so chapters aren't duplicated; it shows `year` like any other item.
- The grid width follows the card count: 1 card spans full width, 3 cards get three columns, 2 or 4 cards get two (all collapse to one column on mobile). Order items by importance.

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

## data/teaching.json — teaching, mentoring, and TA work

Object. Rendered by `js/teaching.js` on `teaching.html` (no homepage preview).

```json
{
  "intro": "One or two sentences on teaching goals (string, or array of paragraphs; HTML allowed).",
  "interests": [
    { "label": "Methods", "text": "Research design, quantitative methods, causal inference" }
  ],
  "groups": [
    {
      "label": "Instructor",
      "items": [
        {
          "title": "COURSE101: Course title",
          "institution": "University of Somewhere",
          "term": "Fall 2026",
          "detail": "Optional third line: format, topic, or who was mentored.",
          "links": [{ "label": "Syllabus", "url": "./docs/teaching/syllabus.pdf" }]
        }
      ]
    }
  ]
}
```

- Groups in use: `Instructor`, `Workshops & Tutorials`, `Mentoring`, `Teaching Assistant`. Items newest first within a group; empty groups hide.
- Each item renders as: title with `term` on the right (a string, or an array of lines, e.g. `["Fall 2021, Spring 2022", "Fall 2022, Summer 2023"]`); then `institution · Instructor: <instructor> · links` (`instructor` optional, used for TA roles); then `detail` in italics. Links show as text ("Syllabus (PDF)" for PDFs, otherwise the label); add `"lang": "Korean"` to a link for non-English material ("Slides (Korean)"); GitHub links render as the GitHub icon.
- `interests` renders as a small key–value list under "Teaching Interests".
- Optional `evaluation` on an item: `{ "summary": "...", "quotes": ["..."], "note": "Translated from Korean by the author." }`. Renders as a highlighted line under the row, with the quotes in a collapsible "Student comments (N)". Publish summaries and short TA-related quotes only, not full institutional evaluation reports (they may include other instructors' scores).
- Keep entries consistent with the CV's Teaching & Mentoring section.

## data/blog.json — long-form posts

Local addition (not part of the upstream template's 8 default sections). Array, newest first. Rendered by `js/blog.js` as a linked list; each entry points at a hand-authored static page under `blog/<slug>/index.html` (there's no markdown engine in a no-build site, so post bodies are plain HTML, not JSON). Page-only: no preview on `index.html`; rendered in full on `blog.html`.

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
