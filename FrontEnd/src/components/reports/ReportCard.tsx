"use client";

import {
  Eye,
  Trash2,
  RefreshCw,
  User,
  MessageSquare,
  Package,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminReport, ReportStatus } from "@/types/report";
import { PerDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const typeMap = {
  product: {
    label: "محصول",
    color: "bg-purple-100 text-purple-700",
    icon: Package,
  },
  comment: {
    label: "کامنت",
    color: "bg-teal-100 text-teal-700",
    icon: MessageSquare,
  },
  user: {
    label: "کاربر",
    color: "bg-red-100 text-red-700",
    icon: User,
  },
} as const;

const statusMap: Record<
  ReportStatus,
  { label: string; color: string; dot: string }
> = {
  new: {
    label: "جدید",
    color: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
  },
  reviewing: {
    label: "درحال بررسی",
    color: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  closed: {
    label: "بسته شده",
    color: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
};

const reportStatuses: ReportStatus[] = ["new", "reviewing", "closed"];

type Props = {
  report: AdminReport;
  onView: (report: AdminReport) => void;
  onChangeStatus: (id: string, report: ReportStatus) => void;
  onDelete: (id: string) => void;
  selected: boolean;
};

export default function ReportCard({
  report,
  onView,
  onChangeStatus,
  onDelete,
  selected,
}: Props) {
  const Icon = typeMap[report.type].icon;

  return (
    <div
      className={[
        "flex flex-col gap-4 rounded-lg border bg-card px-4 py-3 transition hover:bg-muted/40",
        "sm:flex-row sm:items-center sm:justify-between",
        selected ? "ring-2 ring-primary/30" : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>

            <span className="font-medium truncate">{report.reason}</span>

            <Badge className={typeMap[report.type].color}>
              {typeMap[report.type].label}
            </Badge>

            <Badge
              variant="secondary"
              className={statusMap[report.status].color}
            >
              {statusMap[report.status].label}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground truncate">
            {report.reporter?.name ?? "—"} • {PerDate(report.created_at)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() => onView(report)}
        >
          <Eye className="w-4 h-4" />
          مشاهده
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900/40 dark:hover:bg-blue-900/20"
            >
              <RefreshCw className="w-4 h-4" />
              تغییر وضعیت
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="min-w-[150px]">
            {reportStatuses.map((status) => {
              const isCurrent = status === report.status;

              return (
                <DropdownMenuItem
                  key={status}
                  disabled={isCurrent}
                  onClick={() => onChangeStatus(report.id, status)}
                  className="flex items-center justify-end gap-3"
                >
                  {isCurrent && <Check className="w-4 h-4 text-green-600" />}
                  <div className="flex items-center gap-2">
                    <span>{statusMap[status].label}</span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${statusMap[status].dot}`}
                    />
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          size="sm"
          variant="outline"
          className="gap-1 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
          onClick={() => onDelete(report.id)}
        >
          <Trash2 className="w-4 h-4" />
          حذف
        </Button>
      </div>
    </div>
  );
}
