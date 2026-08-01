const TOKEN_KEY = "freeyfi_admin_token";
const USER_KEY = "freeyfi_admin_user";

export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getAdminUser() {
  try {
    return JSON.parse(sessionStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function setAdminSession({ token, email, username }) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify({ email, username }));
}

export function clearAdminSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function isAdminLoggedIn() {
  return Boolean(getAdminToken());
}

export function authHeaders() {
  const token = getAdminToken();
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    : {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
}
