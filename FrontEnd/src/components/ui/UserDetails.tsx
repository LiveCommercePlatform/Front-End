"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type UserDetails = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  postal_code?: string | null;
  role: "user" | "admin" | "banned" | string;
  verified?: boolean;
  created_at?: string;
  updated_at?: string;
};

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-2">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="col-span-2 text-sm break-words">{value ?? "—"}</div>
    </div>
  );
}

export function UserInfoModal({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserDetails | null;
}) {
  const verified = !!user?.verified;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="text-right ">
          <DialogTitle className="flex items-center justify-between gap-3 text-right">
            <span>اطلاعات کاربر</span>
          </DialogTitle>
        </DialogHeader>

        {!user ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            کاربری انتخاب نشده است.
          </div>
        ) : (
          <div className="space-y-2">
            <Field label="نام" value={user.name || "—"} />
            <Field label="ایمیل" value={user.email || "—"} />
            <Field label="شماره تماس" value={user.phone || "—"} />

            <Separator className="my-2" />

            <Field label="آدرس" value={user.address || "—"} />
            <Field label="کد پستی" value={user.postal_code || "—"} />

            <Separator className="my-2" />

            <Field label="تاریخ ایجاد" value={formatDate(user.created_at)} />
            <Field
              label="آخرین بروزرسانی"
              value={formatDate(user.updated_at)}
            />
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {user ? (
            <div className="flex items-center gap-2">
              <Badge variant={verified ? "default" : "secondary"}>
                {verified ? "تأیید شده" : "تأیید نشده"}
              </Badge>

              <Badge
                className={
                  user.role === "admin"
                    ? "border-emerald-600 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-700"
                    : user.role === "banned"
                      ? "border-rose-600 text-rose-700 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-700"
                      : "border-slate-300 text-slate-700 bg-slate-50 dark:bg-slate-900/30 dark:text-slate-200 dark:border-slate-700"
                }
              >
                {user.role === "admin"
                  ? "ادمین"
                  : user.role === "user"
                    ? "کاربر"
                    : user.role === "banned"
                      ? "مسدود"
                      : user.role}
              </Badge>
            </div>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
