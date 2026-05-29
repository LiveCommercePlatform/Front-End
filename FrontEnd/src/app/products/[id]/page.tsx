"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Heart,
  Eye,
  ThumbsDown,
  Star,
  ArrowRight,
  ShoppingCart,
  Minus,
  Plus,
  Pencil,
  Coins,
  Boxes,
} from "lucide-react";
import { cn, formatPriceFa } from "@/lib/utils";
import { tokenStore } from "@/lib/token";
import { StatBoxProps, ProductDetails, RatingData } from "@/types";
import { useCart } from "@/context/CartContext";
import { apiFetch } from "@/lib/api";
import ProfileCompleteModal from "@/components/ui/ProfileCompleteModal";
import { useProducts } from "@/context/ProductContext";
import { Textarea } from "@/components/ui/textarea";
import DeleteDialog from "@/components/ui/DeleteDialog";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import { getErrorMessage } from "@/lib/getErrorMessage";
import ProductRating from "@/components/products/ProductRating";
import InfoCard from "@/components/products/InfoCard";
import Loading from "@/components/ui/Loading";
import NotFound from "@/components/ui/NotFound";
import RatingCard from "@/components/products/RatingCard";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  const {
    handleAddToCart,
    getQty,
    increase,
    decrease,
    profileModalOpen,
    setProfileModalOpen,
  } = useCart();
  const count = getQty(id);
  const {
    getProductByIdCached,
    getMyEngagementCached,
    getStatCached,
    deleteProduct,
    fetchComments,
    getMystatCached,
  } = useProducts();
  const [loading_, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [my_rating, setMyRating] = useState<number>(0);
  const [stats, setStats] = useState<RatingData | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  async function handleCommentSubmit() {
    try {
      const access = tokenStore.getAccess?.();
      if (!access) {
        toast("برای ثبت کامنت، اول وارد شوید.");
        router.push("/login");
        return;
      }
      setCommentLoading(true);
      const res = await apiFetch(`/products/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: commentText }),
      });

      if (!res.ok) throw new Error("خطا در ثبت کامنت");

      const created = await res.json();
      setComments((prev: any[]) => [created, ...prev]);
      setCommentText("");
      toast.success("کامنت ثبت شد");
    } catch (e: any) {
      toast.error(e?.message || "خطا");
    } finally {
      setCommentLoading(false);
    }
  }
async function handleSumbitRating(val:number) {
    try {
      if (!tokenStore.getAccess()) {
        toast("برای ثبت کامنت، اول وارد شوید.");
        router.push("/login");
        return;
      }
      const res = await apiFetch(`/products/${id}/rating`, {
        method: "POST",
        body: JSON.stringify({ rating: val }),
      });
      if (!res.ok) throw new Error("خطا در ثبت ریتینگ");
    } catch (e: any) {
      // toast.error(e?.message || "خطا");
    }
  }

  async function handleDeleteRating() {
    try {
      const res = await apiFetch(`/products/${id}/rating`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("خطا در ریتینگ ");
    } catch (e: any) {
      // toast.error(e?.message || "خطا");
    }
  }

  useEffect(() => {
  if (!id) return;

  async function load() {
    try {
      setLoading(true);

      const [
        product_,
        engagement,
        stat_,
        comments_,
        myrating,
      ] = await Promise.all([
        getProductByIdCached(id),
        getMyEngagementCached(id),
        getStatCached(id),
        fetchComments(id),
        getMystatCached(id),
      ]);

      setProduct({ ...product_, ...engagement });
      setComments(comments_ ?? []);
      setStats(stat_);
      setMyRating(myrating);
    } catch (e: any) {
      toast.error(e?.message || "خطا در دریافت محصول");
    } finally {
      setLoading(false);
    }
  }

  load();
}, [id]);


  const handleDeleteMedia = async (mediaId: string) => {
    try {
      const res = await apiFetch(`/media/${mediaId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("خطا در حذف مدیا");
      setProduct((prev: any) => ({
        ...prev,
        media: prev.media?.filter((m: any) => m.id !== mediaId),
      }));
    } catch (e: any) {
      toast.error(e?.message || "خطا");
    }
  };

  const onAdd = async () => {
    if (!product) return;

    await handleAddToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      cover: product.media?.at(-1)?.url || "",
    });
  };

  if (loading_) {
    return <Loading text="در حال بارگذاری محصول . . ." />;
  }

  if (!product) {
    return (
      <NotFound title="پیدا نشد." message="متاسفانه محصول مورد نظر پیدا نشد." />
    );
  }

  const isOwner = product.owner?.id == tokenStore.getUserId();

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-lg md:text-2xl font-semibold">{product.title}</h1>
          <div className="text-xs opacity-60">
            {product.owner?.name ? `مالک: ${product.owner.name}` : ""}
          </div>
        </div>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => router.back()}
        >
          بازگشت
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="md:col-span-3 overflow-hidden">
          <CardHeader className="text-right font-medium">
            جزنیات محصول
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/3] rounded-xl overflow-hidden border bg-muted flex items-center justify-center">
              {product.media?.length ? (
                <ProductImageGallery
                  owner={isOwner}
                  OnDelete={handleDeleteMedia}
                  media={product.media}
                  title={product.title}
                />
              ) : (
                <span className="text-sm opacity-60">بدون تصویر</span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
              <InfoCard
                title="قیمت"
                icon={() => <Coins className="w-4 h-4 text-[#00bfa6]" />}
                count={product.price}
              />
              <InfoCard
                title="موجودی"
                icon={() => <Boxes className="w-4 h-4 text-[#00bfa6]" />}
                count={product.stock}
              />
              <InfoCard
                title="بازدید"
                icon={() => <Eye className="w-4 h-4 text-[#00bfa6]" />}
                count={product.view_count || 0}
              />
            </div>
            <Separator />
            <div className="text-right my-3">
              <div className="text-sm font-medium mb-1">توضیحات</div>
              <p className="text-sm opacity-70 leading-relaxed mr-4">
                {product.description?.trim()
                  ? product.description
                  : "توضیحی برای این محصول ثبت نشده است."}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium mb-1">دسته بندی</div>
              <p className="text-sm opacity-80 leading-relaxed text-left">
                {product.category?.name_fa
                  ? ` ${product.category.name_fa}`
                  : "بدون دسته‌بندی"}
              </p>
            </div>

            {/* Tags */}
            <div className="text-right mb-3">
              <div className="text-sm font-medium mb-2">تگ‌ها</div>
              {product.tags?.length ? (
                <div className="flex flex-wrap gap-2 justify-end">
                  {product.tags.map((t) => (
                    <Badge key={t.id}>{t.name}</Badge>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 justify-end opacity-60 text-sm">
                  تگ ای برای اینم محصول انتخاب نشده.
                </div>
              )}
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatBox
                  statKey={`${product.id}/like`}
                  value={product.like_count ?? 0}
                  initiallyActive={product.liked}
                  icon={(active) => (
                    <Heart
                      className={[
                        "w-5 h-5 transition",
                        active
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground",
                      ].join(" ")}
                    />
                  )}
                />
                <StatBox
                  statKey={`${product.id}/dislike`}
                  value={product.dislike_count ?? 0}
                  initiallyActive={product.disliked}
                  icon={(active) => (
                    <ThumbsDown
                      className={[
                        "w-5 h-5 transition",
                        active
                          ? "fill-blue-500 text-blue-500"
                          : "text-muted-foreground",
                      ].join(" ")}
                    />
                  )}
                />
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-2 text-yellow-600"
                    onClick={() => router.push(`/products/${product.id}/edit`)}
                  >
                    <Pencil className="w-4 h-4" />
                    ویرایش
                  </Button>

                  <DeleteDialog
                    title="حذف محصول"
                    description=" آیا از حذف این محصول مطمئن هستید؟ این عملیات غیرقابل بازگشت است."
                    onConfirm={() => {
                      deleteProduct(id);
                      router.back();
                    }}
                    trigger={
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-2 text-red-600"
                      >
                        حذف
                      </Button>
                    }
                  />
                </div>
              )}

              {!isOwner && product.stock > 0 && (
                <div className="flex gap-2">
                  {count === 0 ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-blue-600 border-blue-400"
                      onClick={onAdd}
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
                        onClick={() => increase(product.id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>

                      <span className="text-sm font-semibold w-6 text-center">
                        {formatPriceFa(count)}
                      </span>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-400 text-blue-600"
                        onClick={() => decrease(product.id)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <RatingCard my_rating={my_rating} onDelete={handleDeleteRating} onRate={handleSumbitRating}/>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader className="text-right font-medium">
            نظرات و امتیازات
          </CardHeader>
          <CardContent className="space-y-4">
            <ProductRating
              rating={{
                rating_avg: stats?.rating_avg ?? 11.5,
                rating_count: stats?.rating_count ?? 43,
                breakdown: stats?.breakdown ?? {
                  1: 5,
                  2: 5,
                  3: 3,
                  4: 10,
                  5: 20,
                },
                user_rating: stats?.user_rating ?? null,
              }}
              onRate={async (value) => {
                console.log("submit rating:", value);

                // اینجا API صدا می‌زنی
                // await rateProduct(product.id, value);
              }}
            />
            <Card className="border rounded-xl">
              <CardHeader className="text-right font-medium">نظرات</CardHeader>

              <CardContent className="space-y-4">
                <div className="md:h-70 overflow-auto flex flex-col justify-center space-y-3 pr-1">
                  {comments?.length ? (
                    comments.map((c: any) => (
                      <div
                        key={c.id}
                        className="rounded-xl border p-3 flex flex-col gap-2"
                      >
                        <div className="text-xs opacity-60 text-left">
                          {new Date(c.created_at).toLocaleDateString("fa-IR")}
                        </div>
                        <p className="text-sm opacity-80 leading-relaxed text-right">
                          {c.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border bg-muted/30 p-6 text-center text-sm opacity-60 ">
                      هنوز نظری ثبت نشده
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="text-right text-sm font-medium">
                    ثبت نظر جدید
                  </div>
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                    placeholder="نظر خودتون رو بنویسید..."
                    className="text-right"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-60">
                      {commentText.trim().length}/500
                    </span>

                    <Button
                      className="gap-2"
                      disabled={commentLoading || !commentText.trim()}
                      onClick={handleCommentSubmit}
                    >
                      ارسال نظر
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
      <ProfileCompleteModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onCompleted={() => {
          onAdd();
        }}
      />
    </div>
  );
}

function StatBox({
  statKey,
  icon,
  value,
  initiallyActive = false,
  disabled = false,
}: StatBoxProps) {
  const [active, setActive] = useState(initiallyActive);
  const [count, setCount] = useState<number | string>(value);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (disabled || loading) return;
    setLoading(true);
    const newActive = !active;
    try {
      const res = await apiFetch(`/products/${statKey}`, {
        method: newActive ? "POST" : "DELETE",
      });
      if (!res.ok) {
        throw new Error("خطا در ثبت عملیات");
      }
      setActive(newActive);
      setCount((c) => (newActive ? Number(c) + 1 : Math.max(0, Number(c) - 1)));
    } catch (err: any) {
      toast.error(getErrorMessage(err?.message) || "خطا رخ داد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" p-3 flex items-center justify-between ">
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled || loading}
        className={[
          "p-2 rounded-lg transition ",
          "hover:bg-muted/40 active:scale-95",
          loading ? "opacity-50" : "",
        ].join(" ")}
      >
        {icon(active)}
      </button>
      <div className="text-right">
        <div className="text-sm font-semibold mt-1">{count}</div>
      </div>
    </div>
  );
}
