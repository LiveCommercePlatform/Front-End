"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"

type GuardProps = {
  children: React.ReactNode;

  /** نیاز به لاگین */
  requireAuth?: boolean;

  /** فقط مهمان‌ها (مثلاً صفحه login / register) */
  guestOnly?: boolean;

  /** ثبت‌نام کامل شده باشد */
  requireRegistered?: boolean;

  /** نقش‌های مجاز */
  roles?: string[];

  /** مسیر ریدایرکت دلخواه */
  redirectTo?: string;
};

export default function Guard({
  children,
  requireAuth = false,
  guestOnly = false,
  requireRegistered = false,
  roles,
  redirectTo,
}: GuardProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");
    const role = localStorage.getItem("role");

    /* 1️⃣ فقط مهمان */
    if (guestOnly && accessToken) {
      router.replace(redirectTo || "/");
      return;
    }

    /* 2️⃣ نیاز به لاگین */
    if (requireAuth && !accessToken) {
      router.replace(redirectTo || "/login");
      return;
    }

    /* 3️⃣ ثبت‌نام کامل */
    if (requireRegistered && !userId) {
      router.replace(redirectTo || "/register");
      return;
    }

    /* 4️⃣ نقش */
    if (roles && roles.length > 0) {
      if (!role || !roles.includes(role)) {
        router.replace(redirectTo || "/403");
        return;
      }
    }

    setAllowed(true);
  }, [requireAuth, guestOnly, requireRegistered, roles, redirectTo, router]);

  if (!allowed) return null; // یا spinner

  return <>{children}</>;
}
