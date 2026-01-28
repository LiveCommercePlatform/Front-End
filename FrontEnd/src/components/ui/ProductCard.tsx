"use client";

import { toPersianDigits } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";

export type ProductCardStatus = "active" | "inactive";

export type ProductCardProps = {
  title: string;
  price: number;
  status: ProductCardStatus;
  cover?: string;
  showEdit?: boolean;
  showDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
};

export default function ProductCard({
  title,
  price,
  status,
  cover,
  showEdit = true,
  showDelete = true,
  onEdit,
  onDelete,
  className,
}: ProductCardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border bg-card overflow-hidden flex flex-col transition hover:shadow-md",
        className
      )}
    >
      {/* Cover */}
      <div className="h-32 bg-muted overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm opacity-60">
            بدون تصویر
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm leading-snug line-clamp-2">
              {title}
            </h4>

            <Badge
              variant="secondary"
              className={
                status === "active"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                  : ""
              }
            >
              {status === "active" ? "فعال" : "غیرفعال"}
            </Badge>
          </div>

          <p className="text-sm opacity-70">
            قیمت: {toPersianDigits(price)} تومان
          </p>
        </div>

        {(showEdit || showDelete) && (
          <div className="flex items-center justify-between mt-4">
            {showEdit ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-yellow-600"
                onClick={onEdit}
              >
                <Pencil className="w-4 h-4" />
                ویرایش
              </Button>
            ) : (
              <span />
            )}

            {showDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-red-600"
                onClick={onDelete}
              >
                <Trash2 className="w-4 h-4" />
                حذف
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
