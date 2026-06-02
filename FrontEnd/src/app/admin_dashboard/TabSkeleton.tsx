export default function TabSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {/* جای سرچ/فیلتر بالا */}
      <div className="h-10 w-full rounded-xl bg-slate-200/70 animate-pulse" />

      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-2"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse shrink-0" />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
                  <div className="h-5 w-14 rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-4 w-10 rounded bg-slate-200 animate-pulse" />
                </div>

                <div className="mt-2 h-3 w-56 max-w-[70%] rounded bg-slate-200 animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {Array.from({ length: 4 }).map((__, j) => (
                <div
                  key={j}
                  className="h-9 w-9 rounded-md bg-slate-200 animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
