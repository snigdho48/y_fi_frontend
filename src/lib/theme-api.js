import { DASHBOARD_API_BASE } from "@/lib/api";
import { authHeaders } from "@/lib/auth";

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data.error ||
      data.detail ||
      Object.values(data)
        .flat()
        .join(" ") ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export async function adminLogin(email, password) {
  const res = await fetch(`${DASHBOARD_API_BASE}/auth/admin/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseJson(res);
}

export async function fetchThemeDefaults(app = "user") {
  const q = app ? `?app=${encodeURIComponent(app)}` : "";
  const res = await fetch(`${DASHBOARD_API_BASE}/admin/theme/defaults/${q}`, {
    headers: authHeaders(),
  });
  return parseJson(res);
}

export async function listThemes(app) {
  const q = app ? `?app=${encodeURIComponent(app)}` : "";
  const res = await fetch(`${DASHBOARD_API_BASE}/admin/theme/${q}`, {
    headers: authHeaders(),
  });
  return parseJson(res);
}

export async function createTheme(payload) {
  const res = await fetch(`${DASHBOARD_API_BASE}/admin/theme/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function updateTheme(id, payload) {
  const res = await fetch(`${DASHBOARD_API_BASE}/admin/theme/${id}/`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function uploadSectionBackground(themeId, section, file) {
  const form = new FormData();
  form.append("section", section);
  form.append("image", file);
  const headers = authHeaders();
  delete headers["Content-Type"];
  const res = await fetch(
    `${DASHBOARD_API_BASE}/admin/theme/${themeId}/section-background/`,
    {
      method: "POST",
      headers,
      body: form,
    },
  );
  return parseJson(res);
}

export async function removeSectionBackground(themeId, section) {
  const res = await fetch(
    `${DASHBOARD_API_BASE}/admin/theme/${themeId}/section-background/`,
    {
      method: "DELETE",
      headers: authHeaders(),
      body: JSON.stringify({ section }),
    },
  );
  return parseJson(res);
}

export async function setThemeActive(id, isActive) {
  if (isActive) {
    return activateTheme(id);
  }
  return updateTheme(id, { is_active: false });
}

export async function activateTheme(id) {
  const res = await fetch(`${DASHBOARD_API_BASE}/admin/theme/${id}/activate/`, {
    method: "POST",
    headers: authHeaders(),
  });
  return parseJson(res);
}

export async function fetchPublicTheme(app) {
  const res = await fetch(`${DASHBOARD_API_BASE}/theme/?app=${encodeURIComponent(app)}`);
  return parseJson(res);
}

export const SECTIONS_BY_APP = {
  user: ["home", "login", "connecting", "connected"],
  partner: ["home", "login", "signup", "dashboard", "history"],
};

export const SECTION_LABELS = {
  home: "Home / Splash",
  login: "Login",
  signup: "Sign Up",
  connecting: "Connecting",
  connected: "Connected",
  dashboard: "Venue Dashboard",
  history: "Earnings Dashboard",
};

export const SECTION_KEYS = [
  "background",
  "font_color",
  "heading_color",
  "button_background",
  "button_text",
  "card_background",
];

export const GLOBAL_FIELDS = [
  { key: "primary_color", label: "Primary" },
  { key: "scaffold_color", label: "Scaffold" },
  { key: "accent_color", label: "Accent" },
  { key: "on_primary_color", label: "Text on Primary" },
  { key: "background_color", label: "Global Background" },
];

export function sectionsForApp(appTarget = "user") {
  return SECTIONS_BY_APP[appTarget] || SECTIONS_BY_APP.user;
}

export function emptyTheme(appTarget = "user") {
  return {
    name: `New ${appTarget} theme`,
    app_target: appTarget,
    is_active: false,
    primary_color: "#191B41",
    scaffold_color: "#191B41",
    accent_color: "#B2FF59",
    on_primary_color: "#FFFFFF",
    background_color: "#191B41",
    section_styles: {},
  };
}
