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
# Yarn Berry lockfile (__metadata version: 10) — do NOT use Yarn 1 classic.
YARN_VERSION="${YARN_VERSION:-4.9.2}"

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
# Skip husky / lifecycle prompts that can hang non-interactive deploys
export HUSKY=0
export CI=1
export YARN_ENABLE_IMMUTABLE_INSTALLS=false
export YARN_ENABLE_TELEMETRY=0
# Low concurrency keeps RAM usable on 1 GB droplets (+ swap)
export YARN_NETWORK_CONCURRENCY="${YARN_NETWORK_CONCURRENCY:-4}"
# Do not set YARN_CHILD_CONCURRENCY — unsupported in Yarn 4 and aborts install.

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

# ----- Node + Yarn Berry via Corepack (matches yarn.lock) -----
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

echo "    node $(node -v)  npm $(npm -v)"

# Remove Yarn classic if present — it hangs/misbehaves with this lockfile
if command -v yarn >/dev/null 2>&1; then
  YARN_MAJ="$(yarn -v 2>/dev/null | cut -d. -f1 || echo 0)"
  if [[ "${YARN_MAJ}" -lt 2 ]]; then
    echo "==> Removing Yarn classic $(yarn -v) (need Berry ${YARN_VERSION})"
    npm uninstall -g yarn >/dev/null 2>&1 || true
    rm -f /usr/local/bin/yarn /usr/bin/yarn 2>/dev/null || true
  fi
fi

echo "==> Corepack Yarn ${YARN_VERSION}"
corepack enable
# Non-interactive; downloads yarn once then caches
corepack prepare "yarn@${YARN_VERSION}" --activate
hash -r 2>/dev/null || true
echo "    yarn $(yarn -v)"

# ----- .env for production build (marketing SPA only) -----
# /admin on this domain is Django admin (nginx → y_fi_backend), not Theme Studio.
# Do not set VITE_DASHBOARD_API_BASE here.
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

sanitize_prod_env() {
  touch "${FRONTEND_DIR}/.env"
  grep -qE '^VITE_APP_API_BASE=' "${FRONTEND_DIR}/.env" \
    || echo "VITE_APP_API_BASE=${APP_API}" >>"${FRONTEND_DIR}/.env"
  # Strip dashboard/local Theme Studio URLs — not used on this production domain
  if grep -qE '^VITE_DASHBOARD_API_BASE=' "${FRONTEND_DIR}/.env" 2>/dev/null; then
    echo "==> Removing VITE_DASHBOARD_API_BASE from production .env"
    sed -i -E '/^VITE_DASHBOARD_API_BASE=/d' "${FRONTEND_DIR}/.env"
  fi
  echo "    VITE_APP_API_BASE=$(env_get VITE_APP_API_BASE)"
}

sanitize_prod_env

if [[ -d "${FRONTEND_DIR}/.git" ]]; then
  echo "==> Git pull (${BRANCH})"
  git fetch origin "${BRANCH}"
  git reset --hard "origin/${BRANCH}"
else
  echo "==> No git remote — building local tree"
fi

# Re-apply after reset (.env is usually gitignored and may be wiped or stale)
if [[ ! -f "${FRONTEND_DIR}/.env" ]] && [[ -f "${FRONTEND_DIR}/.env.production.example" ]]; then
  cp "${FRONTEND_DIR}/.env.production.example" "${FRONTEND_DIR}/.env"
fi
sanitize_prod_env

echo "==> free -h (expect swap if RAM is tight)"
free -h || true

echo "==> yarn install (this can take several minutes on 1 GB)"
# Leave Node heap unset for install — Yarn Berry OOMs oddly if capped too low.
unset NODE_OPTIONS || true
# Show live output; never swallow stderr
yarn install --inline-builds

echo "==> yarn build"
# Cap heap only for Vite build
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=768}"
yarn build

if [[ ! -f "${DIST_DIR}/index.html" ]]; then
  echo "ERROR: build did not produce ${DIST_DIR}/index.html"
  exit 1
fi

echo "==> Permissions"
chown -R www-data:www-data "${DIST_DIR}"
chmod -R 755 "${DIST_DIR}"

if command -v nginx >/dev/null 2>&1; then
  echo "==> nginx reload"
  nginx -t && systemctl reload nginx
else
  echo "WARNING: nginx not installed — run y_fi_backend deploy/deploy.sh first"
fi

echo ""
echo "==> Frontend done"
echo "    dist: ${DIST_DIR}"
echo "    SPA:  /  /contact  /privacy"
echo "    API:  /api/* (backend)   Django admin: /admin/"
ls -la "${DIST_DIR}" | head -n 20
