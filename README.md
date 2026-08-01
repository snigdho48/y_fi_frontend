# FreeYFi Frontend

React marketing site and **Theme Studio** admin UI for FreeYFi mobile apps.

**Production:** `https://app.freeyfi.com`  
**Local:** `http://localhost:3001` (or `yarn dev --host --port 3001`)

See the [monorepo README](../README.md) for full setup, deployment, and GitLab CI.

---

## Routes

| Path | Purpose | Backend |
|------|---------|---------|
| `/` | Landing, APK downloads | `y_fi_backend` |
| `/contact` | Contact form | `y_fi_backend` |
| `/privacy` | Privacy policy | — |
| `/admin/login` | Theme Studio login | `dashboard-backend` |
| `/admin/theme` | Theme editor | `dashboard-backend` |

On production (same droplet as `y_fi_backend`), nginx serves this SPA at domain root. Django admin is at `/django-admin/` so it does not clash with `/admin/*`. See [`deploy/README.md`](deploy/README.md).

---

## Quick start

```bash
cd y_fi_frontend
copy .env.example .env
yarn install
yarn dev --host --port 3001
```

### Environment (`.env`)

```env
VITE_DASHBOARD_API_BASE=http://127.0.0.1:8001/api
# Optional for local contact form testing:
# VITE_APP_API_BASE=http://127.0.0.1:8000/api
```

**Admin routes require `dashboard-backend` on port 8001**, not `y_fi_backend`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Vite dev server |
| `yarn build` | Production build → `dist/` |
| `yarn preview` | Preview production build |
| `yarn lint` | ESLint |

This project uses **Yarn 4** with `nodeLinker: node-modules` (see `.yarnrc.yml`).

---

## Stack

- React 18 + Vite 6
- React Router 7
- Tailwind CSS 4
- Redux Toolkit (scaffolded)

---

## Build & deploy

```bash
yarn build
# Deploy dist/ to nginx (see root README)
```

Set `VITE_DASHBOARD_API_BASE=https://dashboard.freeyfi.com/api` for production builds.

---

## Documentation

- [`.cursor/workflow/README.md`](.cursor/workflow/README.md)
- [`.cursor/workflow/architecture.md`](.cursor/workflow/architecture.md)
- [`.cursor/workflow/pages-and-routes.md`](.cursor/workflow/pages-and-routes.md)
