import { tokenStore } from "./token";
import { refreshAccessToken } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

let isRefreshing = false;
let queue: Array<() => void> = [];

export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = tokenStore.getAccess();

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status !== 401) return res;

  const skipRefreshEndpoints = [
    "/auth/login",
    "/auth/register",
    "/auth/verify",
    "/auth/refresh",
  ];

  if (skipRefreshEndpoints.some((endpoint) => url.includes(endpoint))) {
    return res; 
  }

  if (isRefreshing) {
    return new Promise<Response>((resolve) => {
      queue.push(() => resolve(apiFetch(url, options)));
    });
  }

  isRefreshing = true;

  try {
    await refreshAccessToken();

    queue.forEach((cb) => cb());
    queue = [];

    return apiFetch(url, options);
  } catch (err) {
    tokenStore.clear();
    window.location.href = "/login";
    throw err;
  } finally {
    isRefreshing = false;
  }
}
export const isProfileComplete = async () => {
    const access = tokenStore.getAccess?.();
    if (!access) return { ok: false, reason: "not_logged_in" as const };

    const res = await apiFetch("/profile/completed", { method: "GET" });
    const data = await res.json();

    if (!res.ok) {
      return { ok: false, reason: "api_error" as const, message: data?.error };
    }

    return {
      ok: data.completed,
      reason: data.completed ? "complete" : ("incomplete" as const),
    };
  };