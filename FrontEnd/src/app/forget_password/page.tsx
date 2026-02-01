"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

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
import { apiFetch } from "@/lib/api"

export default function ForgetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // مرحله ۱: ارسال ایمیل
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error("ایمیل را وارد کنید")
      return
    }

    if (!isValidEmail(email)) {
      toast.error("فرمت ایمیل صحیح نیست")
      return
    }

    setLoading(true)

    try {
      const res = await apiFetch(`/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      toast.success("📧 لینک بازیابی ارسال شد")
      setStep(2)
    } catch (err: any) {
      toast.error(err.message || "خطا در ارسال ایمیل")
    } finally {
      setLoading(false)
    }
  }

  // مرحله ۲: تغییر رمز عبور
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || password.length < 6) {
      toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد")
      return
    }

    if (password !== confirmPassword) {
      toast.error("رمز عبور و تکرار آن یکسان نیست")
      return
    }

    setLoading(true)

    try {
      const res = await apiFetch(`/auth/reset-password`,
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      toast.success("✅ رمز عبور با موفقیت تغییر کرد")
    } catch (err: any) {
      toast.error(err.message || "خطا در تغییر رمز عبور")
    } finally {
      setLoading(false)
    }
  }

  return (
<div className="flex h-dvh w-full items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            فراموشی رمز عبور
          </CardTitle>
        </CardHeader>

        {step === 1 && (
          <form onSubmit={handleSendEmail}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">ایمیل</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ایمیل شما"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 pt-6">
              <Button className="w-full" disabled={loading}>
                {loading ? "در حال ارسال..." : "ارسال لینک"}
              </Button>

              <Link href="/login" className="text-sm text-primary">
                بازگشت به ورود
              </Link>
            </CardFooter>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>رمز عبور جدید</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="رمز عبور جدید"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground"
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label>تکرار رمز عبور</Label>
                <Input
                  type="password"
                  placeholder="تکرار رمز عبور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="pt-6">
              <Button className="w-full" disabled={loading}>
                {loading ? "در حال ثبت..." : "تغییر رمز عبور"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
