"use client";

import { useMemo, useState } from "react";
import ListToolbar from "@/components/ui/ListToolbar";
import MessageCard from "@/components/messages/MessageCard";
import MessageDetailsModal from "@/components/messages/MessageDetailsModal";

export type MessageStatus = "unread" | "read";

export type Message = {
  id: number;
  name: string;
  email: string;
  content: string;
  status: MessageStatus;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MessageStatus | "all">("all");
  const [selected, setSelected] = useState<Message | null>(null);

  // Mock messages
  const messages: Message[] = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    name: `کاربر ${i + 1}`,
    email: `user${i + 1}@mail.com`,
    content:
      "سلام، من یک سوال درباره نحوه فروش در لایو داشتم. لطفاً راهنمایی کنید.",
    status: i % 2 === 0 ? "unread" : "read",
    createdAt: "۲ ساعت پیش",
  }));

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      if (search && !m.content.includes(search)) return false;
      if (status !== "all" && m.status !== status) return false;
      return true;
    });
  }, [messages, search, status]);

  return (
    <div className="space-y-6 p-12">
      <h1 className="text-xl font-semibold">پیام‌های کاربران</h1>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="جستجوی پیام..."
        filters={[
          {
            key: "status",
            value: status,
            onChange: setStatus,
            options: [
              { label: "همه", value: "all" },
              { label: "خوانده نشده", value: "unread" },
              { label: "خوانده شده", value: "read" },
            ],
          },
        ]}
      />

      <div className="space-y-2">
        {filtered.map((msg) => (
          <MessageCard
            key={msg.id}
            message={msg}
            onView={() => setSelected(msg)}
          />
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border p-6 text-center opacity-60">
            پیامی یافت نشد
          </div>
        )}
      </div>

      <MessageDetailsModal
        message={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onMarkRead={(id) => console.log("mark read", id)}
        onDelete={(id) => console.log("delete", id)}
      />
    </div>
  );
}
