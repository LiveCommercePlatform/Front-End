"use client";

import { useState } from "react";
import {
  User,
  Shield,
  Trash2,
  Ban,
  Unlock,
  UserCog,
  UserMinus,
  Eye,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserCardProps, AdminUser } from "@/types";
import { UserInfoModal } from "./UserDetails";

export default function UserCard({
  name,
  email,
  role,
  status,
  onView,
  onBan,
  onDelete,
  onUpgrade,
}: UserCardProps) {
  const [openDelete, setOpenDelete] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<AdminUser | null>(null);

  return (
    <>
      <div className="flex flex-col gap-4 rounded-lg border bg-card px-4 py-3 hover:bg-muted/40 transition sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium truncate">{name}</span>

              <span
                className={clsx(
                  "text-xs px-2 py-0.5 rounded-full",
                  role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                )}
              >
                {role === "admin" ? "ادمین" : "کاربر"}
              </span>

              <span
                className={clsx(
                  "text-xs",
                  status === "active" ? "text-emerald-600" : "text-red-600"
                )}
              >
                {status === "active" ? "فعال" : "مسدود"}
              </span>
            </div>

            {email && (
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              const u = await onView();
              if (u) setSelected(u);
              setOpen(true);
            }}
          >
            <Eye className="w-4 h-4" />
            مشاهده
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onBan}
            className={clsx(
              "gap-2",
              status === "banned"
                ? "gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900/40 dark:hover:bg-blue-900/20"
                : "gap-1 text-orange-600 border-orange-200 hover:bg-orange-50 dark:border-orange-900/40 dark:hover:bg-orange-900/20"       
            )}     
          >
            {status === "banned" ? (
              <>
                <Unlock className="w-4 h-4" />
                رفع مسدودی
              </>
            ) : (
              <>
                <Ban className="w-4 h-4" />
                مسدود کردن
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onUpgrade}
            className={clsx(
              "gap-2",
              role === "admin"
                ? "gap-1 text-yellow-600 border-yellow-200 hover:bg-yellow-50 dark:border-yellow-900/40 dark:hover:bg-yellow-900/20"
                :"gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900/40 dark:hover:bg-emerald-900/20"
            )}
          >
            {role === "admin" ? (
              <>
                <UserMinus className="w-4 h-4" />
                برداشتن ادمین
              </>
            ) : (
              <>
                <UserCog className="w-4 h-4" />
                ادمین کردن
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpenDelete(true)}
          className="gap-1 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
            حذف
          </Button>
        </div>
      </div>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              حذف کاربر
            </AlertDialogTitle>
            <AlertDialogDescription>
              آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟
              <br />
              این عملیات <span className="font-semibold">قابل بازگشت نیست</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={onDelete}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UserInfoModal open={open} onOpenChange={setOpen} user={selected} />
    </>
  );
}
