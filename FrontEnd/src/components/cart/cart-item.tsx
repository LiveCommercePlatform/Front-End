"use client";

import React from "react";
import Image from "next/image";
import { formatPriceFa } from "@/lib/utils";
import { CartProps } from "@/types";
import { useCart } from "@/context/CartContext";

export function CartItem({
  item,
  selected = false,
  onToggleSelect,
}: CartProps) {
  const { increase, decrease, removeFromCart } = useCart();

  return (
    <div className="flex flex-col sm:flex-row gap-3 border border-border rounded-lg bg-background p-3 sm:p-4 shadow-sm">
            <div className="flex sm:block items-start">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect?.(item.id)}
          className="w-4 h-4 sm:w-5 sm:h-5 mt-1"
        />
      </div>

      {/* image */}
      <div className="relative w-full sm:w-28 aspect-[4/3] sm:aspect-square rounded-md overflow-hidden bg-muted flex-shrink-0">
        <Image
 src={"data:image/jpeg;base64,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"
          }          alt={item.title}
          fill
          className="object-cover"
        />
      </div>

      {/* content */}
      <div className="flex-1 flex flex-col justify-between min-w-0">

        {/* title + remove */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm sm:text-base md:text-lg line-clamp-2">
              {item.title}
            </p>

            {item.deliveryInfo && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-1">
                {item.deliveryInfo}
              </p>
            )}

            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              قیمت واحد: {formatPriceFa(item.price)} تومان
            </p>
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 hover:opacity-80 flex-shrink-0 text-lg"
            aria-label="remove"
            title="حذف"
          >
            ✕
          </button>
        </div>

        {/* qty + total */}
        <div className="mt-3 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">

          {/* qty control */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => decrease(item.id)}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded border border-border text-sm"
            >
              −
            </button>

            <div className="min-w-[36px] text-center text-sm sm:text-base">
              {formatPriceFa(item.qty)}
            </div>

            <button
              onClick={() => increase(item.id)}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded border border-border text-sm"
            >
              +
            </button>
          </div>

          {/* total */}
          <div className="text-left sm:text-right w-full sm:w-auto">
            <div className="font-bold text-sm sm:text-base md:text-lg">
              {formatPriceFa(item.qty * item.price)} تومان
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
