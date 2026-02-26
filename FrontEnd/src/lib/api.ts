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

  // ✅ اگر 401 نبود مستقیم برگردون
  if (res.status !== 401) return res;

  // ✅ این endpoint ها نباید refresh بشن
  const skipRefreshEndpoints = [
    "/auth/login",
    "/auth/register",
    "/auth/verify",
    "/auth/refresh",
  ];

  if (skipRefreshEndpoints.some((endpoint) => url.includes(endpoint))) {
    return res; // مستقیم ارور رو بده
  }

  // اگر یکی دیگه در حال refresh است
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
