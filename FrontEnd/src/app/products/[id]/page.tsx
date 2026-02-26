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
  Trash2,
  ShoppingCart,
  Minus,
  Plus,
} from "lucide-react";
import { formatPriceFa } from "@/lib/utils";
import { DeleteProduct, getProductsByID } from "@/components/products/api";
import { tokenStore } from "@/lib/token";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StatBoxProps , ProductDetails } from "@/types";
import { useCart } from "@/context/CartContext";
import { apiFetch } from "@/lib/api";
import ProfileCompleteModal from "@/components/ui/ProfileCompleteModal";



export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  const { cart, addToCart, updateQty, removeFromCart } = useCart();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [pendingAdd, setPendingAdd] = useState(false);
  const count = useMemo(() => {
    const item = cart.find((i) => i.id === id);
    return item?.qty ?? 0;
  }, [cart, id]);

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const doAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      qty: 1,
      cover: product.cover_image || "",
    });
  };
  const increase = () => updateQty(id, count + 1);

  const decrease = () => {
    if (count - 1 <= 0) removeFromCart(id);
    else updateQty(id, count - 1);
  };
  const isProfileComplete = async () => {
    const access = tokenStore.getAccess?.();
    if (!access) return { ok: false, reason: "not_logged_in" as const };

    const res = await apiFetch("/profile/completed", { method: "GET" });
    const data = await res.json();

    if (!res.ok) {
      return { ok: false, reason: "api_error" as const, message: data?.error };
    }

    return {
      ok: data.completed,
      reason: data.completed ? "complete" : ("incomplete" as const),
    };
  };

  const handleAddToCart = async () => {
    try {
      const check = await isProfileComplete();
      if (check.reason === "not_logged_in") {
        toast("برای افزودن به سبد خرید، اول وارد شوید");
        router.push("/login");
        return;
      }
      if (!check.ok) {
        setPendingAdd(true);
        setProfileModalOpen(true);
        return;
      }
      doAddToCart();
    } catch (e: any) {
      toast.error(e?.message || "خطا در بررسی پروفایل");
    }
  };
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getProductsByID(id);
        setProduct(data);
      } catch (e: any) {
        toast.error(e?.message || "خطا در دریافت محصول");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const coverSrc = useMemo(() => {
    if (!product?.cover_image) return null;
    return product.cover_image;
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-sm opacity-70">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-sm opacity-70">محصول پیدا نشد</p>
      </div>
    );
  }

//   const isInStock = product.stock > 0;
  const isOwner = product.owner?.id == tokenStore.getUserId();

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* Top bar */}
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

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Image */}
        <Card className="md:col-span-2 overflow-hidden">
          <CardHeader className="text-right font-medium">
            جزنیات محصول
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/3] rounded-xl overflow-hidden border bg-muted flex items-center justify-center">
              {coverSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverSrc}
                  alt={product.title}
                  className="w-75 h-50 object-cover"
                />
              ) : (
                <span className="text-sm opacity-60">بدون تصویر</span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
              <div className="rounded-xl border p-3 text-right">
                <div className="text-xs opacity-60">قیمت</div>
                <div className="text-sm font-semibold mt-1 text-left">
                  {formatPriceFa(product.price)} تومان
                </div>
              </div>

              <div className="rounded-xl border p-3 text-right">
                <div className="text-xs opacity-60">موجودی</div>
                <div className="text-lg font-semibold mt-1 text-left">
                  {formatPriceFa(product.stock)}
                </div>
              </div>
            </div>


            <Separator />

            {/* Description */}
            <div className="text-right my-3">
              <div className="text-sm font-medium mb-1">توضیحات</div>
              <p className="text-sm opacity-70 leading-relaxed mr-4">
                {product.description?.trim() ? product.description : "توضیحی برای این محصول ثبت نشده است."}</p>
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
                <p className="text-sm opacity-60 text-left">بدون تگ</p>
              )}
            </div>
            <div className="flex items-center justify-end pt-2">
              

              {isOwner && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/products/${product.id}/edit`)}
                  >
                    ویرایش
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="gap-2">
                        <Trash2 className="w-4 h-4" />
                        حذف محصول
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent dir="rtl">
                      <AlertDialogHeader className="text-right">
                        <AlertDialogTitle>حذف محصول</AlertDialogTitle>

                        <AlertDialogDescription>
                          آیا از حذف این محصول مطمئن هستید؟ این عملیات غیرقابل
                          بازگشت است.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter className="flex-row-reverse">
                        <AlertDialogCancel>انصراف</AlertDialogCancel>

                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => {DeleteProduct(id); router.back()}}
                        >
                          حذف شود
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}

              {!isOwner && product.stock>0 && (
                <div className="flex gap-2">
                  {count === 0 ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-blue-600 border-blue-400"
                      onClick={handleAddToCart}
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
                        onClick={increase}
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
                        onClick={decrease}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="md:col-span-3">
          {/* <CardHeader className="text-right font-medium">جزئیات</CardHeader> */}
          <CardContent className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatBox
                statKey="view_count"
                label="بازدید"
                value={product.view_count ?? 0}
                disabled={true}
                icon={(active) => <Eye className={"w-5 h-5 transition"} />}
              />

              <StatBox
                statKey={`${product.id}/like`}
                label="پسند"
                value={product.like_count ?? 0}
                initiallyActive={true} // اگر از بک داری
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
                label="دیس لایک"
                value={product.like_count ?? 0}
                initiallyActive={true}
                icon={(active) => (
                  <ThumbsDown
                    className={[
                      "w-5 h-5 transition",
                      active
                        ? "fill-blue-500 text-blue"
                        : "text-muted-foreground",
                    ].join(" ")}
                  />
                )}
              />
              <StatBox
                statKey="view_count"
                label="امتیاز"
                value={
                  product.rating_count
                    ? `${(product.rating_avg ?? 0).toFixed(1)} / 5`
                    : "-"
                }
                disabled={true}
                icon={(active) => <Star className={"w-5 h-5 transition"} />}
              />
            </div>
            
          </CardContent>
        </Card>
      </div>

      {product.cover_image?.startsWith("blob:") && (
        <div className="rounded-xl border bg-muted/30 p-4 text-sm text-right">
          ⚠️ <span className="font-medium">cover_image</span> الان blob هست. این
          فقط برای پیش‌نمایش سمت فرانت خوبه. برای صفحه جزئیات باید از بک یک URL
          واقعی (مثلاً CDN یا لینک فایل) برگردونی.
        </div>
      )}
      <ProfileCompleteModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onCompleted={() => {
          doAddToCart();
        }}
      />
    </div>
  );
}

function StatBox({
  statKey,
  icon,
  label,
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
    setActive(newActive);
    setCount((c) => (newActive ? Number(c) + 1 : Math.max(0, Number(c) - 1)));
    setLoading(false);

    // try {
    //   const res = await apiFetch(`/products/${statKey}`, {
    //     method: "POST", // یا PUT / DELETE بسته به بک
    //   });

    //   if (!res.ok) {
    //     throw new Error("خطا در ثبت عملیات");
    //   }
    // } catch (err: any) {
    //   // 🔁 Rollback اگر بک fail کرد
    //   setActive(active);
    //   setCount((c) => (active ? c + 1 : Math.max(0, c - 1)));

    //   toast.error(err?.message || "خطا رخ داد");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="rounded-xl border p-3 flex items-center justify-between">
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled || loading}
        className={[
          "p-2 rounded-lg transition",
          "hover:bg-muted/40 active:scale-95",
          loading ? "opacity-50" : "",
        ].join(" ")}
      >
        {icon(active)}
      </button>
      <div className="text-right">
        <div className="text-xs opacity-60">{label}</div>
        <div className="text-sm font-semibold mt-1">{count}</div>
      </div>
    </div>
  );
}
