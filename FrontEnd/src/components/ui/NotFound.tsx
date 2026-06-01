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
    <div className="flex min-h-[70vh] w-full items-center justify-center px-6 py-10">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border bg-background">
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
  );
}
