"use client";

import { useState, useMemo, useEffect } from "react";
import ListToolbar from "@/components/ui/ListToolbar";
import UserCard from "@/components/ui/UserCard";
import Pagination from "@/components/ui/Pagination";

type UserStatus = "all" | "active" | "inactive";

type User = {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive";
  role: "admin" | "user";
};

const PAGE_SIZE = 6;

/* ===== Fake Users (mock) ===== */
const USERS: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `کاربر ${i + 1}`,
  email: `user${i + 1}@test.com`,
  status: i % 3 === 0 ? "inactive" : "active",
  role: i % 5 === 0 ? "admin" : "user",
}));

export default function UsersTab() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus>("all");
  const [page, setPage] = useState(1);

  /* ===== Filter users ===== */
  const filteredUsers = useMemo(() => {
    return USERS.filter((u) => {
      const matchSearch =
        !search ||
        u.name.includes(search) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const matchStatus = status === "all" || u.status === status;

      return matchSearch && matchStatus;
    });
  }, [search, status]);

  /* ===== Reset page on filter/search ===== */
  useEffect(() => {
    setPage(1);
  }, [search, status]);

  /* ===== Paginated users ===== */
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="جستجوی کاربر..."
        filters={[
          {
            key: "status",
            value: status,
            onChange: setStatus,
            options: [
              { label: "همه وضعیت‌ها", value: "all" },
              { label: "فعال", value: "active" },
              { label: "غیرفعال", value: "inactive" },
            ],
          },
        ]}
      />

      {/* Users */}
      <div className="space-y-2">
        {paginatedUsers.length > 0 ? (
          paginatedUsers.map((user) => (
            <UserCard
              key={user.id}
              name={user.name}
              email={user.email}
              role={user.role}
              status={user.status === "active" ? "active" : "banned"}
              onView={() => console.log("view", user.id)}
              onBan={() => console.log("ban", user.id)}
              onDelete={() => console.log("delete", user.id)}
            />
          ))
        ) : (
          <div className="rounded-lg border p-6 text-center opacity-60">
            کاربری یافت نشد
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        totalItems={filteredUsers.length}
        onPageChange={setPage}
      />
    </div>
  );
}
