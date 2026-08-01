#!/usr/bin/env bash
# =============================================================================
# FreeYFi frontend (SPA) — same droplet / same domain as y_fi_backend.
#
#   Domain root  → this app (/, /contact, /privacy, /admin/* Theme Studio)
#   /api/*       → y_fi_backend (owned by backend deploy.sh)
#   /django-admin/* → Django admin (NOT React /admin)
#
#   cd /var/www/y_fi_frontend
#   sudo bash deploy/deploy.sh
#
# Does NOT rewrite nginx site config (backend owns freeyfi nginx).
# Only builds dist/ and reloads nginx.
# =============================================================================
set -euo pipefail

FRONTEND_DIR="${FRONTEND_DIR:-/var/www/y_fi_frontend}"
BRANCH="${BRANCH:-master}"
NODE_MAJOR="${NODE_MAJOR:-20}"

echo "==> FreeYFi frontend deploy @ $(date -u +%Y-%m-%dT%H:%M:%SZ)"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo bash $0"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "${SCRIPT_DIR}/../package.json" ]]; then
  FRONTEND_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
  echo "    Detected frontend at ${FRONTEND_DIR}"
fi

DIST_DIR="${FRONTEND_DIR}/dist"
export DEBIAN_FRONTEND=noninteractive

env_get() {
  local key="$1" default="${2:-}"
  local file="${FRONTEND_DIR}/.env"
  if [[ -f "$file" ]]; then
    local line
    line="$(grep -E "^${key}=" "$file" | tail -n1 || true)"
    if [[ -n "$line" ]]; then
      echo "${line#*=}" | sed -e 's/^["'\'']//' -e 's/["'\'']$//' -e 's/\r$//'
      return
    fi
  fi
  echo "$default"
}

if [[ ! -f "${FRONTEND_DIR}/package.json" ]]; then
  echo "package.json not found at ${FRONTEND_DIR}"
  echo "  git clone <URL> ${FRONTEND_DIR}"
  echo "  sudo bash ${FRONTEND_DIR}/deploy/deploy.sh"
  exit 1
fi

cd "${FRONTEND_DIR}"

# ----- Node + Yarn (Corepack) -----
echo "==> Node.js ${NODE_MAJOR}"
if ! command -v node >/dev/null 2>&1 \
  || [[ "$(node -v 2>/dev/null | sed 's/^v//' | cut -d. -f1)" -lt "${NODE_MAJOR}" ]]; then
  apt-get update -y
  apt-get install -y ca-certificates curl gnupg
  mkdir -p /etc/apt/keyrings
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
    | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" \
    >/etc/apt/sources.list.d/nodesource.list
  apt-get update -y
  apt-get install -y nodejs
fi

corepack enable >/dev/null 2>&1 || true
# Prefer yarn from Corepack; fall back to npm global
if ! command -v yarn >/dev/null 2>&1; then
  npm install -g yarn@1.22.22 2>/dev/null || corepack prepare yarn@stable --activate
fi

# ----- .env for production build (same-origin y_fi_backend only) -----
# Dashboard API is not configured here — Theme Studio keeps its code default
# or a local .env when you work on dashboard-backend separately.
if [[ ! -f "${FRONTEND_DIR}/.env" ]]; then
  if [[ -f "${FRONTEND_DIR}/.env.production.example" ]]; then
    cp "${FRONTEND_DIR}/.env.production.example" "${FRONTEND_DIR}/.env"
    echo "==> Created .env from .env.production.example"
  elif [[ -f "${FRONTEND_DIR}/.env.example" ]]; then
    cp "${FRONTEND_DIR}/.env.example" "${FRONTEND_DIR}/.env"
    echo "==> Created .env from .env.example — edit VITE_APP_API_BASE if needed"
  fi
fi

DOMAIN="$(env_get VITE_PUBLIC_DOMAIN app.freeyfi.com)"
APP_API="$(env_get VITE_APP_API_BASE "https://${DOMAIN}/api")"

touch "${FRONTEND_DIR}/.env"
grep -qE '^VITE_APP_API_BASE=' "${FRONTEND_DIR}/.env" \
  || echo "VITE_APP_API_BASE=${APP_API}" >>"${FRONTEND_DIR}/.env"

echo "    VITE_APP_API_BASE=$(env_get VITE_APP_API_BASE)"

if [[ -d "${FRONTEND_DIR}/.git" ]]; then
  echo "==> Git pull (${BRANCH})"
  git fetch origin "${BRANCH}"
  git reset --hard "origin/${BRANCH}"
else
  echo "==> No git remote — building local tree"
fi

echo "==> yarn install + build"
# Cap Node heap on 1 GB droplets
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=512}"
# Prefer Yarn Berry if project has yarn.lock + .yarnrc.yml
if [[ -f "${FRONTEND_DIR}/.yarnrc.yml" ]]; then
  yarn install --immutable 2>/dev/null || yarn install
else
  yarn install --frozen-lockfile 2>/dev/null || yarn install
fi
yarn build

if [[ ! -f "${DIST_DIR}/index.html" ]]; then
  echo "ERROR: build did not produce ${DIST_DIR}/index.html"
  exit 1
fi

echo "==> Permissions"
chown -R www-data:www-data "${DIST_DIR}"
chmod -R 755 "${DIST_DIR}"

# Reload nginx only — do not replace freeyfi site (backend owns routing)
if command -v nginx >/dev/null 2>&1; then
  echo "==> nginx reload"
  nginx -t && systemctl reload nginx
else
  echo "WARNING: nginx not installed — run y_fi_backend deploy/deploy.sh first"
fi

echo ""
echo "==> Frontend done"
echo "    dist: ${DIST_DIR}"
echo "    SPA:  /  /contact  /privacy  /admin/*"
echo "    API:  /api/* (backend)   Django admin: /django-admin/"
ls -la "${DIST_DIR}" | head -n 20
