# Frontend Architecture

## Tech stack

| Layer | Technology | Version |
|-------|------------|---------|
| Language | JavaScript (JSX) | No TypeScript |
| Framework | React | 18.3 |
| Build | Vite | 6 |
| Routing | React Router DOM | 7 |
| State | Redux Toolkit + thunk | Scaffolded, barely used |
| Styling | Tailwind CSS | 4 (`@tailwindcss/vite`) |
| UI | shadcn/ui pattern | Radix + CVA |
| Markdown | react-markdown + remark-gfm | Privacy page |
| Lint | ESLint 9 (Airbnb-style) | |
| Hooks | Husky + lint-staged | |

## Folder structure

```
y_fi_frontend/
├── .github/workflows/deploy.yml    # SSH deploy on push to master
├── dist/                           # Pre-built bundle (deployed as-is)
├── public/
├── src/
│   ├── app/
│   │   ├── mainoutlate.jsx         # Layout shell (header, nav, footer)
│   │   ├── store.js                # Redux store
│   │   ├── pages/
│   │   │   ├── home.jsx            # Landing + APK downloads
│   │   │   ├── contact.jsx         # Contact form
│   │   │   └── privacy.jsx         # Privacy policy markdown
│   │   └── slice/loadingSlice.js   # Unused loading flag
│   ├── components/ui/
│   │   ├── button.jsx
│   │   └── navigation-menu.jsx     # Installed but unused
│   ├── legal/PRIVACY_POLICY.md
│   ├── lib/
│   │   ├── api.js                  # DASHBOARD_API_BASE + APP_API_BASE
│   │   └── utils.js                # cn() helper
│   ├── App.jsx                     # Route definitions
│   ├── main.jsx                    # Entry: Router + Redux Provider
│   ├── navmenu.jsx                 # Nav link config
│   └── routes.js                   # Route table
├── components.json                 # shadcn config
├── vite.config.js
└── tailwind.config.js
```

## Path aliases

| Alias | Vite resolves to |
|-------|------------------|
| `@/*` | `./src/*` |
| `@component/*` | `./src/components/*` |
| `@page/*` | `./src/app/pages/*` |

## Theme

- Dark slate background (`#0f172a`)
- shadcn HSL CSS variables in `index.css`
- Privacy page uses `.privacy-md--dark` styles in `App.css`

## Deployment

Same droplet as `y_fi_backend` — domain root is this SPA; `/api/` and `/django-admin/` are backend.

```bash
sudo bash deploy/deploy.sh
```

`.github/workflows/deploy.yml` SSHs and runs that script (yarn build on server → `dist/`).

Nginx site file is installed by `y_fi_backend/deploy/deploy.sh` only.

## Known gaps

- Redux store wired but no component uses it
- `NavigationMenu` component unused; custom nav in `mainoutlate.jsx`
- Admin `/admin/*` uses `VITE_DASHBOARD_API_BASE` only (dashboard-backend)
- Home page hardcodes APK URLs; Contact uses `APP_API_BASE` (y_fi_backend)
- Referenced assets (`logo.png`, etc.) may be missing from repo
