# Jerry's Game Boy portfolio

A personal website built with Astro. The console is the page: use the menu, D-pad, A/B buttons, keyboard, or touch to explore About me, My stats, Projects, and Contact. The shell keeps Claude Code's original Game Boy layout; the content and navigation are deliberately simple.

## Edit your details

Update `src/data/profile.ts`. It contains the bio, course, current focus, GitHub username, and projects. The only project listed now is this website. Add other projects only when they exist. Keep links to real pages.

The Stats screen shows details you can verify and links to GitHub. It does not invent skill percentages or personal records.

## Run locally

```bash
npm install
npm run dev
npm run build
```

The local preview address appears in the terminal. The build output is in `dist/`.

## Publish

The intended public repository is `TillingCone/TillingCone.github.io`. Its main branch runs `.github/workflows/deploy.yml` and publishes the built site with GitHub Pages. Set the repository's Pages source to **GitHub Actions**. The public address is `https://TillingCone.github.io`.

A `j3rry.is-a.dev` address is a possible later addition. It requires a separate registration request and should only be configured after that address is approved. Until then, the site's canonical URL and project demo use GitHub Pages.

## Controls

- Tap a menu choice, or use ↑/↓ and A to select it.
- Use B or Select to return to the menu.
- Use Start to return to the menu from anywhere.
- On a keyboard, Enter or Z selects; Esc or X goes back.

The source is in `src/`; CSS palettes are in `src/styles/theme.css` and the screen layout is in `src/styles/screen.css`.


