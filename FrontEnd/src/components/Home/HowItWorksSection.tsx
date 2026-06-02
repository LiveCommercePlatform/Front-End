"use client";

import { formatPriceFa } from "@/lib/utils";
import { PlayCircle, MessageCircle, CreditCard } from "lucide-react";

const steps = [
  {
    title: "وارد لایو شو",
    desc: "استریم فروشنده رو به‌صورت زنده ببین",
    icon: PlayCircle,
  },
  {
    title: "سوال بپرس و تعامل کن",
    desc: "توی چت سوال بپرس و محصول رو دقیق بررسی کن",
    icon: MessageCircle,
  },
  {
    title: "همون لحظه خرید کن",
    desc: "بدون خروج از لایو، سریع و امن پرداخت کن",
    icon: CreditCard,
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
            خرید زنده چطور کار می‌کنه؟
          </h2>
          <p className="text-sm opacity-70">
            فقط در ۳ قدم ساده
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="relative p-6 rounded-2xl border bg-card hover:shadow-md transition"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="font-semibold mb-2">
                  {step.title}
                </h3>

                <p className="text-sm opacity-70">
                  {step.desc}
                </p>

                <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  {formatPriceFa(i + 1)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
