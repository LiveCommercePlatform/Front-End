"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Message } from "@/app/messages/page";

export default function MessageDetailsModal({
  message,
  open,
  onClose,
  onMarkRead,
  onDelete,
}: {
  message: Message | null;
  open: boolean;
  onClose: () => void;
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg text-right">
        <DialogHeader>
          <DialogTitle>جزئیات پیام</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div>
            <strong>نام:</strong> {message.name}
          </div>
          <div>
            <strong>ایمیل:</strong> {message.email}
          </div>
          <div>
            <strong>پیام:</strong>
            <p className="mt-1 opacity-80 leading-relaxed">
              {message.content}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          {message.status === "unread" && (
            <Button
              variant="secondary"
              onClick={() => onMarkRead(message.id)}
            >
              علامت‌گذاری به‌عنوان خوانده‌شده
            </Button>
          )}

          <Button
            variant="destructive"
            onClick={() => onDelete(message.id)}
          >
            حذف پیام
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
