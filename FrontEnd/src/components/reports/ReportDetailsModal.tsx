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
import { AdminReport } from "@/types/report";
import {
  Ban,
  Trash2,
  CheckCircle,
  ExternalLink,
  User,
  MessageSquare,
  Package,
} from "lucide-react";
import Link from "next/link";
import { PerDate } from "@/lib/utils";

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
  user: { label: "کاربر", color: "bg-red-100 text-red-700", icon: User },
} as const;

const statusMap = {
  new: { label: "جدید", color: "bg-orange-100 text-orange-700" },
  reviewing: { label: "درحال بررسی", color: "bg-blue-100 text-blue-700" },
  closed: { label: "بسته شده", color: "bg-green-100 text-green-700" },
} as const;

type Props = {
  report: AdminReport | null;
  open: boolean;
  onClose: () => void;
  onCloseReport: (reportId: string) => void;
  onDeleteTarget: (targetId: string, type: "product" | "comment") => void;
  onBanUser: (userId: string) => void;
};

function getViewLink(
  report: AdminReport,
): { href: string; label: string } | null {
  if (report.type === "user") {
    if (!report.target_user_id) return null;
    return {
      href: `/users/${report.target_user_id}`,
      label: "مشاهده مستقیم کاربر",
    };
  } else if (report.type === "product") {
    if (!report.product_id) return null;
    return {
      href: `/products/${report.product_id}`,
      label: "مشاهده مستقیم محصول",
    };
  } else {
    if (!report.product_id) return null;
    return {
      href: `/products/${report.product_id}?commentId=${report.comment_id}`,
      label: "مشاهده در صفحه محصول",
    };
  }
}

function getDeleteTarget(
  report: AdminReport,
): { id: string; type: "product" | "comment" } | null {
  if (report.type === "product") {
    if (!report.product_id) return null;
    return { id: report.product_id, type: "product" };
  }
  if (report.type === "comment") {
    if (!report.comment_id) return null;
    return { id: String(report.comment_id), type: "comment" };
  }
  return null;
}

export default function ReportDetailsModal({
  report,
  open,
  onClose,
  onCloseReport,
  onDeleteTarget,
  onBanUser,
}: Props) {
  if (!report) return null;

  const currentType = typeMap[report.type];
  const viewLink = getViewLink(report);
  const deleteTarget = getDeleteTarget(report);

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg text-right" dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <currentType.icon className="w-5 h-5 opacity-70" />
            جزئیات گزارش #{report.id}
          </AlertDialogTitle>
<div className="flex gap-2">
              <Badge variant="secondary" className={currentType.color}>
                {currentType.label}
              </Badge>
              <Badge
                variant="secondary"
                className={statusMap[report.status].color}
              >
                {statusMap[report.status].label}
              </Badge>
            </div>
          <AlertDialogDescription className="text-right space-y-4 pt-4 w-full">
          
              <div className="grid grid-cols-2 gap-4 text-center text-sm bg-muted/30 p-3 rounded-lg">
                <div>
                  <span className="block opacity-60 text-xs">گزارش‌دهنده:</span>
                  <span className="font-medium">
                    {report.reporter?.name || "کاربر ناشناس"}
                  </span>
                </div>
                <div>
                  <span className="block opacity-60 text-xs">تاریخ ثبت:</span>
                  <span className="font-medium" dir="ltr">
                    {PerDate(report.created_at)}
                  </span>
                </div>
              </div>
              {/* دلیل */}
              <div className="space-y-1">
                <span className="text-xs opacity-60">علت گزارش:</span>
                <div className="rounded-lg border border-orange-100 bg-orange-50/30 p-3 text-sm leading-relaxed text-foreground">
                  {report.reason}
                </div>
              </div>
              {/* مشاهده محتوا */}
              {viewLink && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 border-dashed"
                  asChild
                >
                  <Link href={viewLink.href}>
                    <ExternalLink className="w-4 h-4" />
                    {viewLink.label}
                  </Link>
                </Button>
              )}{" "}
            
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-6">
          <div className="flex flex-wrap gap-2 flex-1">
            {/* حذف محتوا */}
            {deleteTarget && (
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={() => {
                  onDeleteTarget(deleteTarget.id, deleteTarget.type);
                  onClose();
                }}
              >
                <Trash2 className="w-4 h-4" />
                حذف {currentType.label}
              </Button>
            )}

            {/* بن کاربر (فقط برای گزارش user) */}
            {report.type === "user" && report.target_user_id && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => onBanUser(report.target_user_id!)}
              >
                <Ban className="w-4 h-4" />
                مسدودسازی کاربر
              </Button>
            )}

            {/* بستن گزارش */}
            {report.status !== "closed" && (
              <Button
                variant="default"
                size="sm"
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={() => onCloseReport(report.id)}
              >
                <CheckCircle className="w-4 h-4" />
                تایید و اتمام
              </Button>
            )}
          </div>

          <AlertDialogCancel className="sm:mt-0">انصراف</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
