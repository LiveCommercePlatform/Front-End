"use client";

import React from "react";
import { CartItem } from "@/components/cart/cart-item";
import { ShoppingCart } from "lucide-react";

type Lev1Props = {
  cart: any[];
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  removeFromCart: (id: string) => void;
};

export function Lev1({ cart, removeFromCart, onDecrease, onIncrease }: Lev1Props) {
  return (
    <div className="lg:col-span-2">
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
        {/* header (unified) */}
        <div className="border-b bg-muted/30 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShoppingCart className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">
                  مرحله ۱ از ۳
                </span>

                <h2 className="text-base sm:text-lg font-semibold">سبد خرید</h2>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                محصولات انتخاب‌شده را بررسی کنید و در صورت نیاز تعداد را تغییر دهید.
              </p>
            </div>
          </div>
        </div>

        {/* body */}
        <div className="p-5">
          {cart.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
              <p className="text-sm font-medium">سبد خرید شما خالی است</p>
              <p className="mt-1 text-sm text-muted-foreground">
                برای ادامه، ابتدا یک محصول به سبد خرید اضافه کنید.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((it) => (
                <CartItem
                  key={it.id}
                  item={it}
                  onIncrease={onIncrease}
                  onDecrease={onDecrease}
                  onRemove={() => removeFromCart(String(it.id))}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
