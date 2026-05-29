"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPriceFa } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import clsx from "clsx";
import { ProductCardProps } from "@/types";
import { useCart } from "@/context/CartContext";
import DeleteDialog from "@/components/ui/DeleteDialog";

import ProfileCompleteModal from "./ProfileCompleteModal";
import { useProducts } from "@/context/ProductContext";

export default function ProductCard({
  id,
  title,
  price,
  status,
  media,
  stock,
  showEdit = true,
  showDelete = true,
  showAddToCart = false,
  showState = false,
  onEdit,
  className,
}: ProductCardProps) {
  const router = useRouter();
  const {
    handleAddToCart,
    getQty,
    increase,
    decrease,
    profileModalOpen,
    setProfileModalOpen,
  } = useCart();
  const count = getQty(id);
  const { deleteProduct } = useProducts();
  const [pendingAdd, setPendingAdd] = useState(false);
  const goToProduct = () => router.push(`/products/${id}`);

  const onAdd = async (e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    await handleAddToCart({
      id: id,
      title: title,
      price: price,
      cover: media || "",
    });
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
          className,
        )}
      >
        <div className="h-32 bg-muted overflow-hidden">
          {media ? (
            <img
              src={`http://localhost:8080${media}`}
              alt={title}
              className="w-full h-full object-cover"
            />
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
                  className={
                    status === "active" ? "bg-emerald-100 text-emerald-700" : ""
                  }
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
                      onClick={onAdd}
                      disabled={stock == 0}
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
                          increase(id);
                        }}
                        disabled = {stock >= count }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>

                      <span className="text-sm font-semibold w-6 text-center">
                        {count}
                      </span>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-400 text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          decrease(id);
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
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <DeleteDialog
                    title="حذف محصول"
                    description=" آیا از حذف این محصول مطمئن هستید؟ این عملیات غیرقابل بازگشت است."
                    onConfirm={() => {
                      deleteProduct(id);
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
            onAdd();
            setPendingAdd(false);
          }
        }}
      />
    </>
  );
}
