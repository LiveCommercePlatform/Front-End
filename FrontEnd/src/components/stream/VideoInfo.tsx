"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useCart } from "@/context/CartContext";
import ProfileCompleteModal from "../ui/ProfileCompleteModal";
import { Badge } from "../ui/badge";

export function VideoInfo({
  stat,
  streamInfo,
  myReaction,
  isOwner,
  onLike,
  onDislike,
  onPin,
  onDelete,
}: {
  stat: LiveRoomStats;
  streamInfo: Stream;
  myReaction: ReactionType;
  isOwner: boolean;
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

  const sortedProducts = [...(streamInfo.Products || [])].sort(
    (a, b) => Number(b.IsPinned) - Number(a.IsPinned),
  );

  const onAdd = async (product: any) => {
    if (!product) return;
    await handleAddToCart({
      id: product.ProductID,
      title: product.Product.title,
      price: product.Product.price,
      cover: product.Product.cover_image || "",
    });
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: streamInfo.Title,
          text: "این لایو رو از دست نده!",
          url,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm border border-border bg-card text-card-foreground">
      <CardContent className="p-4 md:p-6 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-lg md:text-2xl font-bold leading-tight">
            {streamInfo.Title}
          </h2>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-bold">
              میزبان
            </span>
            {streamInfo.Host.name}
          </div>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
            {streamInfo.Description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-4 border-y border-border py-4">
          <div className="grid grid-cols-2 md:flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-4">
              <button
                disabled={loadingReaction}
                onClick={onLike}
                className={`flex items-center gap-1.5 transition ${
                  myReaction === "like"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <ThumbsUp
                  className={`w-5 h-5 ${myReaction === "like" ? "fill-primary" : ""}`}
                />
                <span className="text-sm font-bold">
                  {formatPriceFa(stat.total_likes || 0)}
                </span>
              </button>

              <button
                disabled={loadingReaction}
                onClick={onDislike}
                className={`flex items-center gap-1.5 transition ${
                  myReaction === "dislike"
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                <ThumbsDown
                  className={`w-5 h-5 ${myReaction === "dislike" ? "fill-destructive" : ""}`}
                />
                <span className="text-sm font-bold">
                  {formatPriceFa(stat.total_dislikes || 0)}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground border-r md:border-r-0 pr-4 md:pr-0 border-border">
              <div className="flex items-center gap-1.5 text-xs md:text-sm">
                <Eye className="w-4 h-4 opacity-70" />
                {formatPriceFa(stat.total_views || 0)}
              </div>
            </div>
          </div>

          <Button
            onClick={handleShare}
            variant="secondary"
            className="w-full md:w-auto md:mr-auto rounded-xl gap-2 h-11 md:h-10"
          >
            <Share2 className="w-4 h-4" />
            {copied ? "کپی شد" : "اشتراک‌گذاری"}
          </Button>
        </div>

        {/* Products */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-base font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              محصولات معرفی شده
            </h3>

            <span className="text-xs text-muted-foreground">
              {sortedProducts.length} محصول
            </span>
          </div>

          {sortedProducts.length > 0 ? (
            <div className="grid gap-3">
              {sortedProducts.map((lp) => (
                <div
                  key={lp.ProductID}
                  className={`group relative flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-2xl border transition-all
              ${
                lp.IsPinned
                  ? "border-amber-300/40 bg-amber-500/10"
                  : "border-border hover:bg-muted/40"
              }`}
                >
                  <ProfileCompleteModal
                    open={profileModalOpen}
                    onClose={() => setProfileModalOpen(false)}
                    onCompleted={() => {
                      onAdd(lp);
                    }}
                  />
                  <div className="flex flex-1 gap-3 items-center">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-6 h-6 text-muted-foreground opacity-60" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold truncate">
                          {lp.Product.title}
                        </h4>

                        {lp.IsPinned && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500">
                            پین شده
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-black text-primary mt-1">
                        {lp.Product.price
                          ? lp.Product.price.toLocaleString("fa-IR")
                          : "۰"}
                        <span className="text-[10px] font-normal text-muted-foreground mr-1">
                          تومان
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 sm:flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-none border-border">
                    {isOwner && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onPin(lp.ProductID, !lp.IsPinned)}
                          className="h-9 rounded-lg gap-1.5"
                        >
                          <Pin className="h-4 w-4" />
                          <span className="text-xs">
                            {lp.IsPinned ? "آن‌پین" : "پین"}
                          </span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(lp.ProductID)}
                          className="h-9 rounded-lg gap-1.5 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="text-xs">حذف</span>
                        </Button>
                      </>
                    )}

                    <div className="col-span-2 sm:w-32">
                      {getQty(lp.ProductID) === 0 ? (
                        <Button
                          onClick={() => onAdd(lp)}
                          className="w-full h-9 rounded-lg gap-2"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          افزودن به سبد
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between bg-muted rounded-lg h-9 px-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => increase(lp.ProductID)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>

                          <span className="text-sm font-bold w-8 text-center">
                            {formatPriceFa(getQty(lp.ProductID))}
                          </span>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => decrease(lp.ProductID)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NotFound
              title="محصولی یافت نشد"
              message="در حال حاضر محصولی برای نمایش وجود ندارد."
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
