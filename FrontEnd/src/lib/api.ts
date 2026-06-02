import { tokenStore } from "./token";
import { refreshAccessToken } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

let isRefreshing = false;
let queue: Array<() => void> = [];

type AuthMode = "required" | "optional" | "none";

type ApiFetchOptions = RequestInit & {
  authMode?: AuthMode;
};

export async function apiFetch(
  url: string,
  options: ApiFetchOptions = {}
): Promise<Response> {
  const { authMode = "required", ...fetchOptions } = options;
console.log(url)

  const token = tokenStore.getAccess();
  const headers: any = {
    ...(fetchOptions.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...fetchOptions,
    headers,
  });
  if (res.status !== 401) return res;

  // اگر auth اختیاری است اصلاً refresh نکن
  // if (authMode === "optional" || authMode === "none") {
  //   return res;
  // }

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

    if (authMode === "required") {
      window.location.href = "/login";
    }

    throw err;
  } finally {
    isRefreshing = false;
  }
}

export const isProfileComplete = async () => {
  const access = tokenStore.getAccess?.();

  if (!access) {
    return { ok: false, reason: "not_logged_in" as const };
  }

  const res = await apiFetch("/profile/completed", {
    method: "GET",
    authMode: "optional",
  });

  if (res.status === 401) {
    return { ok: false, reason: "not_logged_in" as const };
  }

  const data = await res.json();

  if (!res.ok) {
    return {
      ok: false,
      reason: "api_error" as const,
      message: data?.error,
    };
  }

  return {
    ok: data.completed,
    reason: data.completed ? "complete" : ("incomplete" as const),
  };
};
