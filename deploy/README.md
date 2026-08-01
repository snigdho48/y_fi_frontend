# FreeYFi frontend — same domain as API

Marketing SPA shares `app.freeyfi.com` with `y_fi_backend`. This deploy configures **only** the main app API (same origin). Dashboard is not part of this setup.

## Route split (no conflicts)

| Path | Serves |
|------|--------|
| `/`, `/contact`, `/privacy`, `/admin/*` | This SPA (`dist/`) |
| `/api/*` | `y_fi_backend` Gunicorn |
| `/django-admin/*` | Django admin (moved off `/admin/`) |
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

## Troubleshooting

### Stuck at `yarn install + build`

1. Ctrl+C the hung run.
2. Check RAM: `free -h` (need swap from backend `deploy.sh`).
3. Confirm Yarn Berry, not classic: `yarn -v` should be `4.x` (not `1.x`).
4. Re-run: `sudo bash deploy/deploy.sh` — script prints progress for install then build separately.

Classic Yarn (`1.22`) mis-handles this repo’s Berry lockfile and often looks hung.

---

## Order on a new droplet

1. `sudo bash /var/www/y_fi_backend/deploy/deploy.sh` — nginx + SSL + API  
2. `sudo bash /var/www/y_fi_frontend/deploy/deploy.sh` — SPA at domain root  

`FRONTEND_DIR` must match what backend nginx uses (default `/var/www/y_fi_frontend`). Set `FRONTEND_DIR` in backend `.env` if you use another path.
