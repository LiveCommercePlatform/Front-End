import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPriceFa = (value?: number) => {
  if (value === undefined || Number.isNaN(value)) return "";
  return value.toLocaleString("fa-IR");
};

export const faToEnDigits = (value: string) =>
  value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

export const enToFaDigits = (value?: string) =>{
  if (value === undefined || Number.isNaN(value)) return ;
  return value.replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);}

export function formatTimeAgo(date: Date | string) {
  const now = new Date();
  const created = typeof date === "string" ? new Date(date) : date;
  const diffMs = now.getTime() - created.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "همین الان";
  if (diffMinutes < 60) return `${formatPriceFa(diffMinutes)} دقیقه پیش`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${formatPriceFa(diffHours)} ساعت پیش`;

  const diffDays = Math.floor(diffHours / 24);
  return `${formatPriceFa(diffDays)} روز پیش`;
}

export function slugifyEn(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // فقط انگلیسی
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function buildQuery(params: Record<string, any>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    sp.set(k, String(v));
  }
  return sp.toString();
}
export function PerDate(when: string | undefined) {
  if (!when) return "نامشخص";

  return new Date(when).toLocaleString("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
