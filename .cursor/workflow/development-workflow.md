# Development Workflow

## Local setup

```bash
cd y_fi_frontend
yarn install          # or npm install
yarn dev              # http://localhost:5173
```

## Build for production

```bash
yarn build            # outputs to dist/
yarn preview          # preview dist locally
```

## Before every change

1. Read workflow docs in `.cursor/workflow/`
2. Check if change affects API contract → coordinate with `y_fi_backend`

## After every change

Agents MUST prepend [changelog.md](./changelog.md) with `YYYY-MM-DD HH:MM (UTC+6)` before responding — automatic, no user prompt. See `auto-changelog.mdc`.

## Deploy

Push to `master` → GitHub Actions SSH deploy → nginx serves `/var/www/y_fi_frontend/dist/`

## AI agent guidelines

### Scope
- Minimal diffs; match existing JSX + Tailwind patterns
- Use `API_BASE` from `lib/api.js` for all API calls (fix Home hardcoding when touching that file)
- Do not add TypeScript unless explicitly requested

### Multi-model review triggers
- Changing contact form validation or API payload shape
- Changing APK download flow
- Privacy policy legal content changes

### Conventions
- Pages in `src/app/pages/`
- Shared UI in `src/components/ui/`
- Route config in `src/routes.js` + `App.jsx`
- Legal content in `src/legal/`

## Lint & git hooks

- `yarn lint` — ESLint with auto-fix
- Husky pre-commit runs lint-staged
- Custom `yarn push` script: lint → add → commit → push
