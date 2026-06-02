"use client";

import { Users, Video, ShoppingBag, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "کاربر فعال",
    value: "۱۲,۴۸۰+",
    icon: Users,
  },
  {
    label: "استریم برگزار شده",
    value: "۳,۲۰۰+",
    icon: Video,
  },
  {
    label: "خرید موفق",
    value: "۹,۸۵۰+",
    icon: ShoppingBag,
  },
  {
    label: "افزایش فروش فروشنده‌ها",
    value: "۳.۴×",
    icon: TrendingUp,
  },
];

export default function StatsSection() {
  return (
    <section className="py-14 bg-card border-y">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>

                <div className="text-xl sm:text-2xl font-bold">
                  {item.value}
                </div>

                <div className="text-xs sm:text-sm opacity-70">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
