// src/app/not-found.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Ghost } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center space-y-6">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted shadow-inner">
        <Ghost className="w-10 h-10 text-muted-foreground" />
      </div>

      <h1 className="text-5xl font-extrabold tracking-tight text-foreground">
        404 - صفحه پیدا نشد
      </h1>

      <p className="text-muted-foreground text-lg max-w-md">
        متأسفیم، صفحه‌ای که دنبالش بودید پیدا نشد. ممکنه حذف شده باشه یا آدرس اشتباهی وارد کرده باشید.
      </p>

      <Link href="/">
        <Button variant="default" size="lg">
          بازگشت به صفحه اصلی
        </Button>
      </Link>
    </div>
  )
}
