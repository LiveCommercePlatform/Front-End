"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Loading from "@/components/ui/Loading";
import NotFound from "@/components/ui/NotFound";
import { apiFetch } from "@/lib/api";
import { Calendar, Eye, PlayCircle, Radio, ShoppingBag } from "lucide-react";

type LiveRoom = {
  id: string;
  title?: string;
  name?: string;
  status?: "scheduled" | "live" | "ended" | string;
  roomId?: string;
  viewerCount?: number; // بعضی APIها اینو دارن
  totalViews?: number; // بعضی APIها اینو دارن
  startedAt?: string;
  isRecorded?: boolean;
  products?: any[];
};

function normalizeStatus(s?: string) {
  if (!s) return "unknown";
  const v = s.toLowerCase();
  if (v === "scheduled" || v === "live" || v === "ended") return v;
  return v;
}

export default function ProfileLivesPage() {
  const params = useParams();
  const id = String(params.id ?? "");

  const [items, setItems] = useState<LiveRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // جلوگیری از دوبار fetch در dev/StrictMode (و جلوگیری از دوبار setParams یا ...)
  const didFetchRef = useRef(false);

  const fetchLives = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const res = await apiFetch(
        `/live-rooms?host_id=${encodeURIComponent(id)}`,
        { method: "GET" },
      );

      const data = res.ok ? await res.json() : null;

      setItems(data);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    if (process.env.NODE_ENV === "development") {
      if (didFetchRef.current) return;
      didFetchRef.current = true;
    }
    void fetchLives();
  }, [id]);

  const lives = useMemo(() => {
    return (items ?? []).map((l: any) => ({
      id: String(l.id ?? l.ID ?? ""),
      title: l.title ?? l.Title,
      name: l.name ?? l.Name,
      status: normalizeStatus(l.status ?? l.Status),
      viewerCount: l.viewerCount ?? l.ViewerCount,
      totalViews: l.totalViews ?? l.TotalViews,
      startedAt: l.startedAt ?? l.StartedAt,
      isRecorded: l.isRecorded ?? l.IsRecorded,
      products: l.products ?? l.Products,
    })) as LiveRoom[];
  }, [items]);

  if (isLoading) return <Loading text="در حال بارگذاری لایوها..." />;

  if (!lives.length) {
    return <NotFound title="" message="لایوی برای نمایش وجود ندارد." />;
  }

  return (
    <div className="container max-w-7xl py-4 md:py-8 px-4 md:px-6 space-y-5 md:space-y-7">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {lives.map((live) => (
          <Link key={live.id} href={`/Live_Rooms/${live.id}`} className="group">
            <Card
              className="
                relative overflow-hidden
                bg-card/60 backdrop-blur-sm
                border border-border/80
                transition-all duration-300
                hover:border-primary/30
                hover:shadow-2xl hover:shadow-primary/5
                hover:-translate-y-1.5
                rounded-2xl py-0
              "
            >
              {/* کاور */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted rounded-t-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0,transparent_100%)]" />
                  <Radio className="w-10 h-10 text-primary/40 animate-pulse" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* badge وضعیت */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
                  {live.status === "live" && (
                    <span className="flex items-center gap-1.5 rounded-full bg-red-600/90 backdrop-blur-md px-2.5 py-1 text-[10px] md:text-xs font-bold text-white shadow-lg shadow-red-600/20">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping absolute" />
                      <span className="w-2 h-2 rounded-full bg-white relative" />
                      زنده
                    </span>
                  )}

                  {live.status === "scheduled" && (
                    <span className="flex items-center gap-1.5 rounded-full bg-amber-500/95 backdrop-blur-md px-2.5 py-1 text-[10px] md:text-xs font-bold text-white shadow-lg">
                      <Calendar className="w-3.5 h-3.5" />
                      به‌زودی
                    </span>
                  )}

                  {live.status === "ended" && (
                    <span className="flex items-center gap-1.5 rounded-full bg-slate-800/90 backdrop-blur-md px-2.5 py-1 text-[10px] md:text-xs font-bold text-slate-200 shadow-lg">
                      {live.isRecorded ? (
                        <>
                          <PlayCircle className="w-3.5 h-3.5 text-primary" />
                          ضبط شده
                        </>
                      ) : (
                        "پایان یافته"
                      )}
                    </span>
                  )}
                </div>

                {/* پایین کاور */}
                <div className="absolute bottom-3 right-3 left-3 z-10 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] md:text-xs text-white border border-white/10">
                    <Eye className="w-3.5 h-3.5 text-white/80" />
                    <span>
                      {(
                        live.totalViews ??
                        live.viewerCount ??
                        0
                      ).toLocaleString("fa-IR")}{" "}
                      بازدید
                    </span>
                  </div>

                  {!!live.products?.length && (
                    <div className="flex items-center gap-1 rounded-full bg-primary/90 backdrop-blur-sm px-2 py-1 text-[10px] md:text-xs text-white font-medium">
                      <ShoppingBag className="w-3 h-3" />
                      <span>{live.products.length} کالا</span>
                    </div>
                  )}
                </div>
              </div>

              {/* محتوا */}
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* فقط قیافه: آواتار + یک متن ثابت (بدون لینک پروفایل) */}
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      {live.status === "scheduled" && live.startedAt && (
                        <div className="mt-1">
                          <span className="inline-flex text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            {new Date(live.startedAt).toLocaleDateString(
                              "fa-IR",
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <h2
                    className="
                      font-bold text-sm md:text-base leading-snug
                      line-clamp-2
                      text-foreground/90
                      group-hover:text-primary transition-colors duration-200
                      min-h-[2.75rem] md:min-h-[3rem]
                    "
                  >
                    {live.title ?? live.name ?? "لایو بدون عنوان"}
                  </h2>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
