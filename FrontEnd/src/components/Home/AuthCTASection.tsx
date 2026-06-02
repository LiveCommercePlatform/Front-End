"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, Users } from "lucide-react";

type Props = {
  page?: "home" | "product" | "comment" | "general";
  usersCount?: number;
};

const pageTextMap = {
  home: "برای استفاده از همه امکانات پلتفرم وارد حساب کاربری شوید.",
  product: "برای خرید و مدیریت محصولات، ابتدا وارد حساب شوید.",
  comment: "برای ثبت و مدیریت نظرات باید وارد حساب کاربری شوید.",
  general: "برای دسترسی کامل به امکانات وارد حساب شوید.",
};

export default function AuthCTASection({
  page = "general",
  usersCount = 234,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className=" m-5 relative overflow-hidden rounded-2xl border bg-card p-5 sm:p-8"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Text */}
        <div className="space-y-2 text-right">
          <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold">
            <Sparkles className="w-5 h-5 text-primary" />
            تجربه کامل فقط با ورود
          </h2>

          <p className="text-sm opacity-70 max-w-xl leading-relaxed">
            {pageTextMap[page]}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-2 text-xs sm:text-sm opacity-80 pt-1">
            <Users className="w-4 h-4 text-primary" />
            بیش از{" "}
            <span className="font-semibold text-primary">
              {usersCount.toLocaleString("fa-IR")}
            </span>{" "}
            کاربر فعال
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 shrink-0">
          <Button asChild className="gap-2">
            <Link href="/login">
              <Lock className="w-4 h-4" />
              ورود
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/register">ثبت‌نام</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
