import { tokenStore } from "./token";
import { refreshAccessToken } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

let isRefreshing = false;
let queue: Array<() => void> = [];

export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = tokenStore.getAccess();

  const res = await fetch(`http://localhost:8080${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status !== 401) return res;

  // جلوگیری از لوپ
  if (url.includes("/auth/verify") || url.includes("/auth/refresh")) {
    return res;
  }

  // اگر یکی دیگه داره refresh می‌زنه
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
