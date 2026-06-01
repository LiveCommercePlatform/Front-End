"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center justify-center">
        <section className="w-full text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>

          <p className="mb-2 text-xs sm:text-sm font-semibold tracking-[0.3em] text-destructive">
            ERROR 403
          </p>

          <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            دسترسی غیرمجاز
          </h1>

          <p className="mx-auto mb-8 max-w-md text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            شما به این صفحه دسترسی ندارین. لطفاً اگر فکر می‌کنید اشتباهی رخ داده
            با پشتیبانی تماس بگیرید.
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-red-600 text-white hover:bg-red-700 sm:w-auto"
              >
                بازگشت به صفحه اصلی
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              بازگشت
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
