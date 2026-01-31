"use client";

import { useMemo } from "react";
import { toPersianDigits } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import clsx from "clsx";
import { ProductCardProps } from "@/types";
import { useCart } from "@/context/CartContext"; // 👈 مسیر رو درست کن

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
  onDelete,
  className,
}: ProductCardProps) {
  const { cart, addToCart, updateQty, removeFromCart } = useCart();

  // 🔢 تعداد این محصول داخل سبد
  const count = useMemo(() => {
    const item = cart.find((i) => i.id === id);
    return item?.qty ?? 0;
  }, [cart, id]);

  const formatPrice = (num: number) =>
    toPersianDigits(num.toLocaleString("en-US"));

  const handleAddToCart = () => {
    addToCart({
      id,
      title,
      price,
      qty: 1,
      cover,
    });
  };

  const increase = () => {
    updateQty(id, count + 1);
  };

  const decrease = () => {
    if (count - 1 <= 0) {
      removeFromCart(id);
    } else {
      updateQty(id, count - 1);
    }
  };

  return (
    <div
      className={clsx(
        "rounded-xl border bg-card overflow-hidden flex flex-col transition hover:shadow-md",
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

            {showState && <Badge
              variant="secondary"
              className={
                status === "active"
                  ? "bg-emerald-100 text-emerald-700"
                  : ""
              }
            >
              {status === "active" ? "فعال" : "غیرفعال"}
            </Badge>}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm opacity-70">
              قیمت: {formatPrice(price)} تومان
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
                      {toPersianDigits(count)}
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
                onClick={onEdit}
              >
                <Pencil className="w-4 h-4" />
                ویرایش
              </Button>
            ) : (
              <span />
            )}

            {showDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-red-600"
                onClick={onDelete}
              >
                <Trash2 className="w-4 h-4" />
                حذف
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
