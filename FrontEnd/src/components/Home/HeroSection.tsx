"use client";

import { PlayCircle, Video, MessageCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* TEXT */}
        <div className="text-center lg:text-right space-y-6">
          {/* Live Badge */}
          <span className="inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full bg-red-500/10 text-red-600">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            لایو در حال برگزاری
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            فروش زنده،
            <br />
            <span className="text-primary">تعامل واقعی</span>،
            <br />
            درآمد فوری
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
            با استریم زنده محصولاتت رو معرفی کن، با مخاطب چت کن و
            همون لحظه فروش انجام بده. تجربه‌ای جدید از فروش آنلاین.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
              <Video className="w-5 h-5" />
              شروع استریم
            </button>

            <button className="inline-flex items-center justify-center gap-2 border px-6 py-3 rounded-xl font-semibold hover:bg-muted transition">
              <PlayCircle className="w-5 h-5" />
              مشاهده لایوها
            </button>
          </div>

          {/* Social proof */}
          <div className="flex justify-center lg:justify-start gap-6 pt-4 text-sm opacity-70">
            <span>🔥 ۱۲۳ فروش امروز</span>
            <span>👥 ۴۵۰+ بیننده آنلاین</span>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="relative">
          <div className="relative rounded-2xl border bg-card shadow-xl overflow-hidden">
            {/* Fake video */}
            <div className="aspect-video bg-black/90 flex items-center justify-center text-white">
              <PlayCircle className="w-16 h-16 opacity-80" />
            </div>

            {/* Overlay */}
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </div>

            {/* Chat preview */}
            <div className="absolute bottom-3 left-3 right-3 bg-background/90 backdrop-blur rounded-xl p-3 text-sm space-y-1">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="font-medium">چت زنده</span>
              </div>
              <p className="opacity-70">این محصول ارسالش چطوره؟</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
