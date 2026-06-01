"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { tokenStore } from "@/lib/token";
import { AdminUser, AdminUserListResponse, AdminUserParams } from "@/types";
import { buildQuery } from "@/lib/utils";


function getParamsKey(params: AdminUserParams) {
  return JSON.stringify({
    page: params.page,
    pageSize: params.pageSize,
    role: params.role ?? "",
    search: params.search ?? "",
  });
}

const normalizeParams = (p: Partial<AdminUserParams>): AdminUserParams => ({
  page: Math.max(1, p.page ?? 1),
  pageSize: Math.min(100, Math.max(1, p.pageSize ?? 20)),
  role: p.role ?? "",
  search: p.search ?? "",
});

export function useAdminUsers(options?: {
  initialParams?: Partial<AdminUserParams>;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const accessToken = mounted ? tokenStore.getAccess() : null;
  const canFetch = mounted && !!accessToken;
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [total, setTotal] = useState(0);

  const [params, _setParams] = useState<AdminUserParams>(() =>
    normalizeParams({
      page: options?.initialParams?.page ?? 1,
      pageSize: options?.initialParams?.pageSize ?? 20,
      role: options?.initialParams?.role ?? "",
      search: options?.initialParams?.search ?? "",
    }),
  );

  const [loadingList, setLoadingList] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const requestSeqRef = useRef(0);
  const lastAutoFetchKeyRef = useRef<string>("");

  const setParams = useCallback(
    (
      next:
        | Partial<AdminUserParams>
        | ((prev: AdminUserParams) => AdminUserParams),
    ) => {
      _setParams((prev) => {
        const computed =
          typeof next === "function" ? next(prev) : { ...prev, ...next };

        const normalized = normalizeParams(computed);

        const same =
          prev.page === normalized.page &&
          prev.pageSize === normalized.pageSize &&
          (prev.role ?? "") === (normalized.role ?? "") &&
          (prev.search ?? "") === (normalized.search ?? "");

        return same ? prev : normalized;
      });
    },
    [],
  );

  const fetchList = useCallback(
    async (p: AdminUserParams): Promise<AdminUserListResponse | null> => {
      if (!canFetch) return null;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const seq = ++requestSeqRef.current;

      setLoadingList(true);
      setError(null);

      try {
        const query = buildQuery({
          page: p.page,
          page_size: p.pageSize,
          role: p.role || undefined,
          search: p.search || undefined,
        });

        const res = await apiFetch(`/admin/users?${query}`, {
          method: "GET",
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }

        const json = (await res.json()) as Partial<AdminUserListResponse>;

        if (controller.signal.aborted) return null;
        if (seq !== requestSeqRef.current) return null;

        setUsers((json.data as AdminUser[]) ?? []);
        setTotal(json.total ?? 0);

        return json as AdminUserListResponse;
      } catch (err: any) {
        if (err?.name === "AbortError") return null;

        if (seq === requestSeqRef.current) {
          setError(err?.message || "failed_to_fetch_users");
        }
        return null;
      } finally {
        if (seq === requestSeqRef.current) {
          setLoadingList(false);
        }
      }
    },
    [canFetch],
  );

  const refreshList = useCallback(
    async () => fetchList(params),
    [fetchList, params],
  );

  const fetchUserById = useCallback(
    async (id: string) => {
      if (!canFetch) return null;

      setLoadingUser(true);
      setError(null);

      try {
        const res = await apiFetch(`/admin/users/${id}`, { method: "GET" });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }

        const user = (await res.json()) as AdminUser;
        setSelectedUser(user);
        return user;
      } catch (err: any) {
        setError(err?.message || "failed_to_fetch_user");
        return null;
      } finally {
        setLoadingUser(false);
      }
    },
    [canFetch],
  );

  const clearSelectedUser = useCallback(() => setSelectedUser(null), []);

  const ban = useCallback(
    async (id: string) => {
      if (!canFetch) return null;

      setMutating(true);
      setError(null);
      try {
        const res = await apiFetch(`/admin/users/${id}/ban`, {
          method: "PATCH",
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }
        await refreshList();
        return true;
      } catch (err: any) {
        setError(err?.message || "failed_to_ban_user");
        return null;
      } finally {
        setMutating(false);
      }
    },
    [canFetch, refreshList],
  );

  const unban = useCallback(
    async (id: string) => {
      if (!canFetch) return null;

      setMutating(true);
      setError(null);
      try {
        const res = await apiFetch(`/admin/users/${id}/unban`, {
          method: "PATCH",
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }
        await refreshList();
        return true;
      } catch (err: any) {
        setError(err?.message || "failed_to_unban_user");
        return null;
      } finally {
        setMutating(false);
      }
    },
    [canFetch, refreshList],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!canFetch) return null;

      setMutating(true);
      setError(null);
      try {
        const res = await apiFetch(`/admin/users/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }

        setSelectedUser((prev) => (prev?.id === id ? null : prev));
        await refreshList();
        return true;
      } catch (err: any) {
        setError(err?.message || "failed_to_delete_user");
        return null;
      } finally {
        setMutating(false);
      }
    },
    [canFetch, refreshList],
  );

  const promote = useCallback(
    async (id: string) => {
      if (!canFetch) return null;

      setMutating(true);
      setError(null);
      try {
        const res = await apiFetch(`/admin/users/${id}/promote`, {
          method: "PATCH",
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }

        const json = await res.json().catch(() => null);
        await refreshList();
        return json ?? true;
      } catch (err: any) {
        setError(err?.message || "failed_to_promote_user");
        return null;
      } finally {
        setMutating(false);
      }
    },
    [canFetch, refreshList],
  );

  const demote = useCallback(
    async (id: string) => {
      if (!canFetch) return null;

      setMutating(true);
      setError(null);
      try {
        const res = await apiFetch(`/admin/users/${id}/demote`, {
          method: "PATCH",
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }

        const json = await res.json().catch(() => null);
        await refreshList();
        return json ?? true;
      } catch (err: any) {
        setError(err?.message || "failed_to_demote_user");
        return null;
      } finally {
        setMutating(false);
      }
    },
    [canFetch, refreshList],
  );

  useEffect(() => {
    if (!canFetch) return;

    const nextKey = getParamsKey(params);
    if (lastAutoFetchKeyRef.current === nextKey) return;
    lastAutoFetchKeyRef.current = nextKey;

    void fetchList(params);
  }, [canFetch, fetchList, params]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return useMemo(
    () => ({
      mounted,
      canFetch,

      users,
      selectedUser,
      total,
      params,

      loadingList,
      loadingUser,
      mutating,
      error,

      setParams,
      refreshList,

      fetchUserById,
      clearSelectedUser,

      ban,
      unban,
      remove,
      promote,
      demote,
    }),
    [
      mounted,
      canFetch,
      users,
      selectedUser,
      total,
      params,
      loadingList,
      loadingUser,
      mutating,
      error,
      setParams,
      refreshList,
      fetchUserById,
      clearSelectedUser,
      ban,
      unban,
      remove,
      promote,
      demote,
    ],
  );
}
