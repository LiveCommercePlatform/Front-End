import { TriangleAlert } from "lucide-react";

export default function NotFound({
  title = "موردی یافت نشد",
  message = "متأسفانه اطلاعاتی برای نمایش وجود ندارد.",
  action,
}: {
  title?: string;
  message?: string;
  action?: React.ReactNode; 
}) {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center text-center p-6">
      <TriangleAlert className="h-14 w-14 text-destructive mb-4" />

      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <p className="text-muted-foreground mt-2 max-w-md">{message}</p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
