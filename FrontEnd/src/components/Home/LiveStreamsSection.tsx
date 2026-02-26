"use client";

import { PlayCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Stream = {
  id: number;
  title: string;
  streamer: string;
  viewers: number;
  cover: string;
  isLive: boolean;
};

const streams: Stream[] = [
  {
    id: 1,
    title: "فروش زنده آیفون 15",
    streamer: "Ali Store",
    viewers: 128,
    cover: "https://picsum.photos/600/400?1",
    isLive: true,
  },
  {
    id: 2,
    title: "بررسی کفش نایک",
    streamer: "Sport Land",
    viewers: 76,
    cover: "https://picsum.photos/600/400?2",
    isLive: true,
  },
  {
    id: 3,
    title: "گجت‌های هوشمند",
    streamer: "Tech World",
    viewers: 0,
    cover: "https://picsum.photos/600/400?3",
    isLive: false,
  },
];

export default function LiveStreamsSection() {
  return (
    <section className="py-16 sm:pt-0">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              🔴 استریم‌های زنده
            </h2>
            <p className="text-sm opacity-70 mt-1">
              همین الان وارد لایو شو و مستقیم خرید کن
            </p>
          </div>

          <Button variant="outline">مشاهده همه</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((stream) => (
            <div
              key={stream.id}
              className="group rounded-2xl overflow-hidden border bg-card hover:shadow-lg transition"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={stream.cover}
                  alt={stream.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />

                {stream.isLive ? (
                  <Badge className="absolute top-3 right-3 bg-red-600 text-white">
                    LIVE
                  </Badge>
                ) : (
                  <Badge className="absolute top-3 right-3" variant="secondary">
                    آفلاین
                  </Badge>
                )}

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40">
                  <PlayCircle className="w-14 h-14 text-white" />
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="font-semibold line-clamp-1">{stream.title}</div>

                <div className="text-xs opacity-70">{stream.streamer}</div>

                {stream.isLive && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <Users className="w-4 h-4" />
                    {stream.viewers} بیننده
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* 
        <div className="flex justify-center pt-4">
          <Button size="lg" className="px-8">
            ورود به لایوها
          </Button>
        </div> */}
      </div>
    </section>
  );
}
