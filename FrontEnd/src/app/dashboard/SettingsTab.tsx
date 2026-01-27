"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  postalCode: string;
  email: string;
};

type PasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function SettingsTab() {
  // ===== Profile Form =====
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>();

  // ===== Password Form =====
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>();

  const newPassword = watch("newPassword");

  // ===== password visibility =====
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ===== Profile Submit =====
  const onSubmitProfile = async (data: ProfileFormValues) => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("خطا در ذخیره اطلاعات");

      toast.success("اطلاعات با موفقیت ذخیره شد");
    } catch (error) {
      toast.error("خطا در ارسال اطلاعات");
    }
  };

  // ===== Password Submit =====
  const onSubmitPassword = async (data: PasswordFormValues) => {
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("خطا در تغییر پسورد");

      toast.success("پسورد با موفقیت تغییر کرد");
    } catch (error) {
      toast.error("خطا در تغییر پسورد");
    }
  };

  return (
    <div className="w-full max-w-full space-y-10">
      {/* ===== Profile Form ===== */}
      <form
        onSubmit={handleSubmitProfile(onSubmitProfile)}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">نام</label>
            <input
              {...registerProfile("firstName", { required: "نام الزامی است" })}
              className="w-full border rounded-lg p-2"
              placeholder="نام"
            />
            {profileErrors.firstName && (
              <p className="text-red-500 text-xs mt-1">
                {profileErrors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">نام خانوادگی</label>
            <input
              {...registerProfile("lastName", {
                required: "نام خانوادگی الزامی است",
              })}
              className="w-full border rounded-lg p-2"
              placeholder="نام خانوادگی"
            />
            {profileErrors.lastName && (
              <p className="text-red-500 text-xs mt-1">
                {profileErrors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">شماره تلفن</label>
            <input
              {...registerProfile("phone", {
                required: "شماره تلفن الزامی است",
                pattern: {
                  value: /^09\d{9}$/,
                  message: "شماره تلفن معتبر نیست",
                },
              })}
              className="w-full border rounded-lg p-2"
              placeholder="09xxxxxxxxx"
            />
            {profileErrors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {profileErrors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">کد پستی</label>
            <input
              {...registerProfile("postalCode", {
                required: "کد پستی الزامی است",
                pattern: {
                  value: /^\d{10}$/,
                  message: "کد پستی باید 10 رقم باشد",
                },
              })}
              className="w-full border rounded-lg p-2"
              placeholder="کد پستی"
            />
            {profileErrors.postalCode && (
              <p className="text-red-500 text-xs mt-1">
                {profileErrors.postalCode.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">ایمیل</label>
          <input
            {...registerProfile("email", {
              required: "ایمیل الزامی است",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "ایمیل معتبر نیست",
              },
            })}
            className="w-full border rounded-lg p-2"
            placeholder="example@email.com"
          />
          {profileErrors.email && (
            <p className="text-red-500 text-xs mt-1">
              {profileErrors.email.message}
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <button className="bg-primary mx-10 text-white px-4 py-2 rounded-lg">
            ذخیره اطلاعات
          </button>
        </div>
      </form>

      {/* ===== separator ===== */}
      <div className="h-1 bg-gray-200 rounded-xl" />

      {/* ===== Password Form ===== */}
      <form
        onSubmit={handleSubmitPassword(onSubmitPassword)}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm mb-1">پسورد فعلی</label>
          <div className="relative">
            <input
              {...registerPassword("oldPassword", {
                required: "پسورد فعلی الزامی است",
              })}
              type={showOld ? "text" : "password"}
              className="w-full border rounded-lg p-2 pr-10"
              placeholder="پسورد فعلی"
            />
            <span
              className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowOld((s) => !s)}
            >
              {showOld ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </span>
          </div>
          {passwordErrors.oldPassword && (
            <p className="text-red-500 text-xs mt-1">
              {passwordErrors.oldPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">پسورد جدید</label>
          <div className="relative">
            <input
              {...registerPassword("newPassword", {
                required: "پسورد جدید الزامی است",
                minLength: {
                  value: 6,
                  message: "پسورد باید حداقل 6 کاراکتر باشد",
                },
              })}
              type={showNew ? "text" : "password"}
              className="w-full border rounded-lg p-2 pr-10"
              placeholder="پسورد جدید"
            />
            <span
              className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowNew((s) => !s)}
            >
              {showNew ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </span>
          </div>
          {passwordErrors.newPassword && (
            <p className="text-red-500 text-xs mt-1">
              {passwordErrors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">تکرار پسورد جدید</label>
          <div className="relative">
            <input
              {...registerPassword("confirmPassword", {
                required: "تکرار پسورد الزامی است",
                validate: (value) =>
                  value === newPassword || "پسوردها یکسان نیستند",
              })}
              type={showConfirm ? "text" : "password"}
              className="w-full border rounded-lg p-2 pr-10"
              placeholder="تکرار پسورد"
            />
            <span
              className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowConfirm((s) => !s)}
            >
              {showConfirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </span>
          </div>
          {passwordErrors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {passwordErrors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button className="bg-primary mx-10 text-white px-4 py-2 rounded-lg">
            تغییر رمز عبور{" "}
          </button>
        </div>
      </form>
    </div>
  );
}
