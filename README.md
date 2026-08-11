# do-won.github.io

Do Won Kim's personal academic website: a JSON-driven, vanilla HTML/CSS/JS site with no build step, deployed to GitHub Pages via [GitHub Actions](.github/workflows/pages.yml). Built and maintained with [Claude Code](https://claude.com/claude-code), following the [cc-academic-website](https://github.com/mr-devs/cc-academic-website) architecture.

## Architecture

**Content lives in `data/*.json`, never in HTML.** Each section of `index.html` is rendered client-side by a matching `js/*.js` module. A section whose data file is missing, empty, or malformed hides itself silently. See [`CLAUDE.md`](CLAUDE.md) for the full section table and conventions, and [`.claude/skills/update-site-data/references/schemas.md`](.claude/skills/update-site-data/references/schemas.md) for the JSON schemas.

```
index.html            # page skeleton; sections are filled from data/
css/styles.css         # site styling
js/                    # one renderer per section + shared utils.js
data/                  # all site content, one JSON file per section
docs/                  # CV, syllabi, paper PDFs/BibTeX (docs/publications/)
assets/                # images, downloadable templates, topic-map visualizations
blog/                  # standalone long-form post pages
design/violets/        # standalone VIOLETS architecture page
.claude/skills/        # setup-site, update-site-data, preview-site
```

## Updating content

Run `/update-site-data` in Claude Code and describe the change (paste a DOI/arXiv link, say a paper was published, add a news item, etc.), or edit the `data/*.json` files directly — schemas are documented in [`.claude/skills/update-site-data/references/schemas.md`](.claude/skills/update-site-data/references/schemas.md).

## Preview locally

```bash
python3 -m http.server 8000
# open http://127.0.0.1:8000/
```

Opening `index.html` via `file://` will not work — the page fetches its JSON over HTTP. Or run `/preview-site` in Claude Code, which validates the data files first.

## Deploying

Pushing to `main` triggers [`.github/workflows/pages.yml`](.github/workflows/pages.yml), which uploads the repository as-is to GitHub Pages — no build step.

## License

The code in this repository is licensed under the terms in [`LICENSE.md`](LICENSE.md). Site content (bio, papers, news, etc.) belongs to Do Won Kim.
