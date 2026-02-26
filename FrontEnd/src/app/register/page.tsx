"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { formatPriceFa } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { tokenStore } from "@/lib/token";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [tempTokens, setTempTokens] = useState<{
    accessToken: string;
    refreshToken: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    verificationCode: "",
  });

  // تغییر ورودی‌ها
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // اعتبارسنجی
  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[آ-یa-zA-Z\s]{2,}$/;

    if (!nameRegex.test(formData.name.trim())) {
      toast.error("❌ نام معتبر نیست!");
      return false;
    }

    if (!emailRegex.test(formData.email.trim())) {
      toast.error("❌ ایمیل معتبر نیست!");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("❌ رمز عبور حداقل ۶ کاراکتر باشد!");
      return false;
    }

    return true;
  };

  // تایمر
  const startTimer = () => {
    setTimer(120);
    setTimerActive(true);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          setIsCodeSent(false);
          return 60;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleSendVerificationCode = async () => {
    if (!validateInputs()) return;
    try {
      const res = await apiFetch(`/auth/signup`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(getErrorMessage(data?.error));
      }
      tokenStore.setAuth({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user_id: data.user_id,
        role: data.role,
      });
      setIsCodeSent(true);
      startTimer();
    } catch (err: any) {
      toast.error(getErrorMessage(err.message));
    }
  };

  // ثبت‌نام نهایی
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.verificationCode) {
      toast.error("❌ کد تایید را وارد کنید!");
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch(`/auth/verify`, {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(getErrorMessage(data?.error));
      }
    
      toast.success("✅ ثبت‌نام با موفقیت انجام شد!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "❌ کد تایید نادرست است!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            ثبت‌نام
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {/* نام */}
            <div className="space-y-3">
              <Label htmlFor="name">نام</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="نام شما"
                required
              />
            </div>

            {/* ایمیل */}
            <div className="space-y-3">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                required
              />
            </div>

            {/* رمز عبور */}
            <div className="space-y-3">
              <Label htmlFor="password">رمز عبور</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="******"
                  required
                />
                <button
                  type="button"
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* کد تایید */}
            <div>
              <Label htmlFor="verificationCode">کد تایید</Label>
              <div className="flex gap-2">
                <Input
                  id="verificationCode"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                  disabled={!isCodeSent}
                  placeholder="کد تایید"
                />
                <Button
                  type="button"
                  onClick={handleSendVerificationCode}
                  disabled={timerActive}
                >
                  {timerActive ? `${formatPriceFa(timer)} ثانیه` : "ارسال کد"}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-6">
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isCodeSent}
            >
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </Button>

            <p className="text-sm text-muted-foreground">
              حساب دارید؟{" "}
              <Link href="/login" className="text-primary underline">
                وارد شوید
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
