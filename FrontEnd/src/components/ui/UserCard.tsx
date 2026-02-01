"use client";

import { useState } from "react";
import { User, Shield, Trash2, Ban } from "lucide-react";
import clsx from "clsx";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

type UserCardProps = {
  name: string;
  email?: string;
  role: "admin" | "user";
  status: "active" | "banned";
  onView?: () => void;
  onBan?: () => void;
  onDelete?: () => void;
};

export default function UserCard({
  name,
  email,
  role,
  status,
  onView,
  onBan,
  onDelete,
}: UserCardProps) {
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <>
      {/* ===== User Card ===== */}
      <div className="flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-2 hover:bg-muted/40 transition">
        {/* User info */}
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
                    : "bg-blue-100 text-blue-700",
                )}
              >
                {role === "admin" ? "ادمین" : "کاربر"}
              </span>

              <span
                className={clsx(
                  "text-xs",
                  status === "active" ? "text-emerald-600" : "text-red-600",
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

        {/* Actions */}
        <TooltipProvider>
          <div className="flex items-center gap-1 shrink-0">
            {/* View */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onView}
                  className="
                    text-blue-600
                    hover:bg-blue-50
                    dark:hover:bg-blue-900/30
                  "
                >
                  <Shield className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-blue-600 text-white border-none shadow-md">
                مشاهده
              </TooltipContent>
            </Tooltip>

            {/* Ban */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onBan}
                  disabled={status === "banned"}
                  className="
                    text-yellow-600
                    hover:bg-yellow-50
                    dark:hover:bg-yellow-900/30
                    disabled:opacity-40
                  "
                >
                  <Ban className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-yellow-500 text-black border-none shadow-md">
                مسدود کردن
              </TooltipContent>
            </Tooltip>

            {/* Delete */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setOpenDelete(true)}
                  className="
                    text-red-600
                    hover:bg-red-50
                    dark:hover:bg-red-900/30
                  "
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-red-600 text-white border-none shadow-md">
                حذف کاربر
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* ===== Delete Confirm Modal ===== */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              حذف کاربر
            </AlertDialogTitle>
            <AlertDialogDescription >
              آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟
              <br />
              این عملیات <span className="font-semibold">قابل بازگشت نیست</span>
              .
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
    </>
  );
}
