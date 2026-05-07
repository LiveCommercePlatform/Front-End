"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { RatingData } from "@/types";


type ProductRatingProps = {
  rating: RatingData;
  onRate?: (value: number) => Promise<void> | void;
  isSubmitting?: boolean;
  className?: string;
};

const DEFAULT_BREAKDOWN = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
};

export default function ProductRating({
  rating,
  onRate,
  isSubmitting = false,
  className,
}: ProductRatingProps) {
  const mergedBreakdown = {
    ...DEFAULT_BREAKDOWN,
    ...(rating?.breakdown ?? {}),
  };

  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(
    rating?.user_rating ?? null
  );

  const displayValue = hovered ?? selected ?? 0;

  const rows = useMemo(() => {
    return [5, 4, 3, 2, 1].map((star) => {
      const count = Number(mergedBreakdown[String(star)] ?? mergedBreakdown[star as keyof typeof mergedBreakdown] ?? 0);
      const percent =
        rating?.rating_count > 0 ? (count / rating.rating_count) * 100 : 0;

      return {
        star,
        count,
        percent,
      };
    });
  }, [mergedBreakdown, rating?.rating_count]);

  const handleRate = async (value: number) => {
    if (isSubmitting) return;
    setSelected(value);
    await onRate?.(value);
  };

  return (
    <div
      className={cn("space-y-5",
        className
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#00bfa6]/10 text-[#008f7d]">
            <span className="text-3xl font-extrabold">
              {Number(rating?.rating_avg ?? 0).toFixed(1)}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const active = i < Math.round(rating?.rating_avg ?? 0);
                return (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      active
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    )}
                  />
                );
              })}
            </div>

            <p className="text-sm font-medium text-slate-800">
              امتیاز کاربران
            </p>
            <p className="text-xs text-slate-500">
              بر اساس {rating?.rating_count ?? 0} رأی ثبت‌شده
            </p>
          </div>
        </div>

        {/* user action */}
      
      </div>

      {/* breakdown */}
      <div className="space-y-3">
        {rows.map(({ star, count, percent }) => (
          <div key={star} className="flex items-center gap-3">
            <div className="flex w-12 items-center justify-end gap-1 text-sm font-medium text-slate-700">
              <span>{star}</span>
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </div>

            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#00bfa6] transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="w-10 text-left text-xs font-medium text-slate-500">
              {count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
