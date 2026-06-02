"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useLiveRooms } from "@/context/LiveRoomContext";
import { StreamStatus } from "@/types";
import Loading from "@/components/ui/Loading";
import ListToolbar from "@/components/ui/ListToolbar";
import { Calendar, Eye, PlayCircle, Radio, ShoppingBag } from "lucide-react";
import NotFound from "@/components/ui/NotFound";

export default function LivesPage() {
  const router = useRouter();
  const { lives, setParams, loading } = useLiveRooms();
  const [status, setStatus] = useState<StreamStatus | "all">("all");

  useEffect(() => {
    void setParams({
      status: status === "all" ? undefined : status,
    });
  }, [status, setParams]);

  const goToHostProfile = (
    e: React.MouseEvent,
    hostId?: String,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hostId) return;
    router.push(`/profile/${hostId}`);
  };

  if (loading) {
    return <Loading text="کمی صبر کنید، در حال بارگذاری لایو ها . . ." />;
  }

  return (
    <div className="container max-w-7xl py-4 md:py-8 px-4 md:px-6 space-y-5 md:space-y-7">
      <div className="overflow-x-auto pb-1">
        <ListToolbar
          filters={[
            {
              key: "status",
              value: status,
              onChange: setStatus,
              options: [
                { label: "همه وضعیت‌ها", value: "all" },
                { label: "در آینده", value: "scheduled" },
                { label: "درحال پخش", value: "live" },
                { label: "پایان‌یافته", value: "ended" },
              ],
            },
          ]}
        />
      </div>

      {lives.length === 0 && (
        <NotFound
          title=""
          message="متاسفانه لایو استریمی برای مشاهده موجود نیست."
        />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 ">
        {lives.map((live) => (
          <Link key={live.ID} href={`/Live_Rooms/${live.ID}`} className="group">
            <Card
              className="
                relative
                overflow-hidden
                bg-card/60
                backdrop-blur-sm
                border
                border-border/80
                transition-all
                duration-300
                hover:border-primary/30
                hover:shadow-2xl
                hover:shadow-primary/5
                hover:-translate-y-1.5
                rounded-2xl
                py-0
              "
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted rounded-t-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0,transparent_100%)]" />
                  <Radio className="w-10 h-10 text-primary/40 animate-pulse" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
                  {live.Status === "live" && (
                    <span className="flex items-center gap-1.5 rounded-full bg-red-600/90 backdrop-blur-md px-2.5 py-1 text-[10px] md:text-xs font-bold text-white shadow-lg shadow-red-600/20">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping absolute" />
                      <span className="w-2 h-2 rounded-full bg-white relative" />
                      زنده
                    </span>
                  )}

                  {live.Status === "scheduled" && (
                    <span className="flex items-center gap-1.5 rounded-full bg-amber-500/95 backdrop-blur-md px-2.5 py-1 text-[10px] md:text-xs font-bold text-white shadow-lg">
                      <Calendar className="w-3.5 h-3.5" />
                      به‌زودی
                    </span>
                  )}

                  {live.Status === "ended" && (
                    <span className="flex items-center gap-1.5 rounded-full bg-slate-800/90 backdrop-blur-md px-2.5 py-1 text-[10px] md:text-xs font-bold text-slate-200 shadow-lg">
                      {live.IsRecorded ? (
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

                <div className="absolute bottom-3 right-3 left-3 z-10 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] md:text-xs text-white border border-white/10">
                    <Eye className="w-3.5 h-3.5 text-white/80" />
                    <span>{live.TotalViews?.toLocaleString("fa-IR")} بازدید</span>
                  </div>

                  {live.Products && live.Products.length > 0 && (
                    <div className="flex items-center gap-1 rounded-full bg-primary/90 backdrop-blur-sm px-2 py-1 text-[10px] md:text-xs text-white font-medium">
                      <ShoppingBag className="w-3 h-3" />
                      <span>{live.Products.length} کالا</span>
                    </div>
                  )}
                </div>
              </div>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => goToHostProfile(e, live.Host?.id)}
                      className="relative shrink-0"
                    >
                      <img
                        src="/user.svg"
                        className={`
                          w-10 h-10
                          md:w-11 md:h-11
                          rounded-full
                          object-cover
                          border-2
                          transition-all
                          duration-300
                          hover:scale-105
                          ${
                            live.Status === "live"
                              ? "border-red-500 ring-2 ring-red-500/30 ring-offset-2 ring-offset-background animate-pulse"
                              : "border-border"
                          }
                        `}
                        alt={live.Host?.name || "host avatar"}
                      />
                      {live.Status === "live" && (
                        <span className="absolute -bottom-1 -left-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white border border-background">
                          ●
                        </span>
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={(e) => goToHostProfile(e, live.Host?.id)}
                        className="max-w-full truncate text-sm md:text-base font-semibold text-foreground/90 hover:text-primary transition-colors"
                      >
                        {live.Host?.name || "برگزارکننده"}
                      </button>

                      {live.Status === "scheduled" && live.StartedAt && (
                        <div className="mt-1">
                          <span className="inline-flex text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            {new Date(live.StartedAt).toLocaleDateString("fa-IR")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* عنوان لایو */}
                  <h2
                    className="
                      font-bold
                      text-sm
                      md:text-base
                      leading-snug
                      line-clamp-2
                      text-foreground/90
                      group-hover:text-primary
                      transition-colors
                      duration-200
                      min-h-[2.75rem] md:min-h-[3rem]
                    "
                  >
                    {live.Title}
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
