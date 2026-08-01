# FreeYFi frontend — same domain as API

Marketing SPA shares `app.freeyfi.com` with `y_fi_backend`.

## Route split (no conflicts)

| Path | Serves |
|------|--------|
| `/`, `/contact`, `/privacy` | This SPA (`dist/`) |
| `/admin/` | **Django admin** (`y_fi_backend`) |
| `/api/` | `y_fi_backend` Gunicorn |
| `/static/`, `/media/` | Backend files |
| `/assets/` | Vite build assets |

Nginx site config is owned by **backend** `y_fi_backend/deploy/deploy.sh`.  
This script only builds `dist/` and reloads nginx.

## Deploy

```bash
git clone <URL> /var/www/y_fi_frontend
cd /var/www/y_fi_frontend
cp .env.production.example .env
sudo bash deploy/deploy.sh
```

Every update:

```bash
sudo bash deploy/deploy.sh
```

## Production `.env`

```env
VITE_APP_API_BASE=https://app.freeyfi.com/api
```

Do **not** set `VITE_DASHBOARD_API_BASE` for this host — `/admin` is Django.

## Order on a new droplet

1. `sudo bash /var/www/y_fi_backend/deploy/deploy.sh` — nginx + SSL + API + Django `/admin/`  
2. `sudo bash /var/www/y_fi_frontend/deploy/deploy.sh` — SPA at domain root  

`FRONTEND_DIR` must match what backend nginx uses (default `/var/www/y_fi_frontend`).
