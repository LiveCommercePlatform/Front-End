"use client";

import { useMemo, useState } from "react";
import ListToolbar from "@/components/ui/ListToolbar";
import ReportCard from "@/components/reports/ReportCard";
import ReportDetailsModal from "@/components/reports/ReportDetailsModal";
import { Button } from "@/components/ui/button";
import { Report, ReportStatus, ReportType } from "@/types/report";

export default function ReportList() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ReportType | "all">("all");
  const [status, setStatus] = useState<ReportStatus | "all">("all");

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [open, setOpen] = useState(false);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  /* ===== Mock Reports ===== */
  const reports: Report[] = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    type: i % 3 === 0 ? "product" : i % 3 === 1 ? "comment" : "user",
    status: i % 3 === 0 ? "new" : i % 3 === 1 ? "reviewing" : "closed",
    reason: "محتوای نامناسب یا گزارش تخلف",
    reporter: `user${i + 1}`,
    createdAt: "۲ ساعت پیش",
  }));

  /* ===== Filtering ===== */
  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (search && !r.reason.includes(search)) return false;
      if (type !== "all" && r.type !== type) return false;
      if (status !== "all" && r.status !== status) return false;
      return true;
    });
  }, [reports, search, type, status]);

  /* ===== Selection ===== */
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const clearSelection = () => setSelectedIds([]);

  /* ===== Bulk Actions ===== */
  const handleBulkClose = () => {
    console.log("close reports", selectedIds);
    clearSelection();
  };

  const handleBulkDelete = () => {
    console.log("delete reports", selectedIds);
    clearSelection();
  };

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
            value: type,
            onChange: setType,
            options: [
              { label: "همه انواع", value: "all" },
              { label: "محصول", value: "product" },
              { label: "کامنت", value: "comment" },
              { label: "کاربر", value: "user" },
            ],
          },
          {
            key: "status",
            value: status,
            onChange: setStatus,
            options: [
              { label: "همه وضعیت‌ها", value: "all" },
              { label: "جدید", value: "new" },
              { label: "درحال بررسی", value: "reviewing" },
              { label: "بسته شده", value: "closed" },
            ],
          },
        ]}
      />

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border bg-muted/40 px-4 py-2">
          <span className="text-sm">
            {selectedIds.length} گزارش انتخاب شده
          </span>

          <div className="flex gap-2">
            <Button size="sm" onClick={handleBulkClose}>
              بستن همه
            </Button>

            <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
              حذف همه
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {filtered.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            selected={selectedIds.includes(report.id)}
            onSelect={toggleSelect}
            onView={(r) => {
              setSelectedReport(r);
              setOpen(true);
            }}
          />
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border p-6 text-center opacity-60">
            گزارشی یافت نشد
          </div>
        )}
      </div>

      {/* Modal */}
      <ReportDetailsModal
        report={selectedReport}
        open={open}
        onClose={() => setOpen(false)}
        onCloseReport={(id) => {
          console.log("close report", id);
          setOpen(false);
        }}
        onDeleteTarget={(id) => {
          console.log("delete target", id);
          setOpen(false);
        }}
        onBanUser={(id) => {
          console.log("ban user", id);
          setOpen(false);
        }}
      />
    </div>
  );
}
