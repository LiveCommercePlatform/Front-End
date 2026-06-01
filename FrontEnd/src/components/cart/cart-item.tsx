"use client";

import React from "react";
import Image from "next/image";
import { formatPriceFa } from "@/lib/utils";
import { CartProps } from "@/types";

type CartItemProps = {
  item: CartProps["item"];
  onRemove?: (id: string | number) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string ) => void;
};

export function CartItem({
  item,
  onRemove,
  onIncrease,
  onDecrease,
}: CartItemProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 border border-border rounded-lg bg-background p-3 sm:p-4 shadow-sm">
      {/* image */}
      <div className="relative w-full sm:w-28 aspect-[4/3] sm:aspect-square rounded-md overflow-hidden bg-muted flex-shrink-0">
        <Image
          src={`http://localhost:8080${item.cover}`}
          alt={item.title}
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
            onClick={() => onRemove?.(item.id)}
            className="text-red-500 hover:opacity-80 flex-shrink-0 text-lg"
            aria-label="remove"
            title="حذف"
          >
            ✕
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDecrease(item.id)}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded border border-border text-sm"
            >
              −
            </button>

            <div className="min-w-[36px] text-center text-sm sm:text-base">
              {formatPriceFa(item.qty)}
            </div>

            <button
              onClick={() => onIncrease(item.id)}
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
