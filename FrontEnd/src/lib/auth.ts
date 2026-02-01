import { tokenStore } from "./token";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function refreshAccessToken() {
  const refreshToken = tokenStore.getRefresh();

  if (!refreshToken) {
    console.log("qw");
    throw new Error("No refresh data");
  }

  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const data = await res.json();

  tokenStore.setAuth({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  });

  return data.access_token as string;
}

export async function logoutRequest() {
  const refreshToken = tokenStore.getRefresh();

  if (!refreshToken) {
    tokenStore.clear();
    return;
  }

  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  if (res.ok) {
    tokenStore.clear();
    return;
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }

  if (data?.error === "Missing or invalid token") {
    tokenStore.clear();
    return;
  }

  throw new Error("Logout failed");
}
