/**
 * Admin Theme Studio — dashboard-backend ONLY.
 * Set VITE_DASHBOARD_API_BASE in .env (local: http://127.0.0.1:8001/api).
 */
export const DASHBOARD_API_BASE =
  import.meta.env.VITE_DASHBOARD_API_BASE ?? "https://dashboard.freeyfi.com/api";

/**
 * Marketing site only (contact form) — y_fi_backend, NOT used by /admin/*.
 * Defaults to production; optional VITE_APP_API_BASE for local contact testing.
 */
export const APP_API_BASE =
  import.meta.env.VITE_APP_API_BASE ?? "https://app.freeyfi.com/api";
