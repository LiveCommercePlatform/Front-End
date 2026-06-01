"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatPriceFa } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { tokenStore } from "@/lib/token";

type ReportType = "product" | "comment" | "user";

type ReportCreateModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  type: ReportType;
  targetId: string | number;
  title?: string;
  pro_id?: string;
  onSubmitted?: () => void;
};

export default function ReportCreateModal({
  open,
  onOpenChange,
  type,
  targetId,
  title = "ثبت گزارش",
  pro_id,
  onSubmitted,
}: ReportCreateModalProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const canSubmit = reason.trim().length >= 3 && !loading;

  async function handleSubmit() {
    try {
      const access = tokenStore.getAccess?.();
      if (!access) {
        toast("برای ثبت گزارش، اول وارد شوید.");
        return;
      }
      setLoading(true);

      const basePayload: any = {
        type,
        reason: reason.trim(),
        description: details.trim() || undefined,
        product_id: null,
        target_user_id: null,
        comment_id: null,
      };

      if (type === "product") {
        basePayload.product_id = targetId;
      } else if (type === "comment") {
        basePayload.comment_id =
          typeof targetId === "string" ? Number(targetId) : targetId;
        basePayload.product_id = pro_id ? pro_id : null;
      } else if (type === "user") {
        basePayload.target_user_id = targetId;
      }

      const res = await apiFetch("/reports", {
        method: "POST",
        body: JSON.stringify(basePayload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "خطا در ثبت گزارش");
      }

      toast.success("گزارش ثبت شد");
      setReason("");
      setDetails("");
      onOpenChange(false);
      onSubmitted?.();
    } catch (e: any) {
      toast.error(e?.message || "خطا");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[520px] overflow-x-hidden break-words">
        <DialogHeader className="text-right">
          <DialogTitle className="text-right">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <div className="text-sm font-medium text-right">علت گزارش</div>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              maxLength={200}
              placeholder="مثلاً: محتوای نامناسب، کلاهبرداری، اطلاعات غلط، اسپم..."
              className="text-right"
            />
            <div className="text-xs text-muted-foreground text-left">
              {formatPriceFa(reason.trim().length)}/۲۰۰
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-right">
              توضیحات (اختیاری)
            </div>
            <Textarea
              dir="rtl"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="اگر لازم می‌دونی توضیح بیشتری بده..."
              className="w-full max-w-full min-w-0 resize-none text-right whitespace-pre-wrap break-words [overflow-wrap:anywhere] overflow-x-hidden box-border"
            />

            <div className="text-xs text-muted-foreground text-left">
              {formatPriceFa(details.trim().length)}/۱۰۰۰
            </div>
          </div>
        </div>

        <DialogFooter className={cn("gap-2", "sm:justify-start")}>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            بستن
          </Button>

          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {loading ? "در حال ارسال..." : "ثبت گزارش"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
