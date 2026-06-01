"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useDashboard";
import { MapPinHouse, MapPinned, AlertCircle } from "lucide-react";

type Lev2Props = {
  onBack: () => void;
  onNext: () => void;
};

export function Lev2({ onBack, onNext }: Lev2Props) {
  const { profile, isLoading, isUpdating, updateProfile } = useDashboard();

  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setAddress(profile.address ?? "");
      setPostalCode(profile.postal_code ?? "");
    }
  }, [profile]);

  const handleNext = async () => {
    setError("");

    const trimmedAddress = address.trim();
    const trimmedPostalCode = postalCode.trim();

    if (!trimmedAddress) {
      setError("آدرس را وارد کنید.");
      return;
    }

    if (!trimmedPostalCode) {
      setError("کد پستی را وارد کنید.");
      return;
    }

    const addressChanged = trimmedAddress !== (profile?.address ?? "");
    const postalChanged = trimmedPostalCode !== (profile?.postal_code ?? "");

    if (addressChanged || postalChanged) {
      const ok = await updateProfile({
        address: trimmedAddress,
        postal_code: trimmedPostalCode,
        name: profile?.name,
        phone: profile?.phone,
      });

      if (!ok) {
        setError("ذخیره اطلاعات آدرس انجام نشد. دوباره تلاش کنید.");
        return;
      }
    }

    onNext();
  };

  return (
    <div className="lg:col-span-2">
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
        {/* header (unified like Lev1) */}
        <div className="border-b bg-muted/30 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPinHouse className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">
                  مرحله ۲ از ۳
                </span>

                <h2 className="text-base sm:text-lg font-semibold">
                  اطلاعات ارسال
                </h2>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                آدرس و کد پستی خود را بررسی کنید تا سفارش بدون مشکل ثبت شود.
              </p>
            </div>
          </div>
        </div>

        {/* body */}
        <div className="p-5 space-y-5">
          {isLoading ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-6 text-sm text-muted-foreground text-center">
              در حال دریافت اطلاعات پروفایل...
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">آدرس</label>
                <div className="relative">
                  <MapPinned className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <textarea
                    className="min-h-[110px] w-full rounded-xl border border-border bg-background pr-10 pl-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="آدرس کامل خود را وارد کنید"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">کد پستی</label>
                <input
                  className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="کد پستی ۱۰ رقمی"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
                <p className="text-xs sm:text-sm text-muted-foreground leading-6">
                  لطفاً اطلاعات آدرس را دقیق وارد کنید. این اطلاعات برای ارسال
                  سفارش و جلوگیری از خطا در ثبت نهایی استفاده می‌شود.
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={onBack}
                  disabled={isUpdating}
                  className="w-full sm:w-auto rounded-xl"
                >
                  بازگشت
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={isUpdating}
                  className="w-full sm:w-auto rounded-xl"
                >
                  {isUpdating ? "در حال ذخیره..." : "ادامه به پرداخت"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
