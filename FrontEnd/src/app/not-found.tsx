"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center justify-center">
        <section className="w-full text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Ghost className="h-10 w-10 text-muted-foreground" />
          </div>

          <p className="mb-2 text-xs sm:text-sm font-semibold tracking-[0.3em]">
          ERROR 404
          </p>

          <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          صفحه ناموجود
          </h1>

          <p className="mx-auto mb-8 max-w-md text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            متأسفیم، صفحه‌ای که دنبالش بودید پیدا نشد. ممکنه حذف شده باشه یا آدرس
          اشتباهی وارد کرده باشید.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button size="lg">بازگشت به صفحه اصلی</Button>
          </Link>

          <Button
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
          >
            صفحه قبل
          </Button>
        </div>
        </section>
      </div>
    </main>
  );
}
