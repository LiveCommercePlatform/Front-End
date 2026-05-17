"use client";

import React, { useState } from "react";
import { Stepper } from "@/components/cart/stepper";
import { CartItem } from "@/components/cart/cart-item";
import { CheckoutSummary } from "@/components/cart/checkout-summary";
import { formatPriceFa } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Lottie from "react-lottie-player";
import animationData from "./empty-cart-animation.json";

export default function CartPage() {
  const [currentstep, setCurrentStep] = useState(0);
  const { cart, removeFromCart } = useCart();
  const [selected, setSelected] = useState<Record<string | number, boolean>>(
    {}
  );

  const toggleSelect = (id: number | string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  };

  if (cart.length === 0) {
    return (
      <main
        className="flex flex-col justify-center items-center p-6 md:p-10 text-center min-h-[60vh]"
        dir="rtl"
      >
        <Lottie
          loop
          animationData={animationData}
          play
          style={{ width: 260, height: 360 }}
        />

        <h2 className="text-xl sm:text-2xl font-semibold mt-4 mb-2">
          سبد خرید شما خالی است
        </h2>

        <p className="text-muted-foreground mb-6 text-sm sm:text-base">
          برای اضافه کردن محصولات، به صفحه فروشگاه بروید.
        </p>

        <Button
          variant="outline"
          onClick={() => (window.location.href = "/shop")}
        >
          بازگشت به فروشگاه
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 md:py-8" dir="rtl">
      <Stepper
        steps={["سبد خرید", "آدرس", "پرداخت"]}
        current={currentstep}
        onChange={(step) => setCurrentStep(step)}
      />

      {/* layout */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        {/* cart items */}
        <div className="lg:col-span-2 space-y-4">

          {/* select header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border rounded-lg p-3 bg-card">

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cart.length > 0 && cart.every((it) => selected[it.id])}
                onChange={(e) => {
                  if (e.target.checked) {
                    const all: Record<string | number, boolean> = {};
                    cart.forEach((it) => (all[it.id] = true));
                    setSelected(all);
                  } else {
                    setSelected({});
                  }
                }}
              />

              <span className="text-xs sm:text-sm text-muted-foreground">
                {formatPriceFa(
                  Object.values(selected).filter(Boolean).length
                )}
                /
                {formatPriceFa(cart.length)} مورد انتخاب شده
              </span>
            </div>

            <Button
              size="sm"
              variant="destructive"
              className="w-full sm:w-auto"
              disabled={Object.values(selected).every((v) => !v)}
              onClick={() => {
                const toRemove = Object.keys(selected).filter((k) => selected[k]);
                toRemove.forEach((id) => removeFromCart(id));
                setSelected({});
              }}
            >
              حذف موارد انتخاب شده
            </Button>
          </div>

          {/* items */}
          {cart.map((it) => (
            <CartItem
              key={it.id}
              item={it}
              selected={!!selected[it.id]}
              onToggleSelect={toggleSelect}
            />
          ))}
        </div>

        {/* summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <CheckoutSummary
            items={cart}
            onPlaceOrder={() => alert("Place order pressed")}
          />
        </div>
      </div>
    </main>
  );
}
