"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import {ProductDetails ,Product , Engagement} from "@/types";
/* ================= Types ================= */

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


type ProductWithEngagement = ProductDetails & { engagement?: Engagement };

type ProductsState = {
  items: Product[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  params: GetProductsParams;
};

type ProductsContextValue = ProductsState & {
  setParams: (next: Partial<GetProductsParams>) => void;
  fetchProducts: (p?: GetProductsParams) => Promise<void>;
  refresh: () => Promise<void>;

  getProductByIdCached: (id: string) => Promise<ProductDetails>;
  getMyEngagementCached: (id: string) => Promise<Engagement>;
  getProductWithEngagementCached: (id: string) => Promise<ProductWithEngagement>;

  deleteProduct: (id: string) => Promise<boolean>;
  invalidate: (key?: string) => void;
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
  // کلید پایدار برای کش: مرتب‌سازی keyها
  const obj = params ?? {};
  const entries = Object.entries(obj).filter(([, v]) => v !== undefined && v !== null);

  // تبدیل آرایه‌ها به string
  const normalized = entries.map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : String(v)] as const);

  // sort برای پایدار بودن
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

  // کش ساده: paramsKey -> response
  const listCacheRef = useRef<Map<string, ProductsResponse<Product>>>(new Map());

  // کش جزئیات محصول: id -> productDetails
  const productCacheRef = useRef<Map<string, ProductDetails>>(new Map());

  // کش engagement: id -> engagement
  const engagementCacheRef = useRef<Map<string, Engagement>>(new Map());

  const invalidate = useCallback((key?: string) => {
    if (!key) {
      listCacheRef.current.clear();
      productCacheRef.current.clear();
      engagementCacheRef.current.clear();
      return;
    }
    listCacheRef.current.delete(key);
  }, []);

  const fetchProducts = useCallback(async (p?: GetProductsParams) => {
    const params = p ?? state.params;
    const key = stableKey(params);

    // اگر توی کش هست
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

    setState((s) => ({ ...s, loading: true, error: null, params }));

    try {
      const qs = buildSearchParams(params);
      const res = await apiFetch(`/products?${qs}`, { method: "GET" });
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

  const setParams = useCallback((next: Partial<GetProductsParams>) => {
    setState((s) => ({
      ...s,
      params: {
        ...s.params,
        ...next,
      },
    }));
  }, []);

  const getProductByIdCached = useCallback(async (id: string) => {
    const cached = productCacheRef.current.get(id);
    if (cached) return cached;

    const res = await apiFetch(`/products/${id}`, { method: "GET" });
    if (!res.ok) throw new Error("خطا در یافتن محصول");
    const json = await res.json();

    // بعضی بک‌ها {data: {...}} میدن، بعضی مستقیم آبجکت
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

  const getProductWithEngagementCached = useCallback(async (id: string) => {
    const [product, engagement] = await Promise.all([
      getProductByIdCached(id),
      getMyEngagementCached(id),
    ]);

    return {
      ...product,
      engagement,
    };
  }, [getProductByIdCached, getMyEngagementCached]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const res = await apiFetch(`/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "خطا در حذف محصول");
      }

      toast.success("محصول با موفقیت حذف شد");

      // از کش‌ها حذف کن
      productCacheRef.current.delete(id);
      engagementCacheRef.current.delete(id);
      // لیست‌ها ممکنه شامل این محصول باشن؛ ساده‌ترین: refresh
      await refresh();

      return true;
    } catch (e: any) {
      toast.error(e?.message ?? "خطا");
      return false;
    }
  }, [refresh]);

  const value: ProductsContextValue = useMemo(
    () => ({
      ...state,
      setParams,
      fetchProducts,
      refresh,
      getProductByIdCached,
      getMyEngagementCached,
      getProductWithEngagementCached,
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