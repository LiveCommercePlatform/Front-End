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
  const { cart, updateQty, removeFromCart } = useCart();
  const [selected, setSelected] = useState<Record<string | number, boolean>>(
    {},
  );

  const toggleSelect = (id: number | string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  };

  if (cart.length === 0) {
    return (
      <main
        className="flex flex-col justify-center items-center  p-4 sm:p-6 md:p-8 text-center"
        dir="rtl"
      >
        <Lottie
          loop
          animationData={animationData}
          play
          style={{ width: 300, height: 450 }}
        />
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          سبد خرید شما خالی است
        </h2>
        <p className="text-gray-500 mb-6">
          برای اضافه کردن محصولات، به صفحه اصلی بروید.
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

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8" dir="rtl">
      <Stepper
        steps={["سبد خرید", "آدرس", "پرداخت"]}
        current={currentstep}
        onChange={(step) => setCurrentStep(step)}
      />

      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
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
              <span className="text-sm">
                {formatPriceFa(
                  Object.values(selected).filter(Boolean).length,
                )}
                /{formatPriceFa(cart.length)} موارد انتخاب شده
              </span>
            </div>

            <Button
              size="sm"
              disabled={Object.values(selected).every((v) => !v)}
              onClick={() => {
                const toRemove = Object.keys(selected).filter(
                  (k) => selected[k],
                );
                toRemove.forEach((id) => removeFromCart(Number(id)));
                setSelected({});
              }}
            >
              حذف
            </Button>
          </div>

          {cart.map((it, index) => (
            <CartItem
              key={index}
              item={it}
              onQtyChange={updateQty}
              onRemove={removeFromCart}
              selected={!!selected[it.id]}
              onToggleSelect={toggleSelect}
            />
          ))}
        </div>

        <div className="mt-6 md:mt-0">
          <CheckoutSummary
            items={cart}
            onPlaceOrder={() => alert("Place order pressed")}
          />
        </div>
      </div>
    </main>
  );
}
