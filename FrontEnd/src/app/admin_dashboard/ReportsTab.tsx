"use client";

import { useMemo, useState } from "react";
import ListToolbar from "@/components/ui/ListToolbar";
import ReportCard from "@/components/reports/ReportCard";
import ReportDetailsModal from "@/components/reports/ReportDetailsModal";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/useReports";
import Pagination from "@/components/ui/Pagination";
import { AdminReport, ReportStatus, ReportType } from "@/types";
import Loading from "@/components/ui/Loading";
import NotFound from "@/components/ui/NotFound";

export default function ReportsTab() {
  const {
    reports,
    total,
    adminParams,
    setReportsParams,
    loadingList,
    mutating,
    error,
    updateReportStatus,
    deleteReport,
    banUserFromReport,
    refreshAdminList,
  } = useReports({
    initialAdminParams: { page: 1, pageSize: 20, type: "", status: "" },
  });

  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(
    null,
  );
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const s = search.trim();
    return reports.filter((r) => {
      if (!s) return true;
      return (r.reason ?? "").includes(s);
    });
  }, [reports, search]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };
  const clearSelection = () => setSelectedIds([]);

  const handleBulkClose = async () => {
    await Promise.all(
      selectedIds.map((id) => updateReportStatus(id, "closed")),
    );
    clearSelection();
    await refreshAdminList();
  };

  const handleBulkDelete = async () => {
    await Promise.all(selectedIds.map((id) => deleteReport(id)));
    clearSelection();
    await refreshAdminList();
  };

  const uiType: ReportType | "all" = adminParams.type
    ? adminParams.type
    : "all";
  const uiStatus: ReportStatus | "all" = adminParams.status
    ? adminParams.status
    : "all";

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="جستجوی گزارش..."
        filters={[
          {
            key: "type",
            value: uiType,
            onChange: (v: ReportType | "all") =>
              setReportsParams({ page: 1, type: v === "all" ? "" : v }),
            options: [
              { label: "همه انواع", value: "all" },
              { label: "محصول", value: "product" },
              { label: "کامنت", value: "comment" },
              { label: "کاربر", value: "user" },
            ],
          },
          {
            key: "status",
            value: uiStatus,
            onChange: (v: ReportStatus | "all") =>
              setReportsParams({ page: 1, status: v === "all" ? "" : v }),
            options: [
              { label: "همه وضعیت‌ها", value: "all" },
              { label: "جدید", value: "new" },
              { label: "درحال بررسی", value: "reviewing" },
              { label: "بسته شده", value: "closed" },
            ],
          },
        ]}
      />

      {/* states */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border bg-muted/40 px-4 py-2">
          <span className="text-sm">{selectedIds.length} گزارش انتخاب شده</span>

          <div className="flex gap-2">
            <Button size="sm" disabled={mutating} onClick={handleBulkClose}>
              بستن همه
            </Button>

            <Button
              size="sm"
              variant="destructive"
              disabled={mutating}
              onClick={handleBulkDelete}
            >
              حذف همه
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {loadingList ? (
          <Loading />
        ) : (
          <>
            {filtered.map((r) => {
              return (
                <ReportCard
                  key={r.id}
                  report={r}
                  selected={selectedIds.includes(r.id)}
                  onChangeStatus={updateReportStatus}
                  onDelete={deleteReport}
                  onView={() => {
                    setSelectedReport(r);
                    setOpen(true);
                  }}
                />
              );
            })}

            {filtered.length === 0 && (
              <NotFound message="" />
            )}
          </>
        )}
      </div>

      <ReportDetailsModal
        report={selectedReport}
        open={open}
        onClose={() => setOpen(false)}
        onCloseReport={async (id: string) => {
          await updateReportStatus(id, "closed");
          setOpen(false);
          await refreshAdminList();
        }}
        onDeleteTarget={async (id: string) => {
          await deleteReport(id);
          setOpen(false);
          await refreshAdminList();
        }}
        onBanUser={async (id: string) => {
          await banUserFromReport(id);
          setOpen(false);
          await refreshAdminList();
        }}
      />

      <Pagination
        page={adminParams.page}
        totalItems={total}
        onPageChange={(nextPage) =>
          setReportsParams((prev) => ({ ...prev, page: nextPage }))
        }
      />
    </div>
  );
}
