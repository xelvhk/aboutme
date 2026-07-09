# Roadmap Checklist

## How to Use
- Mark each item as `[x]` when complete.
- Keep short notes and links to commits/PRs.
- Update this file at least once per week.

---

## Phase 0: Baseline and Stability
- [ ] Production site checked manually
- [x] README run/deploy instructions updated
- [x] Lighthouse metrics captured
- [x] Bundle size captured
- [x] Baseline summary added

Notes:
- Date: 2026-06-29
- Result: Local production build passed. Lighthouse after route-level code splitting: Performance 87, Accessibility 95, Best Practices 100, SEO 100.
- Bundle: initial JS 62.36 kB gzip, initial CSS 5.08 kB gzip; route chunks are split for Projects, Blog, AI Studio, Project, and Admin.
- Links: `docs/lighthouse-home.json`

---

## Phase 1: GitHub Projects Quality
- [x] Repo filters reviewed and tuned
- [x] Pinned projects implemented
- [x] Project card metadata improved
- [x] Fallback behavior validated
- [x] Regression check passed

Notes:
- Date: 2026-06-29
- Result: Pinned projects are curated as `vasya_ai`, `tajnyj_ded_bot`, and `aboutme`; project previews use `public/project-previews/<repo-name>.svg`.
- Links: `src/data/cms.js`, `src/data/cms.test.js`

---

## Phase 2: Content and UX
- [x] About section updated
- [x] Skills section updated
- [x] RU copy reviewed
- [x] EN copy reviewed
- [x] Projects loading/error states improved
- [x] Mobile checks completed

Notes:
- Date: 2026-06-29
- Result: macOS-style desktop, RU/EN content, blog terminal UI, AI Studio placeholder, mobile Quick Notes hiding, and pinned project cards are implemented.
- Links: `src/components/macos/MacDesktop.jsx`, `src/components/blog/blog.jsx`, `src/pages/projects.jsx`

---

## Phase 3: SEO and Quality
- [ ] Meta tags validated
- [ ] Open Graph preview validated
- [x] Accessibility pass completed
- [x] Smoke tests added
- [x] QA checklist passed

Notes:
- Date: 2026-06-29
- Result: Lighthouse Accessibility 95; `CI=true npm test -- --watchAll=false` passed 8/8; `npm run build` passed.
- Next: validate Open Graph/social preview image and metadata.
- Links: `docs/lighthouse-home.json`

---

## Phase 4: Automation and CI
- [x] Build workflow added
- [x] Deploy workflow added
- [x] Pre-deploy checks configured
- [ ] CI run verified on default branch
- [ ] Automation docs updated

Notes:
- Date: 2026-06-29
- Result: Local tests/build pass and GitHub Pages deployment flow exists.
- Next: verify the latest default-branch CI run after the next push.
- Links: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`

---

## Weekly Review
- [x] Week 1 review done
- [ ] Week 2 review done
- [ ] Week 3 review done
- [ ] Week 4 review done

Review template:
- Completed this week:
- Blockers:
- Decisions:
- Scope changes:
