# Changelog

All changes to `y_fi_frontend` must be logged here newest-first.

**Format:** `## YYYY-MM-DD HH:MM (UTC+6) — Title` with `**Time:**` field in every entry.

---

## 2026-08-01 15:21 (UTC+6) — Drop unsupported .yarnrc.yml keys

**Time:** 2026-08-01 15:21 (UTC+6)
**Author:** Cursor AI agent
**Type:** Bug fix

### Changed
- `.yarnrc.yml` — removed `npmMinimalAgeGate` / `approvedGitRepositories` (not supported on droplet Yarn; aborted install)

### API impact
- None

### DB impact
- None

---

## 2026-08-01 15:18 (UTC+6) — Drop invalid YARN_CHILD_CONCURRENCY

**Time:** 2026-08-01 15:18 (UTC+6)
**Author:** Cursor AI agent
**Type:** Bug fix

### Changed
- `deploy/deploy.sh` — removed `YARN_CHILD_CONCURRENCY` (not supported in Yarn 4; caused install abort)

### API impact
- None

### DB impact
- None

---

## 2026-08-01 15:16 (UTC+6) — Unstick yarn install on 1 GB droplet

**Time:** 2026-08-01 15:16 (UTC+6)
**Author:** Cursor AI agent
**Type:** Bugfix

### Changed
- `deploy/deploy.sh` — Corepack Yarn 4 only (no classic), live install/build logs, `HUSKY=0`, lower Yarn concurrency, no silent `2>/dev/null`
- `.yarnrc.yml` — `enableScripts: false`, `enableTelemetry: false` for non-interactive server deploys
- `deploy/README.md` — troubleshooting stuck yarn

### API impact
- None

### DB impact
- None

---

## 2026-08-01 15:13 (UTC+6) — Frontend deploy: main API only

**Time:** 2026-08-01 15:13 (UTC+6)
**Author:** Cursor AI agent
**Type:** Enhancement

### Changed
- `deploy/deploy.sh` — configures only `VITE_APP_API_BASE` (same-origin `y_fi_backend`); no dashboard env
- `.env.production.example` — production template with app API only
- `.env.example` — local optional overrides; dashboard left commented
- `deploy/README.md` — documents main-API-only same-domain deploy

### API impact
- None

### DB impact
- None

---

## 2026-08-01 00:06 (UTC+6) — Rename script to deploy.sh

**Time:** 2026-08-01 00:06 (UTC+6)
**Author:** Cursor AI agent
**Type:** Enhancement

### Changed
- `deploy/freeyfi-frontend.sh` → `deploy/deploy.sh`

### API impact
- None

### DB impact
- None

---

## 2026-07-31 23:59 (UTC+6) — Deploy path /var/www/y_fi_frontend

**Time:** 2026-07-31 23:59 (UTC+6)
**Author:** Cursor AI agent
**Type:** Enhancement

### Changed
- Default `FRONTEND_DIR` / docs / CI → `/var/www/y_fi_frontend` (same droplet layout as backend)

### API impact
- None

### DB impact
- None

---

## 2026-07-31 23:55 (UTC+6) — Same-domain frontend deploy script

**Time:** 2026-07-31 23:55 (UTC+6)
**Author:** Cursor AI agent
**Type:** Enhancement

### Changed
- `deploy/freeyfi-frontend.sh` — separate SPA deploy (yarn build + dist permissions + nginx reload)
- `deploy/README.md` — route split vs backend (`/admin/*` SPA vs `/django-admin/` Django)
- `.env.example`, `.github/workflows/deploy.yml` — production same-origin API + scripted deploy
- Workflow docs / README — same-domain topology

### API impact
- None (Theme Studio still uses dashboard-backend; contact uses `VITE_APP_API_BASE`)

### DB impact
- None

---

## 2026-07-09 14:06 (UTC+6) — Admin frontend uses dashboard-backend only

**Time:** 2026-07-09 14:06 (UTC+6)  
**Author:** Cursor AI agent  
**Type:** Architecture

### Changed
- `.env` / `.env.example` — only `VITE_DASHBOARD_API_BASE` for admin
- `src/lib/api.js` — `DASHBOARD_API_BASE` (admin) + `APP_API_BASE` (marketing contact only)
- `contact.jsx` — uses `APP_API_BASE`, not admin dashboard
- `api-integration.md`, `freeyfi-frontend.mdc` — document admin vs marketing split
- Removed debug instrumentation from `theme-api.js`

### API impact
- Admin routes connect only to dashboard-backend

---

## 2026-07-09 13:15 (UTC+6) — Theme API points to dashboard-backend

**Time:** 2026-07-09 13:15 (UTC+6)  
**Author:** Cursor AI agent  
**Type:** Refactor

### Changed
- `src/lib/api.js` — `DASHBOARD_API_BASE` for theme studio
- `src/lib/theme-api.js` — all theme/admin calls use dashboard API
- `.env` — `VITE_DASHBOARD_API_BASE=http://127.0.0.1:8001/api`

---

## 2026-07-09 12:28 (UTC+6) — Theme active checkbox (single active per app)

**Time:** 2026-07-09 12:28 (UTC+6)  
**Author:** Cursor AI agent  
**Type:** Enhancement

### Changed
- `src/app/pages/admin/theme-editor.jsx` — checkbox to activate/deactivate themes; only one active per app target; warning when none active (default palette used)
- `src/lib/theme-api.js` — `setThemeActive(id, isActive)` helper

### API impact
- Uses `POST /admin/theme/:id/activate/` and `PATCH` with `is_active: false`

---

## 2026-07-09 11:30 (UTC+6) — Admin Theme Studio (login + editor + preview)

**Time:** 2026-07-09 11:30 (UTC+6)  
**Author:** Cursor AI agent  
**Type:** Feature

### Added
- `/admin/login` — admin JWT login (`auth/admin/login/`)
- `/admin/theme` — Theme Studio with palette, font, per-section colors, phone preview
- `src/lib/auth.js`, `src/lib/theme-api.js`, `src/app/adminlayout.jsx`
- `src/app/pages/admin/login.jsx`, `src/app/pages/admin/theme-editor.jsx`

### Changed
- `src/App.jsx` — admin routes outside marketing layout

### API impact
- Consumes new theme admin + public endpoints

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
