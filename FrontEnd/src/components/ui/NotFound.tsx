import React from "react";
import { SearchX } from "lucide-react";

export default function NotFound({
  title = "موردی یافت نشد",
  message = "متأسفانه اطلاعاتی برای نمایش وجود ندارد.",
  action,
}: {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="w-full px-6 py-10">
      <div className="mx-auto max-w-lg">
        <div className="relative overflow-hidden rounded-2xl border bg-card p-8 text-center shadow-sm">
          {/* subtle background decoration */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-10 h-56 w-56 rounded-full bg-muted/40 blur-3xl" />

          {/* icon badge */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border bg-background shadow-sm">
            <SearchX className="h-8 w-8 text-primary" />
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {message}
          </p>

          {action && (
            <div className="mt-7 flex items-center justify-center gap-3">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
