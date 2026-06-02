import { Message } from "@/app/messages/page";
import { Eye, RefreshCw, MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MessageCard({
  message,
  onView,
  onMarkRead,
}: {
  message: Message;
  onView: () => void;
  onMarkRead: (id: number) => void;
}) {
  return (
    <div
      className={[
        "flex flex-col gap-4 rounded-lg border bg-card px-4 py-3 transition hover:bg-muted/40",
        "sm:flex-row sm:items-center sm:justify-between",
      ].join(" ")}
    >
      {" "}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <MessageCircleIcon className="w-4 h-4" />
            </div>
          <span className="font-medium">{message.name}</span>
          <Badge
            variant={message.status === "unread" ? "destructive" : "secondary"}
          >
            {message.status === "unread" ? "خوانده نشده" : "خوانده شده"}
          </Badge>
        </div>

        {/* <div className="text-sm opacity-70 line-clamp-1">{message.content}</div> */}

        <div className="text-xs opacity-50">{message.createdAt}</div>
      </div>
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <Button size="sm" variant="outline" className="gap-1" onClick={onView}>
          <Eye className="w-4 h-4" />
          مشاهده
        </Button>
        <Button
          onClick={(e) => onMarkRead(message.id)}
          size="sm"
          variant="outline"
          className="gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900/40 dark:hover:bg-blue-900/20"
        >
          <RefreshCw className="w-4 h-4" />
          تغییر وضعیت
        </Button>
      </div>
    </div>
  );
}
