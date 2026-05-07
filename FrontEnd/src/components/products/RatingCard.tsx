import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type RatingCardProps = {
  my_rating: number; // ورودی اولیه از API
  onRate: (value: number) => Promise<void>; // POST
  onDelete: () => Promise<void>; // DELETE
};

export default function RatingCard({ my_rating, onRate, onDelete }: RatingCardProps) {
  const [value, setValue] = useState(my_rating);
  const [hover, setHover] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const display = hover ?? value;

  async function handleSelect(val: number) {
    if (loading) return;
    setLoading(true);

    try {
      if (value === val) {
      } else {
        if (value > 0) await onDelete();
        await onRate(val);
        setValue(val);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full md:w-auto md:min-w-[260px]">
      <div className="rounded-2xl border border-[#00bfa6]/15 bg-[#00bfa6]/5 p-4">

        {/* عنوان */}
        <p className="mb-3 text-sm font-semibold text-slate-800 text-right">امتیاز شما</p>

        {/* ستاره‌ها */}
        <div
          className="flex items-center gap-1 justify-center"
          onMouseLeave={() => setHover(null)}
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const v = i + 1;

            return (
              <button
                key={v}
                type="button"
                disabled={loading}
                onMouseEnter={() => setHover(v)}
                onClick={() => handleSelect(v)}
                className={cn(
                  "rounded-full p-1 transition-transform duration-150",
                  "hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
                )}
                aria-label={`امتیاز ${v} از 5`}
              >
                <Star
                  className={cn(
                    "h-7 w-7 transition-colors",
                    display >= v
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* متن زیر */}
        <p className="mt-3 text-xs text-slate-500 text-center">
          {value > 0
            ? `شما ${value} ستاره ثبت کرده‌اید`
            : "برای ثبت امتیاز، روی ستاره‌ها بزنید"}
        </p>
      </div>
    </div>
  );
}
