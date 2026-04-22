# Portfolio Roadmap

## Dates
- Start: April 22, 2026
- Time zone: Europe/Moscow

## Phase 0: Baseline and Stability (by April 24, 2026)
- Verify production build at `https://xelvhk.github.io/aboutme/`
- Add/update local run and deploy docs in `README.md`
- Capture baseline metrics:
  - Lighthouse (Performance, Accessibility, Best Practices, SEO)
  - Main bundle size
  - First contentful paint / Largest contentful paint

Definition of Done:
- Site loads without critical errors on desktop and mobile
- Baseline metrics saved in `CHECKLIST.md`

## Phase 1: GitHub Projects Quality (April 25-29, 2026)
- Improve GitHub repo filtering:
  - Exclude irrelevant repos
  - Keep sorting by recent activity
  - Keep stable fallback behavior
- Add support for pinned projects (always on top)
- Improve project cards:
  - Language
  - Stars
  - Last updated
  - Demo link (if available)

Definition of Done:
- Projects section shows consistent, curated list
- Manual + GitHub project merge works without regressions

## Phase 2: Content and UX (April 30-May 7, 2026)
- Refresh About and Skills text to current profile
- Align RU/EN copy quality and style
- Improve loading and error states in Projects page
- Mobile polish for key sections

Definition of Done:
- RU/EN content complete and consistent
- No obvious layout breaks on mobile

## Phase 3: SEO and Quality (May 8-14, 2026)
- Add/verify SEO metadata and Open Graph
- Accessibility pass:
  - Contrast
  - Keyboard focus states
  - Alt text coverage
- Add smoke tests for key routes/pages

Definition of Done:
- Basic SEO preview works
- Accessibility issues reduced and tracked

## Phase 4: Automation and CI (May 15-20, 2026)
- Add GitHub Actions for build and deploy
- Add pre-deploy checks (lint/build/test-smoke)
- Add recurring roadmap review workflow

Definition of Done:
- Deployment can run from CI
- Quality gates prevent broken deploys

## Weekly Review Rule
- Every week:
  - Mark phase progress in `CHECKLIST.md`
  - Record blockers and decisions
  - Re-scope if 2+ tasks were delayed in a row
