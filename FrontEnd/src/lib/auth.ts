import { tokenStore } from "./token";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function refreshAccessToken() {
  const refreshToken = tokenStore.getRefresh();
  const userId = tokenStore.getUserId();

  if (!refreshToken) {
    console.log("qw")
    throw new Error("No refresh data");
  }

  const res = await fetch(`http://localhost:8080/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const data = await res.json();

  tokenStore.setAuth({
    access_token: data.access_token,
  });

  return data.access_token as string;
}

export async function logoutRequest() {
  const access = tokenStore.getAccess();
  await fetch(`http://localhost:8080/auth/logout`, {
    method: "POST",
    headers: {
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
  });
  tokenStore.clear();
}
