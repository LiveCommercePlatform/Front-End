"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Eye, Users, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toPersianDigits } from "@/lib/utils";
export function VideoInfo() {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(256); // مقدار اولیه لایک‌ها

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = "آموزش اصولی اسکیت‌سواری و معرفی اسکیت حرفه‌ای";

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: "این ویدیو رو ببین 👇",
          url,
        });
      } catch (err) {
        console.error("خطا در اشتراک‌گذاری:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("کپی نشد:", err);
      }
    }
  };

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardContent className="p-6 space-y-6">
        {/* اطلاعات منتشرکننده */}
        <div className="flex items-center gap-3">
          <img
            src="/avatar.png"
            alt="user"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">اندی ویلیام</p>
            <p className="text-sm text-muted-foreground">۱,۹۸۰,۸۹۳ مشترک</p>
          </div>
        </div>

        {/* عنوان و توضیحات */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold">
            آموزش اصولی اسکیت‌سواری و معرفی اسکیت حرفه‌ای
          </h2>

          {/* 🔹 بخش تگ‌ها */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">#اسکیت</Badge>
            <Badge variant="default">#ورزشی</Badge>
            <Badge variant="default">#آموزشی</Badge>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            در این ویدیو با روش‌های درست اسکیت‌سواری آشنا می‌شوید و همچنین محصول
            پیشنهادی ما برای خرید یک اسکیت حرفه‌ای معرفی می‌شود.
          </p>
        </div>

        {/* دکمه‌ها */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Heart
              onClick={handleLike}
              className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
            />
            <span className="text-sm font-medium">
              {toPersianDigits(likes)}
            </span>
          </div>

          <Button
            onClick={handleShare}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            {copied ? "لینک کپی شد ✅" : "اشتراک‌گذاری"}
          </Button>
        </div>

        {/* آمار */}
        <div className="flex gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {toPersianDigits((125908).toLocaleString())} بازدید
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {toPersianDigits((1938394).toLocaleString())} نفر آنلاین
          </span>
        </div>

        {/* معرفی کالا */}
        <div className="border-t pt-4 space-y-3">
          <h3 className="font-semibold text-lg">🎁 محصول معرفی‌شده</h3>
          <div className="flex items-center gap-4">
            <img
              src="/product.jpg"
              alt="اسکیت حرفه‌ای"
              className="w-28 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="font-medium">اسکیت حرفه‌ای مدل X200</p>
              <p className="text-muted-foreground text-sm">
                مناسب برای افراد مبتدی و حرفه‌ای
              </p>
              <p className="text-lg font-bold text-primary mt-1">
                {toPersianDigits((12560000).toLocaleString())} تومان
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> خرید
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
