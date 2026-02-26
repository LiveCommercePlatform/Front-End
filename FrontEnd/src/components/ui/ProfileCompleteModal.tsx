"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onCompleted: () => void;
};

type FormValues = {
  name: string;
  phone: string;
  postal_code: string;
  address: string;
};

export default function CompleteProfileModal({
  open,
  onClose,
  onCompleted,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
      phone: "",
      postal_code: "",
      address: "",
    },
  });

  const isValidPhone = (phone: string) => /^09\d{9}$/.test(phone);
  const isValidPostal = (postal: string) => /^\d{10}$/.test(postal);

  // ✅ prefill وقتی مودال باز شد
  useEffect(() => {
    if (!open) return;

    const fetchProfile = async () => {
      try {
        setPrefillLoading(true);

        // این مسیر رو اگر تو بک فرق داره عوض کن
        const res = await apiFetch("/profile/get", { method: "GET" });
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "خطا در دریافت پروفایل");

        const user = data?.user || {};

        // ✅ فقط چیزایی که null/undefined/"" نیست رو می‌ذاریم
        reset({
          name: user.name ?? "",
          phone: user.phone ?? "",
          postal_code: user.postal_code ?? "",
          address: user.address ?? "",
        });
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setPrefillLoading(false);
      }
    };

    fetchProfile();
  }, [open, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!isValidPhone(data.phone)) {
      return toast.error("شماره تماس باید ۱۱ رقم و با 09 شروع شود");
    }
    if (!isValidPostal(data.postal_code)) {
      return toast.error("کد پستی باید ۱۰ رقم باشد");
    }

    try {
      setLoading(true);

      const res = await apiFetch("/profile/update", {
        method: "PUT",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "خطا در ذخیره اطلاعات");
      }

      toast.success("اطلاعات با موفقیت ذخیره شد");
      onCompleted();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="text-right max-w-md">
        <DialogHeader>
          <DialogTitle>تکمیل اطلاعات حساب کاربری</DialogTitle>
        </DialogHeader>

        {prefillLoading ? (
          <div className="py-10 text-center text-sm opacity-70">
            در حال دریافت اطلاعات...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <Input placeholder="نام و نام خانوادگی" {...register("name")} />

            <Input placeholder="شماره تماس (09xxxxxxxxx)" {...register("phone")} />

            <Input placeholder="کد پستی (۱۰ رقمی)" {...register("postal_code")} />

            <Textarea rows={3} placeholder="آدرس کامل" {...register("address")} />

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "در حال ذخیره..." : "ذخیره و ادامه"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
