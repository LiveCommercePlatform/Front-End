"use client";

import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Report } from "@/types/report";

const typeMap = {
  product: { label: "محصول", color: "bg-purple-100 text-purple-700" },
  comment: { label: "کامنت", color: "bg-teal-100 text-teal-700" },
  user: { label: "کاربر", color: "bg-red-100 text-red-700" },
};

const statusMap = {
  new: { label: "جدید", color: "bg-orange-100 text-orange-700" },
  reviewing: { label: "درحال بررسی", color: "bg-blue-100 text-blue-700" },
  closed: { label: "بسته شده", color: "bg-green-100 text-green-700" },
};

type Props = {
  report: Report;
  onView: (report: Report) => void;
};

export default function ReportCard({ report, onView }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border bg-card px-4 py-3 hover:bg-muted/40 transition">
      
      {/* Right */}
      <div className="flex items-center gap-3 min-w-0">
        <Badge className={typeMap[report.type].color}>
          {typeMap[report.type].label}
        </Badge>

        <Badge variant="secondary" className={statusMap[report.status].color}>
          {statusMap[report.status].label}
        </Badge>

        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {report.reason}
          </p>
          <p className="text-xs opacity-60">
            {report.reporter} • {report.createdAt}
          </p>
        </div>
      </div>

      {/* Left */}
      <Button
        size="sm"
        variant="outline"
        className="gap-1"
        onClick={() => onView(report)}
      >
        <Eye className="w-4 h-4" />
        مشاهده
      </Button>
    </div>
  );
}
