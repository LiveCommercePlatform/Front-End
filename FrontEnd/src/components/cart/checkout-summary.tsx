"use client";

import React, { useState } from "react";
import { formatPriceFa } from "@/lib/utils";
import { CartItemType } from "@/types";
import { Button } from "@/components/ui/button";

type Props = {
  items: CartItemType[];
  onPlaceOrder?: () => void;
};

export function CheckoutSummary({ items, onPlaceOrder }: Props) {
  const subTotal: number = items.reduce(
    (s: number, it: CartItemType) => s + it.price * it.qty,
    0
  );
  const [coupon, setCoupon] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [giftWrap, setGiftWrap] = useState<boolean>(false);

  const discount: number = appliedCoupon === "MAX500" ? 50000 : 0;
  const shipping: number = subTotal > 0 ? 0 : 0;
  const total: number = subTotal - discount + shipping + (giftWrap ? 20000 : 0);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "MAX500") setAppliedCoupon("MAX500");
    else setAppliedCoupon(null);
  };

  return (
<aside className="sticky top-4 md:top-6 space-y-4 w-full md:w-full lg:w-96">
      <div className="border rounded-lg p-4 bg-background shadow-sm">
        <div className="flex justify-between items-center">
          <strong className="text-base sm:text-lg md:text-xl">کوپن</strong>
          <span className="text-sm sm:text-base md:text-lg text-muted-foreground">
            {appliedCoupon ?? "هیچ"}
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyCoupon();
          }}
          className="mt-3 flex flex-col sm:flex-row gap-2"
        >
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="کد کوپن را وارد کنید"
            className="flex-1 border rounded px-3 py-2 text-sm sm:text-base md:text-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <Button
            type="submit"
            className="px-3 py-2 rounded text-sm sm:text-base md:text-lg w-full sm:w-auto"
          >
            اعمال
          </Button>
        </form>

        {appliedCoupon && (
          <div className="mt-2 text-sm sm:text-base md:text-lg text-green-600">
            کوپن {appliedCoupon} اعمال شد
          </div>
        )}
      </div>

      {/* Gifting */}
      <div className="border rounded-lg p-4 bg-background shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium text-base sm:text-lg md:text-xl">
            بسته‌بندی هدیه
          </span>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={giftWrap}
              onChange={() => setGiftWrap((s) => !s)}
              className="w-4 h-4 sm:w-5 sm:h-5 accent-blue-500"
            />
          </label>
        </div>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
          ارسال پیام سفارشی یا بسته‌بندی هدیه (+۲۰۰۰۰)
        </p>
      </div>

      {/* Price Details */}
      <div className="border rounded-lg bg-background p-4 shadow-sm space-y-2">
        <div className="flex justify-between text-sm sm:text-base md:text-lg">
          <span>مبلغ سفارش</span>
          <span>{formatPriceFa(subTotal)} تومان</span>
        </div>
        <div className="flex justify-between text-sm sm:text-base md:text-lg">
          <span>تخفیف کوپن</span>
          <span className="text-green-600">
            - {formatPriceFa(discount)} تومان
          </span>
        </div>
        <div className="flex justify-between text-sm sm:text-base md:text-lg">
          <span>هزینه ارسال</span>
          <span className="text-green-600">
            {shipping === 0
              ? "رایگان"
              : formatPriceFa(shipping)}
          </span>
        </div>
        {giftWrap && (
          <div className="flex justify-between text-sm sm:text-base md:text-lg">
            <span>بسته‌بندی هدیه</span>
            <span>{formatPriceFa((20000))} تومان</span>
          </div>
        )}
        <div className="border-t pt-3 mt-2 flex justify-between font-bold text-base sm:text-lg md:text-xl">
          <span>مبلغ قابل پرداخت</span>
          <span>{formatPriceFa(total)} تومان</span>
        </div>

        <div className="mt-4">
          <Button
            className="w-full text-sm sm:text-base md:text-lg py-2"
            onClick={() => onPlaceOrder?.()}
          >
            ثبت سفارش
          </Button>
        </div>
      </div>
    </aside>
  );
}
