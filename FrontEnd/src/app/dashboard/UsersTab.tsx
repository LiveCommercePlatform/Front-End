"use client";

import { useState, useMemo } from "react";
import ListToolbar from "@/components/ui/ListToolbar";

type UserStatus = "all" | "active" | "inactive";

type User = {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
};

export default function UsersTab() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus>("all");

  const users: User[] = [
    {
      id: 1,
      name: "علی رضایی",
      email: "ali@test.com",
      status: "active",
    },
  ];

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (search) {
      result = result.filter(
        (u) =>
          u.name.includes(search) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      result = result.filter((u) => u.status === status);
    }

    return result;
  }, [users, search, status]);

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

      {/* Users Table */}
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="border-b">
            <tr>
              <th className="px-4 py-3 font-medium">نام</th>
              <th className="px-4 py-3 font-medium">ایمیل</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b last:border-b-0 hover:bg-muted/40 transition-colors"
              >
                <td className="px-4 py-3 font-medium">{user.name}</td>

                <td className="px-4 py-3 opacity-80">{user.email}</td>

                <td className="px-4 py-3">
                  <span
                    className={`font-medium ${
                      user.status === "active"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {user.status === "active" ? "فعال" : "غیرفعال"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <button className="text-sm hover:underline">مشاهده</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="p-4 text-center opacity-60">کاربری یافت نشد</div>
        )}
      </div>
    </div>
  );
}
