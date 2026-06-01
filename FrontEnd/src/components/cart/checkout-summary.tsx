"use client";

import React from "react";
import { formatPriceFa } from "@/lib/utils";
import { CartItemType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Truck,
  WalletCards,
  ArrowRight,
} from "lucide-react";

type Props = {
  items: CartItemType[];
  currentStep: number;
  onPlaceOrder?: () => void;

  // اضافه شد
  onBack?: () => void;
};

export function CheckoutSummary({
  items,
  currentStep,
  onPlaceOrder,
  onBack,
}: Props) {
  const itemCount = items.reduce((s, it) => s + it.qty, 0);
  const subTotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = subTotal > 0 ? 0 : 0;
  const total = subTotal + shipping;

  const buttonLabel =
    currentStep === 0
      ? "ادامه به مرحله بعد"
      : currentStep === 1
        ? "ادامه به پرداخت"
        : "ثبت سفارش";

  const showBack = currentStep === 1 || currentStep === 2;

  return (
    <aside className="sticky top-4 md:top-6 w-full lg:w-96">
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
        <div className="border-b bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <WalletCards className="h-5 w-5 text-primary" />
            <h3 className="text-sm sm:text-base font-semibold">خلاصه سفارش</h3>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            بررسی نهایی مبلغ قبل از ثبت سفارش
          </p>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between text-sm sm:text-base">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShoppingBag className="h-4 w-4" />
              <span>تعداد کالا</span>
            </div>
            <span className="font-medium">{formatPriceFa(itemCount)} عدد</span>
          </div>

          <div className="flex items-center justify-between text-sm sm:text-base">
            <span className="text-muted-foreground">مبلغ سفارش</span>
            <span className="font-medium">{formatPriceFa(subTotal)} تومان</span>
          </div>

          <div className="flex items-center justify-between text-sm sm:text-base">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>هزینه ارسال</span>
            </div>
            <span className="font-medium text-green-600">
              {shipping === 0 ? "رایگان" : `${formatPriceFa(shipping)} تومان`}
            </span>
          </div>

          {shipping === 0 && subTotal > 0 && (
            <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-3 py-2 text-xs sm:text-sm text-green-700">
              هزینه ارسال سفارش شما رایگان محاسبه شد.
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-lg font-semibold">
                مبلغ قابل پرداخت
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-primary">
                {formatPriceFa(total)} تومان
              </span>
            </div>
          </div>

          {/* actions */}
          <div className="space-y-2">
            <Button
              className="w-full h-11 sm:h-12 rounded-xl text-sm sm:text-base font-semibold"
              onClick={() => onPlaceOrder?.()}
            >
              {buttonLabel}
            </Button>

            {showBack && (
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 sm:h-12 rounded-xl text-sm sm:text-base"
                onClick={() => onBack?.()}
              >
                <ArrowRight className="h-4 w-4 ms-2" />
                برگشت به مرحله قبل
              </Button>
            )}
          </div>

          <p className="text-[11px] sm:text-xs text-center text-muted-foreground leading-5">
            با ادامه فرایند، شما شرایط و قوانین خرید را می‌پذیرید.
          </p>
        </div>
      </div>
    </aside>
  );
}
