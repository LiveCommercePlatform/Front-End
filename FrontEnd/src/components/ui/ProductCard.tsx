"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { formatPriceFa } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import clsx from "clsx";
import { ProductCardProps } from "@/types";
import { useCart } from "@/context/CartContext";
import { apiFetch, isProfileComplete } from "@/lib/api";
import { tokenStore } from "@/lib/token";
import ProfileCompleteModal from "./ProfileCompleteModal";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useProducts } from "@/context/ProductContext";

export default function ProductCard({
  id,
  title,
  price,
  status,
  cover,
  showEdit = true,
  showDelete = true,
  showAddToCart = false,
  showState = false,
  onEdit,
  className,
}: ProductCardProps) {
  const router = useRouter();
  const { cart, addToCart, updateQty, removeFromCart } = useCart();
  const { deleteProduct } = useProducts();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [pendingAdd, setPendingAdd] = useState(false);

  const count = useMemo(() => {
    const item = cart.find((i) => i.id === id);
    return item?.qty ?? 0;
  }, [cart, id]);

  const goToProduct = () => router.push(`/products/${id}`);

  const doAddToCart = () => {
    addToCart({ id, title, price, qty: 1, cover });
  };

  const increase = () => updateQty(id, count + 1);

  const decrease = () => {
    if (count - 1 <= 0) removeFromCart(id);
    else updateQty(id, count - 1);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

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
    } catch (err: any) {
      toast.error(err?.message || "خطا در بررسی پروفایل");
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={goToProduct}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") goToProduct();
        }}
        className={clsx(
          "cursor-pointer rounded-xl border bg-card overflow-hidden flex flex-col transition hover:shadow-md",
          className
        )}
      >
        {/* Cover */}
        <div className="h-32 bg-muted overflow-hidden">
          {cover ? (
            <img src={cover} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm opacity-60">
              بدون تصویر
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col justify-between flex-1">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-sm leading-snug line-clamp-2">
                {title}
              </h4>

              {showState && (
                <Badge
                  variant="secondary"
                  className={status === "active" ? "bg-emerald-100 text-emerald-700" : ""}
                >
                  {status === "active" ? "فعال" : "غیرفعال"}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm opacity-70">
                قیمت: {formatPriceFa(price)} تومان
              </p>

              {showAddToCart && status === "active" && (
                <>
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
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-400 text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          increase();
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>

                      <span className="text-sm font-semibold w-6 text-center">{count}</span>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-400 text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          decrease();
                        }}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {(showEdit || showDelete) && (
            <div className="flex items-center justify-between mt-4">
              {showEdit ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-yellow-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.();
                  }}
                >
                  <Pencil className="w-4 h-4" />
                  ویرایش
                </Button>
              ) : (
                <span />
              )}

              {showDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-red-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="text-right">
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف محصول</AlertDialogTitle>
                      <AlertDialogDescription className="text-right">
                        آیا از حذف این محصول مطمئن هستید؟ این عملیات غیرقابل بازگشت است.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>انصراف</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProduct(id);
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        حذف قطعی
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
        </div>
      </div>

      <ProfileCompleteModal
        open={profileModalOpen}
        onClose={() => {
          setProfileModalOpen(false);
          setPendingAdd(false);
        }}
        onCompleted={() => {
          setProfileModalOpen(false);

          if (pendingAdd) {
            doAddToCart();
            setPendingAdd(false);
          }
        }}
      />
    </>
  );
}