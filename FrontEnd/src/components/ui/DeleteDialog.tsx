"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function DeleteDialog({
  trigger,
  title = "حذف استریم",
  buttonText = "خذف شود",
  description = "آیا از حذف این استریم مطمئن هستید؟ این عملیات غیرقابل بازگشت است.",
  onConfirm,
}: {
  trigger: React.ReactNode;
  title?: string;
  buttonText?: string;
  description?: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader className="text-right">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-row-reverse">
          <AlertDialogCancel>انصراف</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
          >
           {buttonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}