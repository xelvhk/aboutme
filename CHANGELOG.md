# Changelog

All notable changes to this project will be documented in this file.

The format follows a lightweight release-notes style.

## [Unreleased]

### Changed

- Split route-level page bundles for Projects, Blog, AI Studio, Project, and Admin.
- Moved Bootstrap CSS out of the initial app entry and into Bootstrap-dependent routes.
- Updated roadmap checklist with current Lighthouse and bundle-size baseline.

## [0.1.0] - 2026-06-09

### Added

- macOS-inspired personal desktop interface.
- GitHub-driven project cards with pinned projects and topic/category filters.
- Project preview convention: `public/project-previews/<repo-name>.svg`.
- Markdown blog flow generated from Obsidian posts.
- Bilingual content support for English and Russian.
- GitHub Pages deployment workflow and CI build check.

### Fixed

- Deduplicated pinned project cards.
- Aligned project card actions so GitHub links stay at the bottom.
- Hid Quick Notes and sticker theme switcher on mobile screens.
