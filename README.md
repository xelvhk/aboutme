# aboutme

Developer portfolio with auto-synced GitHub projects, bilingual content (RU/EN), and GitHub Pages delivery.

## Problem
- Portfolio content gets stale when projects are updated manually.
- Blog posts and project cards often duplicate effort across tools.
- Mobile and desktop UX need a single consistent visual system.

## Stack
- React 18, React Router
- React Bootstrap
- LocalStorage-based CMS adapter
- GitHub API sync + fallback project dataset
- GitHub Pages (`gh-pages`)

## Setup
```bash
git clone https://github.com/xelvhk/aboutme.git
cd aboutme
npm install
cp .env.example .env
npm start
```

`.env.example`:
```env
REACT_APP_GITHUB_USER=xelvhk
```

## Architecture
- `src/components/macos/*`: desktop shell, topbar, widgets, window system.
- `src/pages/projects.jsx`: GitHub-driven project listing, topic/category filters, pinned cards.
- `src/components/blog/blog.jsx`: markdown post rendering with sanitization.
- `src/data/cms.js`: data adapters for GitHub + local storage cache.
- `scripts/sync-obsidian-posts.js`: sync from Obsidian posts into `src/data/blog.generated.json`.

## Project Previews
GitHub project cards use local preview images when available.

Add a WebP file to `public/project-previews/` using the repository name:

```text
public/project-previews/vasya_ai.webp
public/project-previews/tajnyj_ded_bot.webp
public/project-previews/aboutme.webp
```

If an image is missing or fails to load, the card falls back to the default preview placeholder.

## Demo
- Production: [https://xelvhk.github.io/aboutme/](https://xelvhk.github.io/aboutme/)
- Home  
![Home screenshot](docs/screenshots/home.png)
- Projects  
![Projects screenshot](docs/screenshots/projects.png)
- Blog  
![Blog screenshot](docs/screenshots/blog.png)

## Roadmap
- [ ] Add server-backed admin panel for blog media and post metadata.
- [ ] Add CI job for visual regression snapshots on key pages.
- [ ] Improve Lighthouse mobile score (image pipeline + route-level code split).

## Status
Active development

## CI
- `npm ci`
- `npm run build`

## License
GNU AGPLv3. See [LICENSE](LICENSE).
