"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ThumbsDown,
  ThumbsUp,
  Share2,
  Eye,
  Users,
  ShoppingCart,
  Pin,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
import { useState } from "react";
import { formatPriceFa } from "@/lib/utils";
import { LiveRoomStats, Stream, ReactionType } from "@/types";
import NotFound from "../ui/NotFound";
import { tokenStore } from "@/lib/token";
import { useCart } from "@/context/CartContext";
import ProfileCompleteModal from "../ui/ProfileCompleteModal";
export function VideoInfo({
  stat,
  streamInfo,
  myReaction,
  onLike,
  onDislike,
  onRefresh,
  onDelete,
  onPin,
}: {
  stat: LiveRoomStats;
  streamInfo: Stream;
  myReaction: ReactionType;
  onLike: () => Promise<boolean>;
  onDislike: () => Promise<boolean>;
  onRefresh: () => Promise<void>;
  onPin: (productId: string, isPinned: boolean) => Promise<boolean>;
  onDelete: (productId: string) => Promise<boolean>;
}) {
  const [copied, setCopied] = useState(false);
  const [loadingReaction, setLoadingReaction] = useState(false);
  const {
    handleAddToCart,
    getQty,
    increase,
    decrease,
    profileModalOpen,
    setProfileModalOpen,
  } = useCart();
  const isOwner = streamInfo.HostID == tokenStore.getUserId();
const sortedProducts = [...streamInfo.Products].sort(
  (a, b) => Number(b.IsPinned) - Number(a.IsPinned)
);
  const onAdd = async (product: any) => {
    if (!product) return;

    await handleAddToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      cover: product.cover_image || "",
    });
  };
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: streamInfo.Title,
          text: "این لایو رو ببین 👇",
          url,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = async () => {
    if (loadingReaction) return;
    setLoadingReaction(true);
    await onLike();
    setLoadingReaction(false);
  };

  const handleDislike = async () => {
    if (loadingReaction) return;
    setLoadingReaction(true);
    await onDislike();
    setLoadingReaction(false);
  };
  console.log("12");
  const products = streamInfo.Products ?? [];

  return (
    <>
      <Card className="rounded-2xl shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <h2 className="text-xl font-bold">{streamInfo.Title}</h2>
            <p className="text-sm text-muted-foreground">
              توسط: {streamInfo.Host.name}
            </p>
            <p className="text-muted-foreground text-md leading-relaxed">
              {streamInfo.Description}
            </p>
          </div>

          {/* اکشن‌ها */}
          <div className="flex gap-6 items-center">
            <div
              onClick={handleLike}
              className="flex items-center gap-2 cursor-pointer"
            >
              <ThumbsUp
                className={`w-5 h-5 transition ${
                  myReaction === "like"
                    ? "text-primary fill-primary"
                    : "text-muted-foreground"
                }`}
              />
              <span className="text-sm font-medium">
                {formatPriceFa(stat.total_likes ?? 0)}
              </span>
            </div>

            <div
              onClick={handleDislike}
              className="flex items-center gap-2 cursor-pointer"
            >
              <ThumbsDown
                className={`w-5 h-5 transition ${
                  myReaction === "dislike"
                    ? "text-destructive fill-destructive"
                    : "text-muted-foreground"
                }`}
              />
              <span className="text-sm font-medium">
                {formatPriceFa(stat.total_dislikes ?? 0)}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {formatPriceFa(stat?.total_views ?? 0)} بازدید
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {formatPriceFa(stat?.viewer_count ?? 0)} نفر آنلاین
            </span>
            <Button
              onClick={handleShare}
              variant="outline"
              className="mr-auto flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              {copied ? "لینک کپی شد ✅" : "اشتراک‌گذاری"}
            </Button>
          </div>
          {products.length > 0 ? (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                محصولات این لایو
              </h3>

              <div className="space-y-2">
                {sortedProducts.map((lp) => (
                  <div
                    key={lp.ProductID}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2"
                  >
                    <ProfileCompleteModal
                      open={profileModalOpen}
                      onClose={() => setProfileModalOpen(false)}
                      onCompleted={() => {
                        onAdd(lp);
                      }}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {lp.Product.title || "بدون عنوان"}{lp.ProductID}
                      </div>

                      <div className="mt-0.5 text-xs text-gray-500">
                        قیمت:{" "}
                        {lp.Product.price
                          ? lp.Product.price.toLocaleString("fa-IR")
                          : "نامشخص"}
                      </div>

                      {lp.IsPinned && (
                        <span className="mt-1 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                          پین شده
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isOwner ? (
                        <>
                          <Button
                            variant={lp.IsPinned ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPin(lp.ProductID, !lp.IsPinned)}
                            className={`flex items-center gap-1 ${
                              lp.IsPinned
                                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                : ""
                            }`}
                          >
                            <Pin className="h-4 w-4" />
                            {lp.IsPinned ? "برداشتن پین" : "پین"}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(lp.ProductID)}
                            className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            حذف
                          </Button>
                        </>
                      ) : (
                        <></>
                      )}

                      {getQty(lp.ProductID) === 0 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-blue-600 border-blue-400"
                          onClick={() => onAdd(lp)}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          افزودن
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-400 text-blue-600"
                            onClick={() => increase(lp.ProductID)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>

                          <span className="text-sm font-semibold w-6 text-center">
                            {formatPriceFa(getQty(lp.ProductID))}
                          </span>

                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-400 text-blue-600"
                            onClick={() => decrease(lp.ProductID)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <NotFound
                title="محصولی در این لایو ثبت نشده است"
                message="هنوز محصولی برای این لایو اضافه نشده است."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
