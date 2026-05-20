"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useLiveRooms } from "@/context/LiveRoomContext";
import { StreamStatus } from "@/types";
import Loading from "@/components/ui/Loading";
import ListToolbar from "@/components/ui/ListToolbar";
import { Eye } from "lucide-react";
import NotFound from "@/components/ui/NotFound";

export default function LivesPage() {
  const { lives, fetchLiveRooms, loading } = useLiveRooms();
  const [status, setStatus] = useState<StreamStatus | "all">("all");

  useEffect(() => {
    fetchLiveRooms({
      status: status === "all" ? undefined : status,
    });
  }, [status]);

  if (loading) {
    return <Loading text="کمی صبر کنید، در حال بارگذاری لایو ها . . ." />;
  }

  return (
    <div className="container max-w-7xl py-4 md:py-8 px-4 md:px-6 space-y-5 md:space-y-7">

      {/* Header */}
      {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="space-y-1">
          <h1 className="text-xl md:text-3xl font-black text-primary">
            لایوها
          </h1>

          <p className="text-sm text-muted-foreground">
            مشاهده و دنبال کردن پخش‌های زنده
          </p>
        </div>

      </div> */}

      {/* Toolbar */}
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
        <NotFound title="" message="متاسفانه لایو استریمی برای مشاهده موجود نیست."/>
      )}

      {/* Grid */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-3
          gap-4
          md:gap-6
        "
      >
        {lives.map((live) => (
          <Link
            key={live.ID}
            href={`/Live_Rooms/${live.ID}`}
            className="group"
          >
            <Card
              className="
                overflow-hidden
                bg-card
                border
                border-border
                transition-all
                duration-300
                hover:border-primary/40
                hover:shadow-xl
                hover:-translate-y-1
              "
            >
              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted">

                {/* Placeholder */}
                <div className="w-full h-full animate-pulse bg-muted" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300" />

                {/* LIVE Badge */}
                {live.Status === "live" && (
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-[10px] md:text-xs font-bold text-white shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      زنده
                    </span>
                  </div>
                )}

                {/* Scheduled Badge */}
                {live.Status === "scheduled" && (
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[10px] md:text-xs font-bold text-white shadow-lg">
                      به‌زودی
                    </span>
                  </div>
                )}

                {/* Ended Badge */}
                {live.Status === "ended" && (
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] md:text-xs font-bold text-secondary-foreground shadow-lg">
                      پایان یافته
                    </span>
                  </div>
                )}

                {/* Views */}
                <div
                  className="
                    absolute
                    bottom-3
                    left-3
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-black/60
                    backdrop-blur-md
                    px-2.5
                    py-1
                    text-[10px]
                    md:text-xs
                    text-white
                  "
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{live.TotalViews}</span>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-3 md:p-4">
                <div className="flex items-start gap-3">

                  {/* Avatar */}
                  <img
                    src="/user.svg"
                    className="
                      w-10 h-10
                      md:w-11 md:h-11
                      rounded-full
                      object-cover
                      border
                      border-border
                      shrink-0
                    "
                    alt="host avatar"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">

                    <h2
                      className="
                        font-bold
                        text-sm
                        md:text-base
                        leading-snug
                        line-clamp-2
                        group-hover:text-primary
                        transition-colors
                      "
                    >
                      {live.Title}
                    </h2>

                    <p
                      className="
                        text-xs
                        md:text-sm
                        text-muted-foreground
                        truncate
                      "
                    >
                      {live.Host.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
