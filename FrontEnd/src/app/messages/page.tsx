"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ListToolbar from "@/components/ui/ListToolbar";
import MessageCard from "@/components/messages/MessageCard";
import MessageDetailsModal from "@/components/messages/MessageDetailsModal";
import { apiFetch } from "@/lib/api";
import NotFound from "@/components/ui/NotFound";
import Pagination from "@/components/ui/Pagination";
import { buildQuery } from "@/lib/utils";

export type MessageStatus = "unread" | "read";

export type Message = {
  id: number;
  name: string;
  email: string;
  content: string;
  status: MessageStatus;
  createdAt: string; // از بک‌اند ممکنه ISO باشه
};

type ListResponse = {
  data: Message[];
  total: number;
  page: number;
  page_size: number;
};

export default function AdminMessagesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MessageStatus | "all">("all");
  const [selected, setSelected] = useState<Message | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [items, setItems] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch(`/admin/messages?${buildQuery({
          page: page,
          page_size: pageSize,
          status: status=="all" ? null : status,
        })}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("دریافت پیام‌ها ناموفق بود.");
      }

      const json = (await res.json()) as ListResponse;
      setItems(json.data || []);
      setTotal(json.total || 0);
    } catch (e: any) {
      toast.error(e?.message || "خطا در دریافت پیام‌ها");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, status]);

  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return items;

    return items.filter((m) => {
      return (
        m.content?.includes(q) || m.email?.includes(q) || m.name?.includes(q)
      );
    });
  }, [items, search]);

  const markRead = async (id: number) => {
    setItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "read" } : m)),
    );
    if (selected?.id === id) setSelected({ ...selected, status: "read" });

    try {
      const res = await apiFetch(`/admin/messages/${id}/read`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("خوانده‌کردن پیام ناموفق بود.");

      toast.success("پیام خوانده شد");
      // اگر می‌خوای دقیقاً مطابق سرور sync بشه:
      // await fetchMessages();
    } catch (e: any) {
      toast.error(e?.message || "خطا در خوانده‌کردن پیام");
      // rollback
      await fetchMessages();
    }
  };

  const deleteMessage = async (id: number) => {
    const prev = items;
    setItems((p) => p.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);

    try {
      const res = await apiFetch(`/admin/messages/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("حذف پیام ناموفق بود.");

      toast.success("پیام حذف شد");
      // total را هم می‌تونی کاهش بدی:
      setTotal((t) => Math.max(0, t - 1));
    } catch (e: any) {
      toast.error(e?.message || "خطا در حذف پیام");
      setItems(prev); // rollback
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6 p-6 sm:p-8 md:p-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">پیام‌های کاربران</h1>

        {/* paging ساده */}
        {/* <div className="flex items-center gap-2 text-sm opacity-80">
          <button
            className="rounded-md border px-3 py-1 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isLoading}
          >
            قبلی
          </button>

          <span>
            صفحه {page} از {totalPages}
          </span>

          <button
            className="rounded-md border px-3 py-1 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isLoading}
          >
            بعدی
          </button>
        </div> */}
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="جستجوی پیام..."
        filters={[
          {
            key: "status",
            value: status,
            onChange: (v: any) => {
              setPage(1); // وقتی فیلتر عوض شد برگرد صفحه ۱
              setStatus(v);
            },
            options: [
              { label: "همه", value: "all" },
              { label: "خوانده نشده", value: "unread" },
              { label: "خوانده شده", value: "read" },
            ],
          },
        ]}
      />

      <div className="space-y-2">
        {isLoading ? (
          <div className="rounded-xl border p-6 text-center opacity-60">
            در حال دریافت پیام‌ها...
          </div>
        ) : (
          <>
            {filtered.map((msg) => (
              <MessageCard
                key={msg.id}
                message={msg}
                onView={() => setSelected(msg)}
              />
            ))}

            {filtered.length === 0 && <NotFound message="" />}
          </>
        )}
      </div>

      <MessageDetailsModal
        message={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onMarkRead={markRead}
        onDelete={deleteMessage}
      />
      <Pagination
        page={page}
        totalItems={total}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
