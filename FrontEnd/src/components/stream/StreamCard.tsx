"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Pencil,
  Trash2,
  CalendarClock,
  Radio,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  Video,
  VideoOff,
} from "lucide-react";
import type { Stream, StreamStatus } from "@/types/stream";
import DeleteDialog from "../ui/DeleteDialog";

function statusLabel(s: StreamStatus) {
  switch (s) {
    case "scheduled":
      return "زمان‌بندی";
    case "live":
      return "درحال پخش";
    case "ended":
      return "پایان‌یافته";
  }
}

function statusClasses(s: StreamStatus) {
  switch (s) {
    case "scheduled":
      return "bg-amber-100 text-amber-700";
    case "live":
      return "bg-emerald-100 text-emerald-700";
    case "ended":
      return "bg-slate-100 text-slate-700";
  }
}

function StatusIcon({ status }: { status: StreamStatus }) {
  const cls = "w-4 h-4";
  if (status === "scheduled") return <CalendarClock className={cls} />;
  if (status === "live") return <Radio className={cls} />;
  if (status === "ended") return <CheckCircle2 className={cls} />;
  return <XCircle className={cls} />;
}

export default function StreamCard({
  stream,
  onView,
  onEdit,
  onDelete,
  onStart,
  onEnd,
  className,
}: {
  stream: Stream;
  onView: (s: Stream) => void;
  onEdit: (s: Stream) => void;
  onDelete: (s: Stream) => void;
  onStart: (s: Stream) => void;
  onEnd: (s: Stream) => void;
  className?: string;
}) {
  const meta = useMemo(() => {
    const when = stream.Status === "live" ? stream.StartedAt : stream.EndedAt;
    return when ? new Date(when).toLocaleDateString("fa-IR") : "نامشحص";
  }, [stream]);

  return (
    <div
      className={clsx(
        "rounded-2xl border bg-card/95 backdrop-blur p-4",
        "hover:shadow-sm transition cursor-pointer",
        className,
      )}
      onClick={() => onView(stream)}
      role="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 justify-start">
            <h3 className="font-semibold text-sm sm:text-base line-clamp-1 ">
              {stream.Title}
            </h3>

            <Badge
              className={clsx("gap-1", statusClasses(stream.Status))}
              variant="secondary"
            >
              <StatusIcon status={stream.Status} />
              {statusLabel(stream.Status)}
            </Badge>
            <Badge
              className={clsx(
                "flex items-center gap-1 px-2 py-1 text-xs font-medium",
                stream.IsRecorded
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
              )}
            >
              {stream.IsRecorded ? (
                <>
                  <Video className="w-3.5 h-3.5" />
                  ضبط می‌شود
                </>
              ) : (
                <>
                  <VideoOff className="w-3.5 h-3.5" />
                  ضبط نمی‌شود
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 text-right">
        <div className="rounded-xl border p-2">
          <div className="text-[11px] opacity-60">تاریخ</div>
          <div className="text-xs font-semibold mt-1 text-left">{meta}</div>
        </div>
        <div className="rounded-xl border p-2">
          <div className="text-[11px] opacity-60">بیننده</div>
          <div className="text-xs font-semibold mt-1 text-left">
            {stream.TotalViews?.toLocaleString("fa-IR")}
          </div>
        </div>
        <div className="rounded-xl border p-2">
          <div className="text-[11px] opacity-60">لایک</div>
          <div className="text-xs font-semibold mt-1 text-left">
            {stream.TotalLikes?.toLocaleString("fa-IR")}
          </div>
        </div>
        <div className="rounded-xl border p-2">
          <div className="text-[11px] opacity-60">دیس لایک</div>
          <div className="text-xs font-semibold mt-1 text-left">
            {stream.TotalDislikes?.toLocaleString("fa-IR")}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={() => onView(stream)}
          >
            <Eye className="w-4 h-4" />
            مشاهده
          </Button>
        </div>

        <div className="flex gap-2" onClick={(e)=>e.stopPropagation()}>
          {stream.Status == "scheduled" && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-2 text-green-600"
              onClick={() => {
                onStart(stream);
              }}
            >
              <Play className="w-4 h-4" />
              شروع
            </Button>
          )}
          {stream.Status == "live" && (
            <DeleteDialog
              title="اتمام لایو استریم"
              description=" آیا از اتمام این استریم مطمئن هستید؟ این عملیات غیرقابل بازگشت است."
              buttonText = "اتمام لایو"
              onConfirm={() => {
                onEnd(stream);
             }}
              trigger={
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-2 text-red-600"
                >
                  <Pause className="w-4 h-4" />
                  پایان
                </Button>
              }
            />
          )}
          <Button
            size="sm"
            variant="ghost"
            className="gap-2 text-yellow-600"
            onClick={() => {
              onEdit(stream);
            }}
          >
            <Pencil className="w-4 h-4" />
            ویرایش
          </Button>
          <div>
            <DeleteDialog
              onConfirm={() => onDelete(stream)}
              trigger={
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-2 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
