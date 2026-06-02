export default function TabSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <div className="h-12 rounded-xl bg-slate-200 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-72 rounded-2xl bg-slate-200 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

