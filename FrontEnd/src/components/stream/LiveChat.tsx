"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLiveChat } from "@/hooks/useLiveChat";

function getInitial(name?: string) {
  return name?.trim()?.[0] ?? "?";
}

export function LiveChat({ id, UserId, Livestatus }: { id: string; UserId?: string, Livestatus:string; }) {
  const [text, setText] = useState("");

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const isNearBottomRef = useRef(true);

  const {
    messages,
    sendMessage,
    status,
    currentUserId,
    connectionError,
    authRequired,
    canSend,
  } = useLiveChat(id, UserId,Livestatus=="live"? true : false);

  const submitEnabled = canSend && text.trim().length > 0;

  const handleSend = () => {
    const value = text.trim();
    if (!value) return;
    if (!canSend) return;

    sendMessage(value);
    setText("");
  };

  const renderedMessages = useMemo(() => {
    return messages.map((msg) => {
      const isMe = msg.userId === currentUserId;

      return {
        ...msg,
        isMe,
        name:
          msg.userName?.trim() ||
          (isMe ? "شما" : `کاربر ${String(msg.userId ?? "").slice(0, 4)}`),
      };
    });
  }, [messages, currentUserId]);

  const handleScroll = () => {
    const el = messagesRef.current;
    if (!el) return;

    const threshold = 120;
    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;

    isNearBottomRef.current = isNearBottom;
  };

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;

    if (isNearBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const statusLabel =
    status === "connecting"
      ? "در حال اتصال..."
      : status === "open"
        ? authRequired
          ? "فقط خواندنی"
          : "متصل"
        : "قطع شده";

  const inputPlaceholder = authRequired
    ? "برای ارسال نظر ابتدا وارد شوید"
    : status === "open"
      ? "پیامت رو بنویس..."
      : status === "connecting"
        ? "در حال اتصال به چت..."
        : "چت در دسترس نیست";

  return (
    <Card className="rounded-2xl shadow-lg flex flex-col h-[513px] bg-muted/30 overflow-hidden">
      <CardContent className="flex flex-col flex-1 p-4 py-1 min-h-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">چت زنده</h3>

          <span
            className={cn(
              "text-[11px]",
              status === "open"
                ? "text-green-600"
                : status === "connecting"
                  ? "text-amber-600"
                  : "text-muted-foreground",
            )}
          >
            {statusLabel}
          </span>
        </div>

        {connectionError && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {connectionError}
          </div>
        )}

        <div
          ref={messagesRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 overflow-y-auto px-2"
        >
          <div className="flex flex-col space-y-3">
            {renderedMessages.length === 0 && (
              <div className="flex min-h-[200px] flex-1 items-center justify-center">
                <div className="text-center text-sm text-muted-foreground">
                  {status !== "open"
                    ? "چت تمام شده و پیامی موجود نیست."
                    : "هنوز پیامی ارسال نشده است."}
                </div>
              </div>
            )}

            {renderedMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 items-start max-w-full",
                  msg.isMe ? "flex-row-reverse text-right" : "text-left",
                )}
              >
                {!msg.isMe ? (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground select-none">
                    {getInitial(msg.name)}
                  </div>
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/30 text-xs font-semibold text-primary select-none">
                    {getInitial(msg.name)}
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[80%] min-w-0 flex flex-col",
                    msg.isMe ? "items-end" : "items-start",
                  )}
                >
                  <p
                    className={cn(
                      "text-sm font-medium flex items-center gap-2",
                      msg.isMe ? "flex-row-reverse" : "",
                    )}
                  >
                    {msg.name}

                    {msg.pending && (
                      <span className="text-[10px] text-muted-foreground">
                        در حال ارسال...
                      </span>
                    )}
                  </p>

                  <div
                    className={cn(
                      "mt-1 rounded-xl px-3 py-2 text-xs leading-5 break-words whitespace-pre-wrap",
                      msg.isMe
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-background/70 rounded-bl-md",
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            <div className="h-1" />
          </div>
        </div>

        <form
          className="flex gap-2 mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            placeholder={inputPlaceholder}
            className="flex-1"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!canSend}
          />

          <Button size="icon" type="submit" disabled={!submitEnabled}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
