"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useLiveRooms } from "@/context/LiveRoomContext";
import { StreamStatus } from "@/types";
import Loading from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ListToolbar from "@/components/ui/ListToolbar";

export default function LivesPage() {
  const { lives, fetchLiveRooms, loading } = useLiveRooms();
  const [status, setStatus] = useState<StreamStatus | "all">("all");

  useEffect(() => {
    fetchLiveRooms({
      status: status == "all" ? undefined : status,
    });
  }, [status]);

  if (loading) {
    return <Loading text="کمی صبر کنید، در حال بارگذاری لایو ها . . ." />;
  }

  return (
    <div className="container py-8 px-5 space-y-6">
      <h1 className="text-2xl font-bold text-primary">لایوهای</h1>
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
      {lives.length === 0 && (
        <p className="text-muted-foreground">در حال حاضر لایوی فعال نیست.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {lives.map((live) => (
          <Link key={live.ID} href={`/Live_Rooms/${live.ID}`}>
            <Card className="cursor-pointer overflow-hidden bg-card border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <div className="relative aspect-video w-full overflow-hidden">
                {/* Thumbnail */}
                <div className="w-full h-full bg-muted animate-pulse"></div>

                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition duration-300"></div>

                {live.Status == "live" && <span className="absolute top-0 right-5 bg-red-600 text-white text-xs px-2 py-1 rounded-md shadow-md">
                  زنده
                </span>}
                

                <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1">
                  <span>{live.TotalViews}</span>
                  <span>👁</span>
                </div>
              </div>

              <CardContent className="p-4 flex items-start gap-3">
                <img
                  src="/user.svg"
                  className="w-10 h-10 rounded-full object-cover border"
                  alt="host avatar"
                />

                <div className="space-y-1">
                  <p className="font-semibold leading-tight">{live.Title}</p>
                  <p className="text-sm text-muted-foreground">
                    {live.Host.name}vhbjklda;d
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
