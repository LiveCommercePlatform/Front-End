"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import type { Stream, LiveRoomStats, ReactionType } from "@/types";

/* ================= Types ================= */

export type GetLiveRoomsParams = {
  status?: string;
};

export interface StreamData {
  title: string;
  description?: string;
  is_recorded: boolean;
}

export type LiveRoomsResponse<T = any> = {
  data: T[];
};

type LiveRoomState = {
  lives: Stream[];
  loading: boolean;
  error: string | null;
  params: GetLiveRoomsParams;
};

type InvalidateKey = "list" | "single";

type LiveRoomContextValue = LiveRoomState & {
  setParams: (next: Partial<GetLiveRoomsParams>) => void;

  fetchLiveRooms: (p?: GetLiveRoomsParams) => Promise<void>;
  refresh: () => Promise<void>;

  getLiveRoomByIdCached: (id: string) => Promise<Stream>;

  createLiveRoom: (data: Partial<StreamData>) => Promise<string>;
  updateLiveRoom: (id: string, data: Partial<StreamData>) => Promise<boolean>;
  deleteLiveRoom: (id: string) => Promise<boolean>;

  startStream: (id: string) => Promise<boolean>;
  endStream: (id: string) => Promise<boolean>;
  getLiveRoomProducts: (streamId: string) => Promise<any[]>;
  removeProductFromLive: (
    streamId: string,
    productId: string,
  ) => Promise<boolean>;
  pinLiveProduct: (
    streamId: string,
    productId: string,
    isPinned: boolean,
  ) => Promise<boolean>;

  likeStream: (streamId: string) => Promise<boolean>;
  dislikeStream: (streamId: string) => Promise<boolean>;
  getMyReaction: (streamId: string) => Promise<ReactionType>;
  getLiveRoomStats: (streamId: string) => Promise<LiveRoomStats | null>;
  removeReaction: (streamId: string) => Promise<boolean>;

  invalidate: (scope?: InvalidateKey, key?: string) => void;
};

/* ================= Helpers ================= */

function buildSearchParams(params?: GetLiveRoomsParams) {
  const sp = new URLSearchParams();
  if (params?.status) sp.append("status", params.status);
  return sp.toString();
}

function stableKey(params?: GetLiveRoomsParams) {
  return params?.status ? `status=${params.status}` : "all";
}

/* ================= Context ================= */

const LiveRoomContext = createContext<LiveRoomContextValue | null>(null);

export function LiveRoomProvider({
  children,
  initialParams,
}: {
  children: React.ReactNode;
  initialParams?: GetLiveRoomsParams;
}) {
  const [state, setState] = useState<LiveRoomState>({
    lives: [],
    loading: false,
    error: null,
    params: {
      ...(initialParams ?? {}),
    },
  });

  const listAbortRef = useRef<AbortController | null>(null);

  const listCacheRef = useRef<Map<string, LiveRoomsResponse<Stream>>>(
    new Map(),
  );
  const singleCacheRef = useRef<Map<string, Stream>>(new Map());

  /* ================= invalidate ================= */

  const invalidate = useCallback((scope?: InvalidateKey, key?: string) => {
    if (!scope) {
      listCacheRef.current.clear();
      singleCacheRef.current.clear();
      return;
    }

    if (scope === "list") {
      if (!key) listCacheRef.current.clear();
      else listCacheRef.current.delete(key);
    }

    if (scope === "single") {
      if (!key) singleCacheRef.current.clear();
      else singleCacheRef.current.delete(key);
    }
  }, []);

  /* ================= Params ================= */

  const setParams = useCallback((next: Partial<GetLiveRoomsParams>) => {
    setState((s) => {
      const newParams = { ...s.params, ...next };
      void fetchLiveRooms(newParams);
      return { ...s, params: newParams };
    });
  }, []);

  /* ================= Fetch List ================= */

  const fetchLiveRooms = useCallback(
    async (p?: GetLiveRoomsParams) => {
      const params = p ?? state.params;
      const key = stableKey(params);

      const cached = listCacheRef.current.get(key);
      if (cached) {
        setState((s) => ({
          ...s,
          lives: cached ?? [],
          loading: false,
          error: null,
          params,
        }));
        return;
      }

      if (listAbortRef.current) listAbortRef.current.abort();
      const controller = new AbortController();
      listAbortRef.current = controller;

      setState((s) => ({ ...s, loading: true, error: null, params }));

      try {
        const qs = buildSearchParams(params);
        const res = await apiFetch(`/live-rooms?${qs}`, {
          method: "GET",
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("خطا در دریافت لیست لایوروم‌ها");

        const json: LiveRoomsResponse<Stream> = await res.json();
        listCacheRef.current.set(key, json);
        setState((s) => ({
          ...s,
          lives: json ?? [],
          loading: false,
          error: null,
          params,
        }));
      } catch (e: any) {
        if (e?.name === "AbortError") return;

        setState((s) => ({
          ...s,
          loading: false,
          error: e?.message ?? "خطا",
          params,
        }));
      }
    },
    [state.params],
  );

  const refresh = useCallback(async () => {
    const key = stableKey(state.params);
    listCacheRef.current.delete(key);
    await fetchLiveRooms(state.params);
  }, [fetchLiveRooms, state.params]);

  const getLiveRoomByIdCached = useCallback(async (id: string) => {
    const cached = singleCacheRef.current.get(id);
    if (cached) return cached;

    const res = await apiFetch(`/live-rooms/${id}`, { method: "GET" });
    if (!res.ok) throw new Error("خطا در دریافت لایوروم");

    const json = await res.json();
    const data = json?.data ?? json;

    singleCacheRef.current.set(id, data);
    return data;
  }, []);

  const createLiveRoom = async (data: Partial<StreamData>) => {
    try {
      const res = await apiFetch("/live-rooms", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "خطا در ساخت لایو روم");
      return json.ID;
    } catch (err: any) {
      toast.error(err.message || "خطا در درخواست");
      throw err;
    } finally {
    }
  };
  const updateLiveRoom = useCallback(
    async (id: string, data: Partial<StreamData>) => {
      try {
        const res = await apiFetch(`/live-rooms/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("خطا در بروزرسانی");

        invalidate("single", id);
        invalidate("list");

        await refresh();

        return true;
      } catch (e: any) {
        toast.error(e?.message ?? "خطا");
        return false;
      }
    },
    [refresh, invalidate],
  );

  const deleteLiveRoom = useCallback(
    async (id: string) => {
      try {
        const res = await apiFetch(`/live-rooms/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("خطا در حذف");

        toast.success("لایوروم حذف شد");

        invalidate("single", id);
        invalidate("list");

        await refresh();

        return true;
      } catch (e: any) {
        toast.error(e?.message ?? "خطا");
        return false;
      }
    },
    [refresh, invalidate],
  );

  const startStream = useCallback(
    async (id: string) => {
      try {
        const res = await apiFetch(`/live-rooms/${id}/start`, {
          method: "POST",
        });

        if (!res.ok) throw new Error("خطا در شروع استریم");

        toast.success("استریم شروع شد");

        invalidate("single", id);
        invalidate("list");

        await refresh();

        return true;
      } catch (e: any) {
        toast.error(e?.message ?? "خطا");
        return false;
      }
    },
    [refresh, invalidate],
  );

  const endStream = useCallback(
    async (id: string) => {
      try {
        const res = await apiFetch(`/live-rooms/${id}/end`, {
          method: "POST",
        });

        if (!res.ok) throw new Error("خطا در پایان استریم");

        toast.success("استریم پایان یافت");

        invalidate("single", id);
        invalidate("list");

        await refresh();

        return true;
      } catch (e: any) {
        toast.error(e?.message ?? "خطا");
        return false;
      }
    },
    [refresh, invalidate],
  );

  const getLiveRoomProducts = useCallback(async (streamId: string) => {
    try {
      const res = await apiFetch(`/live-rooms/${streamId}/products`);
      if (!res.ok) throw new Error("خطا در دریافت محصولات لایو");
      return await res.json();
    } catch (e: any) {
      toast.error(e?.message ?? "خطا در دریافت محصولات لایو");
      return [];
    }
  }, []);

  const removeProductFromLive = useCallback(
    async (streamId: string, productId: string) => {
      try {
        const res = await apiFetch(
          `/live-rooms/${streamId}/products/${productId}`,
          {
            method: "DELETE",
          },
        );
        if (!res.ok) throw new Error("خطا در حذف محصول از لایو");
        invalidate("single", streamId);
        return true;
      } catch (e: any) {
        toast.error(e?.message ?? "خطا");
        return false;
      }
    },
    [invalidate],
  );

  const pinLiveProduct = useCallback(
    async (streamId: string, productId: string, isPinned: boolean) => {
      try {
        const res = await apiFetch(
          `/live-rooms/${streamId}/products/${productId}/pin`,
          {
            method: "PATCH",
            body: JSON.stringify({ is_pinned: isPinned }),
          },
        );

        if (!res.ok) throw new Error("خطا در پین کردن محصول");
        invalidate("single", streamId);
        return true;
      } catch (e: any) {
        toast.error(e?.message ?? "خطا در پین کردن");
        return false;
      }
    },
    [invalidate],
  );


  const likeStream = useCallback(
    async (streamId: string) => {
      try {
        const res = await apiFetch(`/live-rooms/${streamId}/reactions/like`, {
          method: "POST",
        });

        if (!res.ok) throw new Error("خطا در ارسال لایک");

        invalidate("single", streamId);
        return true;
      } catch {
        return false;
      }
    },
    [invalidate],
  );

  const dislikeStream = useCallback(
    async (streamId: string) => {
      try {
        const res = await apiFetch(
          `/live-rooms/${streamId}/reactions/dislike`,
          {
            method: "POST",
          },
        );

        if (!res.ok) throw new Error("خطا در ارسال دیسلایک");

        invalidate("single", streamId);
        return true;
      } catch {
        return false;
      }
    },
    [invalidate],
  );
const removeReaction = useCallback(
  async (streamId: string) => {
    try {
      const res = await apiFetch(
        `/live-rooms/${streamId}/reactions`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) throw new Error("خطا در حذف واکنش");

      invalidate("single", streamId);
      return true;
    } catch {
      return false;
    }
  },
  [invalidate],
);

  const getMyReaction = useCallback(async (streamId: string) => {
    try {
      const res = await apiFetch(`/live-rooms/${streamId}/reactions/me`);

      if (!res.ok) throw new Error("خطا در دریافت واکنش");
      const json = await res.json();
      return json.reaction;
    } catch (e: any) {
      toast.error(e?.message ?? "خطا در دریافت واکنش");
      return null;
    }
  }, []);

  const getLiveRoomStats = useCallback(async (streamId: string) => {
    try {
      const res = await apiFetch(`/live-rooms/${streamId}/stats`);

      if (!res.ok) throw new Error("خطا در گرفتن آمار لایو");

      return await res.json(); // { total_likes, total_dislikes, total_views, viewer_count }
    } catch (e: any) {
      toast.error(e?.message ?? "خطا در گرفتن آمار");
      return null;
    }
  }, []);

  const value: LiveRoomContextValue = useMemo(
    () => ({
      ...state,
      setParams,
      fetchLiveRooms,
      refresh,
      getLiveRoomByIdCached,
      invalidate,
      createLiveRoom,
      updateLiveRoom,
      deleteLiveRoom,
      startStream,
      endStream,
      getLiveRoomProducts,
      removeProductFromLive,
      pinLiveProduct,
      likeStream,
      dislikeStream,
      getMyReaction,
      getLiveRoomStats,
      removeReaction,
    }),
    [
      state,
      setParams,
      fetchLiveRooms,
      refresh,
      getLiveRoomByIdCached,
      invalidate,
      createLiveRoom,
      updateLiveRoom,
      deleteLiveRoom,
      startStream,
      endStream,
      getLiveRoomProducts,
      removeProductFromLive,
      pinLiveProduct,
      likeStream,
      dislikeStream,
      getMyReaction,
      getLiveRoomStats,
      removeReaction,
    ],
  );

  return (
    <LiveRoomContext.Provider value={value}>
      {children}
    </LiveRoomContext.Provider>
  );
}

export function useLiveRooms() {
  const ctx = useContext(LiveRoomContext);
  if (!ctx)
    throw new Error("useLiveRooms must be used within LiveRoomProvider");
  return ctx;
}
