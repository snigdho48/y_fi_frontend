# API Integration

**Backend base:** `https://app.freeyfi.com/api/`  
**Config:** `src/lib/api.js`

```javascript
export const API_BASE =
  import.meta.env.VITE_API_BASE ?? "https://app.freeyfi.com/api";
```

## Endpoints used

| Page | Method | Endpoint | Uses API_BASE? |
|------|--------|----------|----------------|
| Home | GET | `/release/app/` | ❌ Hardcoded full URL |
| Home | GET | `/partner/app/` | ❌ Hardcoded full URL |
| Contact | POST | `/contact/` | ✅ `${API_BASE}/contact/` |

## Request/response contracts

### GET `/release/app/` and `/partner/app/`

**Response:**
```json
{ "url": "https://app.freeyfi.com/media/apps/..." }
```

Client opens `url` in new browser tab. Backend increments download counter.

### POST `/contact/`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "At least 10 characters here"
}
```

**Headers:** `Content-Type: application/json`, `Accept: application/json`

**Success:** Server message string, form cleared  
**Error:** Django field errors flattened to user-facing string

## Integration pattern

No centralized API client. Each page uses native `fetch`:

```javascript
// Contact pattern (preferred)
const res = await fetch(`${API_BASE}/contact/`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "Accept": "application/json" },
  body: JSON.stringify({ name, email, message }),
});

// Home pattern (should migrate to API_BASE)
const res = await fetch("https://app.freeyfi.com/api/release/app/");
```

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_BASE` | `https://app.freeyfi.com/api` | API root (Contact only today) |

No `.env.example` in repo. Create `.env.local` for local backend testing:
```
VITE_API_BASE=http://127.0.0.1:8000/api
```

## Alignment with backend

See `y_fi_backend/.cursor/workflow/api-reference.md` for full backend contract.

When backend contact or APK endpoints change, update this file and `pages-and-routes.md`.
