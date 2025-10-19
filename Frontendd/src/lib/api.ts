export async function api(path: string, init: RequestInit = {}) {
  const base = import.meta.env.VITE_API_BASE || "http://localhost:3002";
  const token = sessionStorage.getItem("auth_token");
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${base}${path}`, { ...init, headers, credentials: "include" });
}
