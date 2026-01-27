"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { toPersianDigits } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    verificationCode: "",
  })

  const [isCodeSent, setIsCodeSent] = useState(false)
  const [timer, setTimer] = useState(60)
  const [timerActive, setTimerActive] = useState(false)

  // مدیریت تغییرات ورودی
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const nameRegex = /^[آ-یa-zA-Z\s]{2,}$/

    if (!nameRegex.test(formData.name.trim())) {
      toast.error("❌ نام معتبر نیست. لطفاً فقط حروف وارد کنید.")
      return false
    }
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("❌ ایمیل معتبر نیست. لطفاً فرمت صحیح ایمیل را وارد کنید.")
      return false
    }
    return true
  }

  // شبیه‌سازی ارسال کد تایید
  const handleSendVerificationCode = () => {
    if (!validateInputs()) return
    setIsCodeSent(true)
    setTimerActive(true)
    toast.success("✅ کد تایید به ایمیل شما ارسال شد")

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalId)
          setTimerActive(false)
          setIsCodeSent(false)
          return 60
        }
        return prevTimer - 1
      })
    }, 1000)
  }

  // مدیریت ثبت‌نام
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.")

      toast.success("✅ با موفقیت ثبت‌نام شدید")
    } catch (error) {
      toast.error("❌ خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">ثبت‌نام</CardTitle>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {/* نام */}
            <div className="space-y-1">
              <Label className="mb-2" htmlFor="name">نام</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="نام کامل شما"
              />
            </div>

            {/* ایمیل */}
            <div className="space-y-1">
              <Label className="mb-2" htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="ایمیل شما"
              />
            </div>

            {/* کد تایید ایمیل */}
            <div className="space-y-1">
              <Label className="mb-2" htmlFor="verificationCode">کد تایید ایمیل</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                  required
                  placeholder="کد تایید"
                  disabled={!isCodeSent}
                />
                <Button
                  type="button"
                  onClick={handleSendVerificationCode}
                  disabled={isCodeSent && timerActive}
                >
                  {isCodeSent
                    ? timerActive
                      ? `${toPersianDigits(timer)} ثانیه`
                      : "کد ارسال شد"
                    : "ارسال کد"}
                </Button>
              </div>
            </div>

            {/* رمز عبور */}
            <div className="space-y-1">
              <Label className="mb-2" htmlFor="password">رمز عبور</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="رمز عبور"
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pt-10">
            <Button type="submit" className="w-full" disabled={loading}>
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
  )
}
