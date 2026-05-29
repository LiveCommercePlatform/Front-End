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
import type {
  ProductDetails,
  Product,
  Engagement,
  RatingData,
  ProductComment,
} from "@/types";

const CACHE_TTL = 20_000; 

type CachedItem<T> = {
  data: T;
  timestamp: number;
};

const isExpired = (item?: CachedItem<any>) => {
  if (!item) return true;
  return Date.now() - item.timestamp > CACHE_TTL;
};

export type GetProductsParams = {
  owner_id?: string;
  q?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  tags?: string[];
  in_stock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};
export type ProductsResponse<T = any> = {
  data: T[];
  pagination?: PaginationMeta;
};
export type ProductWithEngagement = ProductDetails & {
  engagement?: Engagement;
};

type ProductsState = {
  items: Product[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  params: GetProductsParams;
};

type InvalidateKey = "list" | "product" | "engagement" | "comments" | "stat";

type ProductsContextValue = ProductsState & {
  setParams: (next: Partial<GetProductsParams>) => void;
  fetchProducts: (p?: GetProductsParams) => Promise<void>;
  refresh: () => Promise<void>;
  getProductByIdCached: (id: string) => Promise<ProductDetails>;
  getMyEngagementCached: (id: string) => Promise<Engagement>;
  getStatCached: (id: string) => Promise<RatingData>;
  getMystatCached: (id: string) => Promise<number>;
  getProductWithEngagementCached: (
    id: string,
  ) => Promise<ProductWithEngagement>;
  fetchComments: (productId: string) => Promise<ProductComment[]>;
  commentsLoadingById: Record<string, boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  invalidate: (scope?: InvalidateKey, key?: string) => void;
};

/* ================= Helpers ================= */

function buildSearchParams(params?: GetProductsParams) {
  const sp = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) sp.append(key, value.join(","));
    else sp.append(key, String(value));
  });
  return sp.toString();
}

function stableKey(params?: GetProductsParams) {
  const obj = params ?? {};
  const entries = Object.entries(obj).filter(
    ([, v]) => v !== undefined && v !== null,
  );
  const normalized = entries.map(
    ([k, v]) => [k, Array.isArray(v) ? v.join(",") : String(v)] as const,
  );
  normalized.sort(([a], [b]) => a.localeCompare(b));
  return normalized.map(([k, v]) => `${k}=${v}`).join("&");
}

const enforceCacheLimit = (map: Map<any, any>, limit: number) => {
  if (map.size > limit) {
    const firstKey = map.keys().next().value;
    map.delete(firstKey);
  }
};

/* ================= Context ================= */

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({
  children,
  initialParams,
}: {
  children: React.ReactNode;
  initialParams?: GetProductsParams;
}) {
  const [state, setState] = useState<ProductsState>({
    items: [],
    pagination: null,
    loading: false,
    error: null,
    params: { page: 1, limit: 20, ...(initialParams ?? {}) },
  });

  const listAbortRef = useRef<AbortController | null>(null);

  // تغییر ساختار تمام کش‌ها برای نگهداری تایم‌استمپ
  const listCacheRef = useRef<
    Map<string, CachedItem<ProductsResponse<Product>>>
  >(new Map());
  const productCacheRef = useRef<Map<string, CachedItem<ProductDetails>>>(
    new Map(),
  );
  const engagementCacheRef = useRef<Map<string, CachedItem<Engagement>>>(
    new Map(),
  );
  const statCacheRef = useRef<Map<string, CachedItem<RatingData>>>(new Map());
  const mystatCacheRef = useRef<Map<string, CachedItem<number>>>(new Map());
  const commentsCacheRef = useRef<Map<string, CachedItem<ProductComment[]>>>(
    new Map(),
  );

  const [commentsLoadingById, setCommentsLoadingById] = useState<
    Record<string, boolean>
  >({});

  const invalidate = useCallback((scope?: InvalidateKey, key?: string) => {
    const caches = {
      list: listCacheRef,
      product: productCacheRef,
      engagement: engagementCacheRef,
      comments: commentsCacheRef,
      stat: [statCacheRef, mystatCacheRef],
    };

    if (!scope) {
      Object.values(caches)
        .flat()
        .forEach((ref) => ref.current.clear());
      return;
    }

    const target = caches[scope];
    if (Array.isArray(target)) {
      target.forEach((ref) =>
        key ? ref.current.delete(key) : ref.current.clear(),
      );
    } else {
      key ? target.current.delete(key) : target.current.clear();
    }
  }, []);

  const fetchProducts = useCallback(
    async (p?: GetProductsParams) => {
      const params = p ?? state.params;
      const key = stableKey(params);
      const cached = listCacheRef.current.get(key);

      if (!isExpired(cached)) {
        setState((s) => ({
          ...s,
          items: cached!.data.data ?? [],
          pagination: cached!.data.pagination ?? null,
          loading: false,
          error: null,
        }));
        return;
      }

      if (listAbortRef.current) listAbortRef.current.abort();
      const controller = new AbortController();
      listAbortRef.current = controller;

      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        const qs = buildSearchParams(params);
        const res = await apiFetch(`/products?${qs}`, {
          method: "GET",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("خطا در دریافت محصولات");

        const json: ProductsResponse<Product> = await res.json();
        listCacheRef.current.set(key, { data: json, timestamp: Date.now() });
        enforceCacheLimit(listCacheRef.current, 100);
        setState((s) => ({
          ...s,
          items: json.data ?? [],
          pagination: json.pagination ?? null,
          loading: false,
          error: null,
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
    [],
  );

  const setParams = useCallback(
    (next: Partial<GetProductsParams>) => {
      setState((s) => {
        const newParams = { ...s.params, ...next };
        void fetchProducts(newParams);
        return { ...s, params: newParams };
      });
    },
    [fetchProducts],
  );

  const refresh = useCallback(async () => {
    invalidate("list", stableKey(state.params));
    await fetchProducts(state.params);
  }, [fetchProducts, state.params, invalidate]);

  const getProductByIdCached = useCallback(async (id: string) => {
    const cached = productCacheRef.current.get(id);
    if (!isExpired(cached)) return cached!.data;

    const res = await apiFetch(`/products/${id}`, { method: "GET" });
    if (!res.ok) throw new Error("خطا در یافتن محصول");
    const json = await res.json();
    const data = json?.data ?? json;

    productCacheRef.current.set(id, { data, timestamp: Date.now() });
    enforceCacheLimit(productCacheRef.current, 50);
    return data;
  }, []);

  const getMyEngagementCached = useCallback(async (id: string) => {
    const cached = engagementCacheRef.current.get(id);
    if (!isExpired(cached)) return cached!.data;

    const res = await apiFetch(`/products/${id}/engagement/me`, {
      method: "GET",
    });
    if (!res.ok) throw new Error("خطا در دریافت تعاملات");
    const json = await res.json();
    const data = json?.data ?? json;

    engagementCacheRef.current.set(id, { data, timestamp: Date.now() });
    enforceCacheLimit(engagementCacheRef.current, 50);
    return data;
  }, []);

  const getStatCached = useCallback(async (id: string) => {
    const cached = statCacheRef.current.get(id);
    if (!isExpired(cached)) return cached!.data;

    const res = await apiFetch(`/products/${id}/rating/summary`, {
      method: "GET",
    });
    if (!res.ok) throw new Error("خطا در دریافت امتیازات");
    const json = await res.json();
    const data = json?.data ?? json;

    statCacheRef.current.set(id, { data, timestamp: Date.now() });
    enforceCacheLimit(statCacheRef.current, 50);
    return data;
  }, []);

  const getMystatCached = useCallback(async (id: string) => {
    const cached = mystatCacheRef.current.get(id);
    if (!isExpired(cached)) return cached!.data;

    const res = await apiFetch(`/products/${id}/rating/me`, { method: "GET" });
    if (!res.ok) throw new Error("خطا در دریافت امتیازات");
    const json = await res.json();
    const data = json?.data ?? json.my_rating;

    mystatCacheRef.current.set(id, { data, timestamp: Date.now() });
    enforceCacheLimit(mystatCacheRef.current, 50);
    return data;
  }, []);

  const getProductWithEngagementCached = useCallback(
    async (id: string) => {
      const [product, engagement] = await Promise.all([
        getProductByIdCached(id),
        getMyEngagementCached(id),
      ]);
      return { ...product, engagement };
    },
    [getProductByIdCached, getMyEngagementCached],
  );

  const fetchComments = useCallback(async (productId: string) => {
    if (!productId) return;
    const cached = commentsCacheRef.current.get(productId);
    if (!isExpired(cached)) return cached!.data;

    setCommentsLoadingById((s) => ({ ...s, [productId]: true }));
    try {
      const res = await apiFetch(`/products/${productId}/comments`, {
        method: "GET",
      });
      if (!res.ok) throw new Error("خطا در دریافت کامنت‌ها");
      const json = await res.json();
      const list = Array.isArray(json) ? json : (json.data ?? []);

      commentsCacheRef.current.set(productId, {
        data: list,
        timestamp: Date.now(),
      });
      enforceCacheLimit(commentsCacheRef.current, 25);
      return list;
    } catch (e: any) {
      toast.error(e?.message ?? "خطا در دریافت کامنت‌ها");
    } finally {
      setCommentsLoadingById((s) => ({ ...s, [productId]: false }));
    }
  }, []);

  const deleteProduct = useCallback(
    async (id: string) => {
      try {
        const res = await apiFetch(`/products/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || "خطا در حذف محصول");
        }
        toast.success("محصول با موفقیت حذف شد");
        invalidate("product", id);
        invalidate("engagement", id);
        invalidate("comments", id);
        invalidate("stat", id);
        await refresh();
        return true;
      } catch (e: any) {
        toast.error(e?.message ?? "خطا");
        return false;
      }
    },
    [refresh, invalidate],
  );

  const value: ProductsContextValue = useMemo(
    () => ({
      ...state,
      setParams,
      fetchProducts,
      refresh,
      getProductByIdCached,
      getMyEngagementCached,
      getStatCached,
      getMystatCached,
      getProductWithEngagementCached,
      fetchComments,
      commentsLoadingById,
      deleteProduct,
      invalidate,
    }),
    [
      state,
      setParams,
      fetchProducts,
      refresh,
      getProductByIdCached,
      getMyEngagementCached,
      getStatCached,
      getMystatCached,
      getProductWithEngagementCached,
      fetchComments,
      commentsLoadingById,
      deleteProduct,
      invalidate,
    ],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
