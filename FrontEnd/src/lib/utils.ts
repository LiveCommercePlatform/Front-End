import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toPersianDigits(input: string | number): string {
  const persianDigits = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"]
  return input
    .toString()
    .replace(/\d/g, (digit) => persianDigits[Number(digit)])
}
export function formatTimeAgo(date: Date | string) {
  const now = new Date()
  const created = typeof date === "string" ? new Date(date) : date
  const diffMs = now.getTime() - created.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffMinutes < 1) return "همین الان"
  if (diffMinutes < 60) return `${toPersianDigits(diffMinutes)} دقیقه پیش`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${toPersianDigits(diffHours)} ساعت پیش`

  const diffDays = Math.floor(diffHours / 24)
  return `${toPersianDigits(diffDays)} روز پیش`
}

export function slugifyEn(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // فقط انگلیسی
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
