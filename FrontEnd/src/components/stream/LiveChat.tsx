"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useLiveChat } from "@/hooks/useLiveChat ";

export function LiveChat({ id }: { id: string }) {
  const [text, setText] = useState("");
  const { messages, sendMessage, status, bottomRef } = useLiveChat(id);

  const canSend = status === "open" && text.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    sendMessage(text.trim());
    setText("");
  };

  // اگر خواستی بعداً mapping userId → name/avatar را وصل می‌کنی
  const renderedMessages = useMemo(
    () =>
      messages.map((msg) => ({
        ...msg,
        name: msg.userId === "me" ? "شما" : `کاربر ${msg.userId.slice(0, 4)}`,
        avatar: "/u1.png",
      })),
    [messages]
  );

  return (
    <Card className="rounded-2xl shadow-lg flex flex-col h-[500px] bg-muted/30">
      <CardContent className="flex flex-col flex-1 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">چت زنده</h3>
          <span className="text-[11px] text-muted-foreground">
            {status === "connecting" && "در حال اتصال..."}
            {status === "open" && "متصل"}
            {status === "closed" && "قطع شده"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {renderedMessages.map((msg) => (
            <div
              key={msg.id}
              className="flex gap-3 items-start"
            >
              <img
                src={msg.avatar}
                alt={msg.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium flex items-center gap-2">
                  {msg.name}
                  {msg.pending && (
                    <span className="text-[10px] text-muted-foreground">
                      در حال ارسال...
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground break-words">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form
          className="flex gap-2"
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
          <Button
            size="icon"
            type="submit"
            disabled={!canSend}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
