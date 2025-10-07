"use client"

import React from "react"
import Image from "next/image"
import { toPersianDigits } from "@/lib/utils"
import { Props } from "@/types";

export function CartItem({ item, onQtyChange, onRemove, selected = false, onToggleSelect }: Props) {
  return (
    <div className="flex flex-col sm:flex-row border rounded-lg bg-background p-3 sm:p-4 shadow-sm gap-3">
  <div className="flex-shrink-0">
    <input
      type="checkbox"
      checked={selected}
      onChange={() => onToggleSelect?.(item.id)}
      className="w-4 h-4 sm:w-5 sm:h-5 mt-1"
    />
  </div>

  <div className="w-full sm:w-28 h-36 sm:h-20 relative rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
    <Image src={item.image} alt={item.name} fill className="object-cover" />
  </div>
  <div className="flex-1 flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm sm:text-base md:text-lg truncate">{item.name}</p>
        {item.deliveryInfo && (
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1 truncate">
            {item.deliveryInfo}
          </p>
        )}
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
          قیمت واحد: {toPersianDigits(item.price.toLocaleString())} تومان
        </p>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="text-sm sm:text-base md:text-lg ml-2 text-red-500 hover:opacity-80 flex-shrink-0"
        aria-label="remove"
        title="حذف"
      >
        ✕
      </button>
    </div>

    <div className="mt-3 flex flex-row sm:flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQtyChange(item.id, Math.max(1, item.qty - 1))}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded border text-sm sm:text-base md:text-lg"
        >
          −
        </button>
        <div className="min-w-[36px] text-center text-sm sm:text-base md:text-lg">
          {toPersianDigits(item.qty)}
        </div>
        <button
          onClick={() => onQtyChange(item.id, item.qty + 1)}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded border text-sm sm:text-base md:text-lg"
        >
          +
        </button>
      </div>

      <div className="mt-2 sm:mt-0 text-left sm:text-right">
        <div className="font-bold text-sm sm:text-base md:text-lg">
          {toPersianDigits((item.qty * item.price).toLocaleString())} تومان
        </div>
      </div>
    </div>
  </div>
</div>

  )
}
