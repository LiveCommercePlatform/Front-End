"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { tokenStore } from "@/lib/token";
import { buildQuery } from "@/lib/utils";
import { AdminReport, AdminReportListResponse, AdminReportParams, ReportStatus } from "@/types";


function getParamsKey(params: AdminReportParams) {
  return JSON.stringify({
    page: params.page,
    pageSize: params.pageSize,
    type: params.type ?? "",
    status: params.status ?? "",
  });
}

const normalizeParams = (p: Partial<AdminReportParams>): AdminReportParams => ({
  page: Math.max(1, p.page ?? 1),
  pageSize: Math.min(100, Math.max(1, p.pageSize ?? 20)),
  type: (p.type ?? "") as AdminReportParams["type"],
  status: (p.status ?? "") as AdminReportParams["status"],
});


export function useReports(options?: {
  initialAdminParams?: Partial<AdminReportParams>;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const accessToken = mounted ? tokenStore.getAccess() : null;
  const canFetch = mounted && !!accessToken;

  const [reports, setReports] = useState<AdminReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [total, setTotal] = useState(0);

  const [adminParams, _setReportsParams] = useState<AdminReportParams>(() =>
    normalizeParams({
      page: options?.initialAdminParams?.page ?? 1,
      pageSize: options?.initialAdminParams?.pageSize ?? 20,
      type: options?.initialAdminParams?.type ?? "",
      status: options?.initialAdminParams?.status ?? "",
    }),
  );

  const [loadingList, setLoadingList] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const requestSeqRef = useRef(0);
  const lastAutoFetchKeyRef = useRef<string>("");

  const setReportsParams = useCallback(
    (
      next:
        | Partial<AdminReportParams>
        | ((prev: AdminReportParams) => AdminReportParams),
    ) => {
      _setReportsParams((prev) => {
        const computed =
          typeof next === "function" ? next(prev) : { ...prev, ...next };
        const normalized = normalizeParams(computed);

        const same =
          prev.page === normalized.page &&
          prev.pageSize === normalized.pageSize &&
          (prev.type ?? "") === (normalized.type ?? "") &&
          (prev.status ?? "") === (normalized.status ?? "");

        return same ? prev : normalized;
      });
    },
    [],
  );

  const fetchReportList = useCallback(
    async (p: AdminReportParams): Promise<AdminReportListResponse | null> => {
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
          type: p.type || undefined,
          status: p.status || undefined,
        });

        const res = await apiFetch(`/admin/reports?${query}`, {
          method: "GET",
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }

        const json = (await res.json()) as Partial<AdminReportListResponse>;

        if (controller.signal.aborted) return null;
        if (seq !== requestSeqRef.current) return null;

        setReports((json.data as AdminReport[]) ?? []);
        setTotal(json.total ?? 0);

        return json as AdminReportListResponse;
      } catch (err: any) {
        if (err?.name === "AbortError") return null;
        if (seq === requestSeqRef.current) {
          setError(err?.message || "failed_to_fetch_reports");
        }
        return null;
      } finally {
        if (seq === requestSeqRef.current) setLoadingList(false);
      }
    },
    [canFetch],
  );

  const refreshAdminList = useCallback(
    async () => fetchReportList(adminParams),
    [fetchReportList, adminParams],
  );

  const updateReportStatus = useCallback(
    async (id: string, status: ReportStatus) => {
      if (!canFetch) return null;

      setMutating(true);
      setError(null);

      try {
        const res = await apiFetch(`/admin/reports/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }

        const updated = (await res.json()) as AdminReport;

        setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
        setSelectedReport((prev) => (prev?.id === id ? updated : prev));

        return updated;
      } catch (err: any) {
        setError(err?.message || "failed_to_update_report_status");
        return null;
      } finally {
        setMutating(false);
      }
    },
    [canFetch],
  );

  const deleteReport = useCallback(
    async (id: string) => {
      if (!canFetch) return null;

      setMutating(true);
      setError(null);

      try {
        const res = await apiFetch(`/admin/reports/${id}`, { method: "DELETE" });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }

        setReports((prev) => prev.filter((r) => r.id !== id));
        setSelectedReport((prev) => (prev?.id === id ? null : prev));
        return true;
      } catch (err: any) {
        setError(err?.message || "failed_to_delete_report");
        return null;
      } finally {
        setMutating(false);
      }
    },
    [canFetch],
  );

  const banUserFromReport = useCallback(
    async (id: string) => {
      if (!canFetch) return null;

      setMutating(true);
      setError(null);

      try {
        const res = await apiFetch(`/admin/users/${id}/ban`, {
          method: "POST",
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }
        await refreshAdminList();

        const json = await res.json().catch(() => null);
        return json ?? true;
      } catch (err: any) {
        setError(err?.message || "failed_to_ban_user_from_report");
        return null;
      } finally {
        setMutating(false);
      }
    },
    [canFetch, refreshAdminList],
  );

  const clearSelectedReport = useCallback(() => setSelectedReport(null), []);

  useEffect(() => {
    if (!canFetch) return;

    const nextKey = getParamsKey(adminParams);
    if (lastAutoFetchKeyRef.current === nextKey) return;
    lastAutoFetchKeyRef.current = nextKey;

    void fetchReportList(adminParams);
  }, [canFetch, fetchReportList, adminParams]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return useMemo(
    () => ({
      mounted,
      canFetch,
      reports,
      total,
      adminParams,
      setReportsParams,
      loadingList,
      selectedReport,
      setSelectedReport,
      clearSelectedReport,
      mutating,
      error,
      fetchReportList,
      refreshAdminList,
      updateReportStatus,
      deleteReport,
      banUserFromReport,
    }),
    [
      mounted,
      canFetch,
      reports,
      total,
      adminParams,
      setReportsParams,
      loadingList,
      selectedReport,
      clearSelectedReport,
      mutating,
      error,
      fetchReportList,
      refreshAdminList,
      updateReportStatus,
      deleteReport,
      banUserFromReport,
    ],
  );
}
