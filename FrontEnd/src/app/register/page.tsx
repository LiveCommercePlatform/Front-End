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

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // شبیه‌سازی ثبت‌نام
    setTimeout(() => {
      setLoading(false)
      toast.success("✅ با موفقیت ثبت‌نام شدید")
    }, 1500)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">ثبت‌نام</CardTitle>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">نام</Label>
              <Input id="name" type="text" required placeholder="نام کامل شما" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">ایمیل</Label>
              <Input id="email" type="email" required placeholder="ایمیل شما" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">رمز عبور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
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
