# Changelog

All changes to `y_fi_frontend` must be logged here newest-first.

**Format:** `## YYYY-MM-DD HH:MM (UTC+6) — Title` with `**Time:**` field in every entry.

---

## 2026-07-09 11:23 (UTC+6) — Auto-documentation rules + timestamp format

**Time:** 2026-07-09 11:23 (UTC+6)  
**Author:** Cursor AI agent  
**Type:** Documentation

### Changed
- `.cursor/rules/auto-changelog.mdc` — always-on auto changelog rule
- `.cursor/workflow/changelog.md` — timestamp format added

### API impact
- None

---

## 2026-07-09 11:17 (UTC+6) — Initial Cursor workflow documentation

**Time:** 2026-07-09 11:17 (UTC+6)  
**Author:** Cursor AI agent  
**Type:** Documentation

### Added
- `.cursor/workflow/` documentation suite (README, architecture, pages, API, dev workflow, changelog)
- `.cursor/rules/` for cross-account AI consistency

### Documented known issues (no code changes)
- Home page hardcodes API URL instead of `VITE_API_BASE`
- Redux store unused
- `NavigationMenu` component unused
- CI deploys `dist/` without build step
- Missing static assets (`logo.png`, etc.) referenced in code

### API impact
- None

---

<!-- Template:

## YYYY-MM-DD HH:MM (UTC+6) — Short title

**Time:** YYYY-MM-DD HH:MM (UTC+6)
**Author:** Name
**Type:** Feature | Bugfix | Docs

### Changed
- `src/...` — description

### API impact
- None | endpoint change

-->
