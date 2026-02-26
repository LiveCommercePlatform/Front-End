"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Report } from "@/types/report";
import { Ban, Trash2, CheckCircle, ExternalLink } from "lucide-react";

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
  report: Report | null;
  open: boolean;
  onClose: () => void;
  onCloseReport: (id: number) => void;
  onDeleteTarget: (id: number) => void;
  onBanUser: (id: number) => void;
};

export default function ReportDetailsModal({
  report,
  open,
  onClose,
  onCloseReport,
  onDeleteTarget,
  onBanUser,
}: Props) {
  if (!report) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg text-right">
        <AlertDialogHeader>
          <AlertDialogTitle>جزئیات گزارش</AlertDialogTitle>
          <AlertDialogDescription className="text-right space-y-4">
            {/* Meta */}
            <div className="flex gap-2 flex-wrap">
              <Badge className={typeMap[report.type].color}>
                {typeMap[report.type].label}
              </Badge>
              <Badge className={statusMap[report.status].color}>
                {statusMap[report.status].label}
              </Badge>
            </div>

            {/* Info */}
            <div className="space-y-2 text-sm">
              <div>
                <span className="opacity-60">گزارش‌دهنده:</span>{" "}
                <span className="font-medium">{report.reporter}</span>
              </div>

              <div>
                <span className="opacity-60">تاریخ:</span>{" "}
                <span>{report.createdAt}</span>
              </div>
            </div>

            {/* Reason */}
            <div className="rounded-lg border bg-muted/40 p-3 text-sm leading-relaxed">
              {report.reason}
            </div>

            {/* View target */}
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => console.log("open target")}
            >
              <ExternalLink className="w-4 h-4" />
              مشاهده محتوای گزارش‌شده
            </Button>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Actions */}
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="destructive"
            className="gap-2"
            onClick={() => {
              onDeleteTarget(report.id);
              onClose();
            }}
          >
            <Trash2 className="w-4 h-4" />
            حذف محتوا
          </Button>

          <Button
            variant="outline"
            className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => onBanUser(report.id)}
          >
            <Ban className="w-4 h-4" />
            بن کاربر
          </Button>

          <Button className="gap-2" onClick={() => onCloseReport(report.id)}>
            <CheckCircle className="w-4 h-4" />
            بستن گزارش
          </Button>

          <AlertDialogCancel>بستن</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
