# FreeYFi Frontend — Cursor Workflow Index

> **Product:** Y-Fi marketing / landing site  
> **Repo path:** `y_fi_frontend/`  
> **Production:** `https://app.freeyfi.com` (nginx serves `dist/`)  
> **Last updated:** 2026-07-09

## What this folder is

Marketing site for the FreeYFi mobile apps: APK downloads, contact form, privacy policy. This `.cursor/workflow/` directory documents architecture, API usage, and change-logging rules for all contributors.

## Documents

| File | Purpose |
|------|---------|
| [architecture.md](./architecture.md) | Tech stack, folder layout, deployment |
| [pages-and-routes.md](./pages-and-routes.md) | Routes, components, UI patterns |
| [api-integration.md](./api-integration.md) | Backend endpoints consumed |
| [development-workflow.md](./development-workflow.md) | Local dev, build, deploy, AI rules |
| [changelog.md](./changelog.md) | All documented changes |

## Ecosystem role

```
y_fi_frontend (this repo)
    ├── GET /api/release/app/     → User APK download
    ├── GET /api/partner/app/     → Partner APK download
    └── POST /api/contact/        → Contact form
         │
         ▼
    y_fi_backend (Django API)
```

## Mandatory documentation rule

Every change MUST update [changelog.md](./changelog.md) and relevant workflow docs.
