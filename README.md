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
# Optional local overrides:
# VITE_APP_API_BASE=http://127.0.0.1:8000/api
# VITE_DASHBOARD_API_BASE=http://127.0.0.1:8001/api
```

Production droplet: use `.env.production.example` → `.env` with `VITE_APP_API_BASE` only (see `deploy/README.md`).

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
cd /var/www/y_fi_frontend
cp .env.production.example .env
sudo bash deploy/deploy.sh
```

Production configures only `VITE_APP_API_BASE` (same-origin `y_fi_backend`).

---

## Documentation

- [`.cursor/workflow/README.md`](.cursor/workflow/README.md)
- [`.cursor/workflow/architecture.md`](.cursor/workflow/architecture.md)
- [`.cursor/workflow/pages-and-routes.md`](.cursor/workflow/pages-and-routes.md)
