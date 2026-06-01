"use client";

import React, { useState } from "react";
import { Stepper } from "@/components/cart/stepper";
import { CheckoutSummary } from "@/components/cart/checkout-summary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Lottie from "react-lottie-player";
import animationData from "./empty-cart-animation.json";
import { Lev1 } from "./Lev1";
import { Lev2 } from "./Lev2";
import { Lev3 } from "./Lev3";

export default function CartPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { cart, removeFromCart, increase, decrease, clearCart } = useCart();

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
        current={currentStep}
        onChange={(step) => setCurrentStep(step)}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Step Content */}
        {currentStep === 0 && (
          <Lev1
            cart={cart}
            removeFromCart={removeFromCart}
            onIncrease={increase}
            onDecrease={decrease}
          />
        )}

        {currentStep === 1 && (
          <Lev2
            onBack={() => setCurrentStep(0)}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Lev3
            cart={cart}
            onBack={() => setCurrentStep(1)}
            onSuccess={(order) => {
              clearCart();

              // console.log("created order:", order);
            }}
          />
        )}

        {/* summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <CheckoutSummary
            items={cart}
            currentStep={currentStep}
            onPlaceOrder={() => {
              if (currentStep === 0) setCurrentStep(1);
              else if (currentStep === 1) setCurrentStep(2);
              else {
                /* ثبت سفارش */
              }
            }}
            onBack={() => setCurrentStep((s) => Math.max(0, s - 1))}
          />
        </div>
      </div>
    </main>
  );
}
