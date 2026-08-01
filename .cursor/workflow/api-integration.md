# API Integration

## Admin Theme Studio → dashboard-backend ONLY

**Config:** `src/lib/api.js` → `DASHBOARD_API_BASE`  
**Env:** `VITE_DASHBOARD_API_BASE` (required for `/admin/*`)

```javascript
export const DASHBOARD_API_BASE =
  import.meta.env.VITE_DASHBOARD_API_BASE ?? "https://dashboard.freeyfi.com/api";
```

| Admin route | Backend | Endpoints |
|-------------|---------|-----------|
| `/admin/login` | dashboard-backend | `POST /auth/admin/login/` |
| `/admin/theme` | dashboard-backend | `/admin/theme/*`, `/admin/theme/defaults/` |

All admin API calls go through `src/lib/theme-api.js` — never `y_fi_backend`.

See `dashboard-backend/.cursor/workflow/api-reference.md` for full contract.

### Local `.env`

```env
VITE_DASHBOARD_API_BASE=http://127.0.0.1:8001/api
```

Restart Vite after changing `.env`.

---

## Marketing site → y_fi_backend (not admin)

**Config:** `APP_API_BASE` — production default, optional `VITE_APP_API_BASE` for local contact testing.

| Page | Method | Endpoint |
|------|--------|----------|
| Home | GET | `/release/app/`, `/partner/app/` (hardcoded production URL today) |
| Contact | POST | `/contact/` via `APP_API_BASE` |

Admin pages do **not** use `APP_API_BASE`.

---

## Environment variables

| Variable | Required for admin? | Default | Purpose |
|----------|---------------------|---------|---------|
| `VITE_DASHBOARD_API_BASE` | **Yes** | `https://dashboard.freeyfi.com/api` | Theme Studio + admin login |
| `VITE_APP_API_BASE` | No | `https://app.freeyfi.com/api` | Contact form only (marketing) |
