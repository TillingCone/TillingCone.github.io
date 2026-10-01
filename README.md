# Jerry's portfolio

Jerry's simple Game Boy-inspired portfolio is live at [tillingcone.github.io](https://tillingcone.github.io/). The page has an introduction, a few personal details, and a place to share projects as they are built.

## Edit the content

Update `site/profile.js` to change the bio, details, project list, or links. Keep personal claims and links accurate. The site is plain HTML, CSS, and JavaScript; no build step is needed.

## Preview locally

From the repository root, run a static file server. For example:

```bash
python -m http.server 8000 --directory site
```

Then open `http://localhost:8000`.

## Publish

Changes to `main` trigger `.github/workflows/deploy.yml`, which uploads `site/` to GitHub Pages. The free public URL is `https://tillingcone.github.io/`. A `j3rry.is-a.dev` domain would require a separate registration and approval before configuring it here.

