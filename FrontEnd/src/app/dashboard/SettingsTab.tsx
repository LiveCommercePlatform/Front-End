"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { ProfileFormValues, PasswordFormValues } from "@/types";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { apiFetch } from "@/lib/api";
import { useDashboard } from "@/hooks/useDashboard";


export default function SettingsTab() {
  const { profile, refreshProfile } = useDashboard();

  const {
    register: registerProfile,
    handleSubmit: submitProfile,
    reset,
  } = useForm<ProfileFormValues>();

  const {
    register: registerPassword,
    handleSubmit: submitPassword,
    watch,
    reset: resetPassword,
  } = useForm<PasswordFormValues>();

  const newPassword = watch("newPassword");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!profile) return;

    reset({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      postal_code: profile.postal_code || "",
      address: profile.address || "",
    });
  }, [profile, reset]);

  if (!profile) return null;

  const isValidPhone = (phone: string) => /^09\d{9}$/.test(phone);
  const isValidPostalCode = (postal: string) => /^\d{10}$/.test(postal);

  const handleUpdateProfile = async (data: ProfileFormValues) => {
    if (data.phone && !isValidPhone(data.phone)) {
      toast.error("شماره تلفن باید ۱۱ رقم و با 09 شروع شود!");
      return;
    }
    if (data.postal_code && !isValidPostalCode(data.postal_code)) {
      toast.error("کد پستی باید ۱۰ رقم داشته باشد!");
      return;
    }

    try {
      const res = await apiFetch("/profile/update", {
        method: "PUT",
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.error || "خطا در ذخیره اطلاعات!");
      }

      toast.success("اطلاعات با موفقیت ذخیره شد.");
      await refreshProfile(); // 🔥 خیلی مهم
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleChangePassword = async (data: PasswordFormValues) => {
    if (data.newPassword.length < 6) {
      toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      toast.error("رمزهای عبور یکسان نیستند");
      return;
    }

    try {
      const res = await apiFetch("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: data.oldPassword,
          new_password: data.newPassword,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(getErrorMessage(result?.error));
      }

      toast.success("رمز عبور با موفقیت تغییر کرد");
      resetPassword();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="w-full space-y-10">
      <form onSubmit={submitProfile(handleUpdateProfile)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="نام" {...registerProfile("name")} />
          <Input label="ایمیل" disabled {...registerProfile("email")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="شماره تلفن"
            placeholder="09xxxxxxxxx"
            {...registerProfile("phone")}
          />
          <Input label="کد پستی" {...registerProfile("postal_code")} />
        </div>

        <div>
          <label className="block text-sm mb-1">آدرس</label>
          <textarea
            {...registerProfile("address")}
            className="w-full border rounded-lg p-2 min-h-[80px]"
          />
        </div>

        <div className="flex justify-end">
          <button className="bg-primary text-white px-4 py-2 rounded-lg">
            ذخیره اطلاعات
          </button>
        </div>
      </form>

      <div className="h-1 bg-gray-200 rounded-xl" />
      <form onSubmit={submitPassword(handleChangePassword)} className="space-y-4">
        <PasswordInput
          label="پسورد فعلی"
          register={registerPassword("oldPassword")}
          show={showOld}
          toggle={setShowOld}
        />

        <PasswordInput
          label="پسورد جدید"
          register={registerPassword("newPassword")}
          show={showNew}
          toggle={setShowNew}
        />

        <PasswordInput
          label="تکرار پسورد جدید"
          register={registerPassword("confirmPassword")}
          show={showConfirm}
          toggle={setShowConfirm}
        />

        <div className="flex justify-end">
          <button className="bg-primary text-white px-4 py-2 rounded-lg">
            تغییر رمز عبور
          </button>
        </div>
      </form>
    </div>
  );
}


function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input {...props} className="w-full border rounded-lg p-2" />
    </div>
  );
}

function PasswordInput({ label, register, show, toggle }: any) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <div className="relative">
        <input
          {...register}
          type={show ? "text" : "password"}
          className="w-full border rounded-lg p-2 pr-10"
        />
        <span
          className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() => toggle((s: boolean) => !s)}
        >
          {show ? <EyeOff /> : <Eye />}
        </span>
      </div>
    </div>
  );
}
