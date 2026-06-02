"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { tokenStore } from "@/lib/token";
import { buildQuery } from "@/lib/utils";
import { CreateOrderInput, Order, OrderStatus } from "@/types";



export type ListOrdersResponse = {
  data: Order[];
  total: number;
  page: number;
  page_size: number;
};

export type MyOrderParams = {
  page: number;
  pageSize: number;
};

export type AdminOrderParams = {
  page: number;
  pageSize: number;
  status?: OrderStatus | "";
};

function normalizeMyParams(p: Partial<MyOrderParams>): MyOrderParams {
  return {
    page: Math.max(1, p.page ?? 1),
    pageSize: Math.min(100, Math.max(1, p.pageSize ?? 10)),
  };
}

function normalizeAdminParams(p: Partial<AdminOrderParams>): AdminOrderParams {
  return {
    page: Math.max(1, p.page ?? 1),
    pageSize: Math.min(100, Math.max(1, p.pageSize ?? 20)),
    status: (p.status ?? "") as AdminOrderParams["status"],
  };
}

type UseOrdersOptions = {
  initialMyParams?: Partial<MyOrderParams>;
  initialAdminParams?: Partial<AdminOrderParams>;
  autoStart?: boolean;
};

export function useOrders(options: UseOrdersOptions = {}) {
  const { initialMyParams, initialAdminParams, autoStart = true } = options;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const accessToken = mounted ? tokenStore.getAccess() : null;
  const canFetch = mounted && !!accessToken;

  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [myTotal, setMyTotal] = useState(0);
  const [myParams, _setMyParams] = useState<MyOrderParams>(() =>
    normalizeMyParams(initialMyParams ?? {}),
  );

  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [adminTotal, setAdminTotal] = useState(0);
  const [adminParams, _setAdminParams] = useState<AdminOrderParams>(() =>
    normalizeAdminParams(initialAdminParams ?? {}),
  );

  // ----- Shared state -----
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingMyList, setLoadingMyList] = useState(false);
  const [loadingAdminList, setLoadingAdminList] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortMyRef = useRef<AbortController | null>(null);
  const abortAdminRef = useRef<AbortController | null>(null);
  const reqSeqMyRef = useRef(0);
  const reqSeqAdminRef = useRef(0);
  const lastMyKeyRef = useRef("");
  const lastAdminKeyRef = useRef("");

  const setMyParams = useCallback(
    (
      next: Partial<MyOrderParams> | ((prev: MyOrderParams) => MyOrderParams),
    ) => {
      _setMyParams((prev) => {
        const computed =
          typeof next === "function" ? next(prev) : { ...prev, ...next };
        const normalized = normalizeMyParams(computed);

        const same =
          prev.page === normalized.page &&
          prev.pageSize === normalized.pageSize;

        return same ? prev : normalized;
      });
    },
    [],
  );

  const setAdminParams = useCallback(
    (
      next:
        | Partial<AdminOrderParams>
        | ((prev: AdminOrderParams) => AdminOrderParams),
    ) => {
      _setAdminParams((prev) => {
        const computed =
          typeof next === "function" ? next(prev) : { ...prev, ...next };
        const normalized = normalizeAdminParams(computed);

        const same =
          prev.page === normalized.page &&
          prev.pageSize === normalized.pageSize &&
          (prev.status ?? "") === (normalized.status ?? "");

        return same ? prev : normalized;
      });
    },
    [],
  );

  const fetchMyOrders = useCallback(
    async (p: MyOrderParams): Promise<ListOrdersResponse | null> => {
      if (!canFetch) return null;

      abortMyRef.current?.abort();
      const controller = new AbortController();
      abortMyRef.current = controller;

      const seq = ++reqSeqMyRef.current;

      setLoadingMyList(true);
      setError(null);

      try {
        const query = buildQuery({
          page: p.page,
          page_size: p.pageSize,
        });

        const res = await apiFetch(`/orders?${query}`, {
          method: "GET",
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }

        const json = (await res.json()) as Partial<ListOrdersResponse>;

        if (controller.signal.aborted) return null;
        if (seq !== reqSeqMyRef.current) return null;

        setMyOrders((json.data as Order[]) ?? []);
        setMyTotal(json.total ?? 0);

        return json as ListOrdersResponse;
      } catch (err: any) {
        if (err?.name === "AbortError") return null;
        if (seq === reqSeqMyRef.current) {
          setError(err?.message || "failed_to_fetch_orders");
        }
        return null;
      } finally {
        if (seq === reqSeqMyRef.current) {
          setLoadingMyList(false);
        }
      }
    },
    [canFetch],
  );

  const fetchAdminOrders = useCallback(
    async (p: AdminOrderParams): Promise<ListOrdersResponse | null> => {
      if (!canFetch) return null;

      abortAdminRef.current?.abort();
      const controller = new AbortController();
      abortAdminRef.current = controller;

      const seq = ++reqSeqAdminRef.current;

      setLoadingAdminList(true);
      setError(null);

      try {
        const query = buildQuery({
          page: p.page,
          page_size: p.pageSize,
          status: p.status || undefined,
        });

        const res = await apiFetch(`/orders/all?${query}`, {
          method: "GET",
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }

        const json = (await res.json()) as Partial<ListOrdersResponse>;

        if (controller.signal.aborted) return null;
        if (seq !== reqSeqAdminRef.current) return null;

        setAdminOrders((json.data as Order[]) ?? []);
        setAdminTotal(json.total ?? 0);

        return json as ListOrdersResponse;
      } catch (err: any) {
        if (err?.name === "AbortError") return null;
        if (seq === reqSeqAdminRef.current) {
          setError(err?.message || "failed_to_fetch_admin_orders");
        }
        return null;
      } finally {
        if (seq === reqSeqAdminRef.current) {
          setLoadingAdminList(false);
        }
      }
    },
    [canFetch],
  );

  const refreshMyList = useCallback(async () => {
    return fetchMyOrders(myParams);
  }, [fetchMyOrders, myParams]);

  const refreshAdminList = useCallback(async () => {
    return fetchAdminOrders(adminParams);
  }, [fetchAdminOrders, adminParams]);

  const getOrderByID = useCallback(
    async (id: string) => {
      if (!canFetch) return null;

      setMutating(true);
      setError(null);

      try {
        const res = await apiFetch(`/orders/${id}`, { method: "GET" });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }

        const order = (await res.json()) as Order;
        setSelectedOrder(order);
        return order;
      } catch (err: any) {
        setError(err?.message || "failed_to_fetch_order");
        return null;
      } finally {
        setMutating(false);
      }
    },
    [canFetch],
  );

  const createOrder = useCallback(
    async (input: CreateOrderInput) => {
      if (!canFetch) return null;

      setMutating(true);
      setError(null);

      try {
        const res = await apiFetch(`/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: input.items.map((x) => ({
              product_id: x.product_id,
              qty: x.qty,
            })),
            live_room_id: input.live_room_id ?? null,
          }),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }

        const created = (await res.json()) as Order;

        // فقط اگر خواستی بعد از ساخت سفارش، لیستت رفرش شود
        void refreshMyList();

        return created;
      } catch (err: any) {
        setError(err?.message || "order_failed");
        return null;
      } finally {
        setMutating(false);
      }
    },
    [canFetch, refreshMyList],
  );

  const cancelOrder = useCallback(
    async (id: string) => {
      if (!canFetch) return null;

      setMutating(true);
      setError(null);

      try {
        const res = await apiFetch(`/orders/${id}/cancel`, { method: "PATCH" });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }

        const updated = (await res.json()) as Order;

        setMyOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
        setSelectedOrder((prev) => (prev?.id === id ? updated : prev));

        return updated;
      } catch (err: any) {
        setError(err?.message || "cancel_failed");
        return null;
      } finally {
        setMutating(false);
      }
    },
    [canFetch],
  );

  const adminUpdateOrderStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      if (!canFetch) return null;

      setMutating(true);
      setError(null);

      try {
        const res = await apiFetch(`/admin/orders/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }

        const updated = (await res.json()) as Order;

        setAdminOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
        setSelectedOrder((prev) => (prev?.id === id ? updated : prev));

        return updated;
      } catch (err: any) {
        setError(err?.message || "failed_to_update_order_status");
        return null;
      } finally {
        setMutating(false);
      }
    },
    [canFetch],
  );

  const clearSelectedOrder = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  // auto fetch my list
  useEffect(() => {
    if (!canFetch || !autoStart) return;

    const key = JSON.stringify(myParams);
    if (lastMyKeyRef.current === key) return;
    lastMyKeyRef.current = key;

    void fetchMyOrders(myParams);
  }, [canFetch, autoStart, myParams, fetchMyOrders]);

  // auto fetch admin list
  useEffect(() => {
    if (!canFetch || !autoStart) return;

    const key = JSON.stringify(adminParams);
    if (lastAdminKeyRef.current === key) return;
    lastAdminKeyRef.current = key;

    void fetchAdminOrders(adminParams);
  }, [canFetch, autoStart, adminParams, fetchAdminOrders]);

  useEffect(() => {
    return () => {
      abortMyRef.current?.abort();
      abortAdminRef.current?.abort();
    };
  }, []);

  return useMemo(
    () => ({
      mounted,
      canFetch,

      myOrders,
      myTotal,
      myParams,
      setMyParams,
      loadingMyList,
      fetchMyOrders,
      refreshMyList,

      adminOrders,
      adminTotal,
      adminParams,
      setAdminParams,
      loadingAdminList,
      fetchAdminOrders,
      refreshAdminList,

      selectedOrder,
      setSelectedOrder,
      clearSelectedOrder,
      getOrderByID,

      createOrder,
      cancelOrder,
      adminUpdateOrderStatus,

      mutating,
      error,
    }),
    [
      mounted,
      canFetch,

      myOrders,
      myTotal,
      myParams,
      setMyParams,
      loadingMyList,
      fetchMyOrders,
      refreshMyList,

      adminOrders,
      adminTotal,
      adminParams,
      setAdminParams,
      loadingAdminList,
      fetchAdminOrders,
      refreshAdminList,

      selectedOrder,
      clearSelectedOrder,
      getOrderByID,

      createOrder,
      cancelOrder,
      adminUpdateOrderStatus,

      mutating,
      error,
    ],
  );
}
