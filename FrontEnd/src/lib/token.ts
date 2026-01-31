const ACCESS = "access_token";
const REFRESH = "refresh_token";
const USER_ID = "user_id";
const ROLE = "role";

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS),
  getRefresh: () => localStorage.getItem(REFRESH),
  getUserId: () => localStorage.getItem(USER_ID),
  getRole: () => localStorage.getItem(ROLE),

  setAuth(data: {
    access_token: string;
    refresh_token?: string;
    user_id?: string;
    role?: string;
  }) {
    localStorage.setItem(ACCESS, data.access_token);
    if (data.refresh_token) localStorage.setItem(REFRESH, data.refresh_token);
    if (data.user_id) localStorage.setItem(USER_ID, data.user_id);
    if (data.role) localStorage.setItem(ROLE, data.role);
  },

  clear() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
    localStorage.removeItem(USER_ID);
    localStorage.removeItem(ROLE);
  },
};
