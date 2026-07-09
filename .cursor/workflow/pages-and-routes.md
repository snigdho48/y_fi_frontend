# Pages & Routes

## Route table

Defined in `src/routes.js`, rendered in `App.jsx` under `MainOutlate` layout.

| Path | Component | File | Purpose |
|------|-----------|------|---------|
| `/` | Home | `src/app/pages/home.jsx` | Hero, dual APK download buttons |
| `/contact` | Contact | `src/app/pages/contact.jsx` | Contact form → backend |
| `/privacy` | Privacy | `src/app/pages/privacy.jsx` | Renders `legal/PRIVACY_POLICY.md` |

## Layout (`mainoutlate.jsx`)

- Sticky header with desktop nav + mobile hamburger
- Active link highlighting via `useLocation()`
- Footer: "© 2026 Adcelerate. All rights reserved."
- `<Outlet />` for page content

## Nav links (`navmenu.jsx`)

Home · Contact · Privacy Policy

## Page details

### Home (`home.jsx`)

- Logo + tagline
- **Download Now** → fetches user APK URL
- **Y-Fi Partners** → fetches partner APK URL
- On mount: two parallel `useEffect` GET requests
- Opens URL in new tab via `window.open(url, "_blank")`
- Fallback: `alert("Download link not available")`

### Contact (`contact.jsx`)

Form fields: name, email, message

| Validation | Rule |
|------------|------|
| name | Required, max 200 chars |
| email | Required, valid format |
| message | Required, min 10 chars |

States: loading, success message, field-level errors (Django-style flattened)

### Privacy (`privacy.jsx`)

- Imports `PRIVACY_POLICY.md` as raw string
- Renders with `react-markdown` + `remark-gfm`
- Dark theme typography via `App.css`

## UI components

### Button (`components/ui/button.jsx`)

shadcn Button with CVA variants. Used on Home and Contact.

### NavigationMenu

Full shadcn component — **not used** in current layout.

## State management

| Pattern | Usage |
|---------|-------|
| Local `useState` | All page forms and fetch status |
| Redux `loadingSlice` | Defined but **not consumed** |
| No React Query / RTK Query | Direct `fetch` only |
