"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, ShieldCheck, AlertCircle } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";

type CartItemType = {
  id: string | number;
  quantity?: number;
  qty?: number;
  price?: number;
};

type Lev3Props = {
  cart: CartItemType[];
  onBack: () => void;
  onSuccess?: (order: any) => void;
};

export function Lev3({ cart, onBack, onSuccess }: Lev3Props) {
  const { createOrder, mutating, error: orderError } = useOrders({autoStart : false});
  const [localError, setLocalError] = useState("");

  const itemsCount = cart.length;

  const totalQty = useMemo(() => {
    return cart.reduce((sum, it) => {
      const q = Number(it.quantity ?? it.qty ?? 1);
      return sum + (Number.isFinite(q) ? q : 1);
    }, 0);
  }, [cart]);

  const handleCreateOrder = async () => {
    setLocalError("");

    if (cart.length === 0) {
      setLocalError("سبد خرید خالی است. امکان ثبت سفارش وجود ندارد.");
      return;
    }

    const order = await createOrder({
      items: cart.map((it) => ({
        product_id: String(it.id),
        qty: Number(it.quantity ?? it.qty ?? 1),
      })),
      live_room_id: null,
    });

    if (!order) {
      setLocalError("ثبت سفارش ناموفق بود. دوباره تلاش کنید.");
      return;
    }

    onSuccess?.(order);
  };

  const error = localError || orderError || "";

  return (
    <div className="lg:col-span-2">
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
        {/* header */}
        <div className="border-b bg-muted/30 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CreditCard className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">
                  مرحله ۳ از ۳
                </span>

                <h2 className="text-base sm:text-lg font-semibold">پرداخت</h2>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                پرداخت فعلاً ماک است؛ با تایید، سفارش در سیستم ثبت می‌شود.
              </p>
            </div>
          </div>
        </div>

        {/* body */}
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
              <p className="text-xs text-muted-foreground">تعداد آیتم‌ها</p>
              <p className="mt-1 text-sm font-semibold">{itemsCount}</p>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
              <p className="text-xs text-muted-foreground">مجموع تعداد</p>
              <p className="mt-1 text-sm font-semibold">{totalQty}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-4">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
              <p className="text-sm leading-6 text-muted-foreground">
                این بخش درگاه پرداخت واقعی نیست. با کلیک روی «ثبت نهایی سفارش»،
                سفارش با همین اطلاعات در بک‌اند ثبت می‌شود.
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-600">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={mutating}
              className="w-full rounded-xl sm:w-auto"
            >
              بازگشت
            </Button>

            <Button
              onClick={handleCreateOrder}
              disabled={mutating || cart.length === 0}
              className="w-full rounded-xl sm:w-auto"
            >
              {mutating ? "در حال ثبت سفارش..." : "ثبت نهایی سفارش"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
