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
import type { ProductDetails, Product, Engagement } from "@/types";

/* ================= Types ================= */

export type GetProductsParams = {
  owner_id?: string;
  q?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  tags?: string[]; // => comma separated
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

export type ProductComment = {
  id?: string | number;
  content: string;
  user_name?: string;
  created_at?: string;
};

export type ProductWithEngagement = ProductDetails & { engagement?: Engagement };

type ProductsState = {
  items: Product[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  params: GetProductsParams;
};

type InvalidateKey = "list" | "product" | "engagement" | "comments";

type ProductsContextValue = ProductsState & {
  setParams: (next: Partial<GetProductsParams>) => void;

  fetchProducts: (p?: GetProductsParams) => Promise<void>;
  refresh: () => Promise<void>;

  getProductByIdCached: (id: string) => Promise<ProductDetails>;
  getMyEngagementCached: (id: string) => Promise<Engagement>;
  getProductWithEngagementCached: (id: string) => Promise<ProductWithEngagement>;

  fetchComments: (productId: string) => Promise<void>;
  getCommentsCached: (productId: string) => ProductComment[];
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
  const entries = Object.entries(obj).filter(([, v]) => v !== undefined && v !== null);

  const normalized = entries.map(
    ([k, v]) => [k, Array.isArray(v) ? v.join(",") : String(v)] as const,
  );

  normalized.sort(([a], [b]) => a.localeCompare(b));
  return normalized.map(([k, v]) => `${k}=${v}`).join("&");
}

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
    params: {
      page: 1,
      limit: 20,
      ...(initialParams ?? {}),
    },
  });

  // Abort controllers
  const listAbortRef = useRef<AbortController | null>(null);

  // caches
  const listCacheRef = useRef<Map<string, ProductsResponse<Product>>>(new Map());
  const productCacheRef = useRef<Map<string, ProductDetails>>(new Map());
  const engagementCacheRef = useRef<Map<string, Engagement>>(new Map());
  const commentsCacheRef = useRef<Map<string, ProductComment[]>>(new Map());

  // comments loading per product
  const [commentsLoadingById, setCommentsLoadingById] = useState<Record<string, boolean>>({});

  const invalidate = useCallback((scope?: InvalidateKey, key?: string) => {
    if (!scope) {
      listCacheRef.current.clear();
      productCacheRef.current.clear();
      engagementCacheRef.current.clear();
      commentsCacheRef.current.clear();
      return;
    }

    if (scope === "list") {
      if (!key) listCacheRef.current.clear();
      else listCacheRef.current.delete(key);
      return;
    }

    if (scope === "product") {
      if (!key) productCacheRef.current.clear();
      else productCacheRef.current.delete(key);
      return;
    }

    if (scope === "engagement") {
      if (!key) engagementCacheRef.current.clear();
      else engagementCacheRef.current.delete(key);
      return;
    }

    if (scope === "comments") {
      if (!key) commentsCacheRef.current.clear();
      else commentsCacheRef.current.delete(key);
    }
  }, []);

  const setParams = useCallback((next: Partial<GetProductsParams>) => {
    setState((s) => ({
      ...s,
      params: { ...s.params, ...next },
    }));

    // اگر خواستی با هر تغییر پارامتر خودکار فچ بزنه، اینو فعال کن:
    // void fetchProducts({ ...state.params, ...next });
  }, []);

  const fetchProducts = useCallback(async (p?: GetProductsParams) => {
    const params = p ?? state.params;
    const key = stableKey(params);

    // cache hit
    const cached = listCacheRef.current.get(key);
    if (cached) {
      setState((s) => ({
        ...s,
        items: cached.data ?? [],
        pagination: cached.pagination ?? null,
        loading: false,
        error: null,
        params,
      }));
      return;
    }

    // abort previous list request
    if (listAbortRef.current) listAbortRef.current.abort();
    const controller = new AbortController();
    listAbortRef.current = controller;

    setState((s) => ({ ...s, loading: true, error: null, params }));

    try {
      const qs = buildSearchParams(params);
      const res = await apiFetch(`/products?${qs}`, {
        method: "GET",
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("خطا در دریافت محصولات");

      const json: ProductsResponse<Product> = await res.json();
      listCacheRef.current.set(key, json);

      setState((s) => ({
        ...s,
        items: json.data ?? [],
        pagination: json.pagination ?? null,
        loading: false,
        error: null,
        params,
      }));
    } catch (e: any) {
      // اگر abort شد، خطا نشون نده
      if (e?.name === "AbortError") return;

      setState((s) => ({
        ...s,
        loading: false,
        error: e?.message ?? "خطا",
        params,
      }));
    }
  }, [state.params]);

  const refresh = useCallback(async () => {
    const key = stableKey(state.params);
    listCacheRef.current.delete(key);
    await fetchProducts(state.params);
  }, [fetchProducts, state.params]);

  const getProductByIdCached = useCallback(async (id: string) => {
    const cached = productCacheRef.current.get(id);
    if (cached) return cached;

    const res = await apiFetch(`/products/${id}`, { method: "GET" });
    if (!res.ok) throw new Error("خطا در یافتن محصول");
    const json = await res.json();

    const data = json?.data ?? json;
    productCacheRef.current.set(id, data);
    return data;
  }, []);

  const getMyEngagementCached = useCallback(async (id: string) => {
    const cached = engagementCacheRef.current.get(id);
    if (cached) return cached;

    const res = await apiFetch(`/products/${id}/engagement/me`, { method: "GET" });
    if (!res.ok) throw new Error("خطا در دریافت تعاملات");
    const json = await res.json();

    const data = json?.data ?? json;
    engagementCacheRef.current.set(id, data);
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

  const getCommentsCached = useCallback((productId: string) => {
    return commentsCacheRef.current.get(productId) ?? [];
  }, []);

  const fetchComments = useCallback(async (productId: string) => {
    if (!productId) return;

    // cache hit
    if (commentsCacheRef.current.has(productId)) return;

    setCommentsLoadingById((s) => ({ ...s, [productId]: true }));
    try {
      const res = await apiFetch(`/products/${productId}/comment`, { method: "GET" });
      if (!res.ok) throw new Error("خطا در دریافت کامنت‌ها");

      const json = await res.json();
      const list = Array.isArray(json) ? json : (json.data ?? []);

      commentsCacheRef.current.set(productId, list);
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

        // invalidate caches related
        productCacheRef.current.delete(id);
        engagementCacheRef.current.delete(id);
        commentsCacheRef.current.delete(id);

        await refresh();
        return true;
      } catch (e: any) {
        toast.error(e?.message ?? "خطا");
        return false;
      }
    },
    [refresh],
  );

  const value: ProductsContextValue = useMemo(
    () => ({
      ...state,
      setParams,
      fetchProducts,
      refresh,
      getProductByIdCached,
      getMyEngagementCached,
      getProductWithEngagementCached,
      fetchComments,
      getCommentsCached,
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
      getProductWithEngagementCached,
      fetchComments,
      getCommentsCached,
      commentsLoadingById,
      deleteProduct,
      invalidate,
    ],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}