import { Message } from "@/app/messages/page";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MessageCard({
  message,
  onView,
}: {
  message: Message;
  onView: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/40 transition">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{message.name}</span>
          <Badge
            variant={message.status === "unread" ? "destructive" : "secondary"}
          >
            {message.status === "unread" ? "خوانده نشده" : "خوانده شده"}
          </Badge>
        </div>

        <div className="text-sm opacity-70 line-clamp-1">
          {message.content}
        </div>

        <div className="text-xs opacity-50">{message.createdAt}</div>
      </div>

      <Button variant="outline" size="sm" onClick={onView} className="gap-1">
        <Eye className="w-4 h-4" />
        مشاهده
      </Button>
    </div>
  );
}
