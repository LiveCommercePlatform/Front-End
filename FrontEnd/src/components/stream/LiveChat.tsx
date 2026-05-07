"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLiveChat } from "@/hooks/useLiveChat";

function getInitial(name: string) {
  return name?.trim()?.[0] ?? "?";
}

export function LiveChat({ id, UserId }: { id: string; UserId: string }) {
  const [text, setText] = useState("");

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const isNearBottomRef = useRef(true);

  const {
    messages,
    sendMessage,
    status,
    currentUserId,
    connectionError,
  } = useLiveChat(id, UserId);

  const canSend = status === "open" && text.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    sendMessage(text.trim());
    setText("");
  };

  const renderedMessages = useMemo(() => {
    return messages.map((msg) => {
      const isMe = msg.userId === currentUserId;
      return {
        ...msg,
        isMe,
        name: isMe ? "شما" : `کاربر ${String(msg.userId).slice(0, 4)}`,
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

  return (
    <Card className="rounded-2xl shadow-lg flex flex-col h-[513px] bg-muted/30 overflow-hidden">
      <CardContent className="flex flex-col flex-1 p-4 py-1 min-h-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">چت زنده</h3>

          <span className="text-[11px] text-muted-foreground">
            {status === "connecting" && "در حال اتصال..."}
            {status === "open" && "متصل"}
            {status === "closed" && "قطع شده"}
          </span>
        </div>

        <div
          ref={messagesRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 overflow-y-auto px-2 "
        >
          <div className="flex flex-col space-y-3">
            {renderedMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 items-start max-w-full",
                  msg.isMe ? "flex-row-reverse text-right" : "text-left"
                )}
              >
                {!msg.isMe ? (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground select-none">
                    {getInitial(msg.name)}
                  </div>
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/30 text-xs font-semibold text-primary select-none">
                    ش
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[80%] min-w-0 flex flex-col",
                    msg.isMe ? "items-end" : "items-start"
                  )}
                >
                  <p
                    className={cn(
                      "text-sm font-medium flex items-center gap-2",
                      msg.isMe ? "flex-row-reverse" : ""
                    )}
                  >
                    {msg.name}
                  </p>

                  <div
                    className={cn(
                      "mt-1 rounded-xl px-3 py-2 text-xs leading-5 break-words whitespace-pre-wrap",
                      msg.isMe
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-background/70 rounded-bl-md"
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
            placeholder={
              status === "open"
                ? "پیامت رو بنویس..."
                : "در حال اتصال به چت..."
            }
            className="flex-1"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={status !== "open"}
          />

          <Button size="icon" type="submit" disabled={!canSend}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
