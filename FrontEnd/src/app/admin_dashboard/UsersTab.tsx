"use client";

import { useEffect, useMemo } from "react";
import ListToolbar from "@/components/ui/ListToolbar";
import UserCard from "@/components/ui/UserCard";
import Pagination from "@/components/ui/Pagination";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import Loading from "@/components/ui/Loading";
import NotFound from "@/components/ui/NotFound";

type UserStatus = "all" | "active" | "inactive";
const PAGE_SIZE = 6;

export default function UsersTab() {
  const {
    users,
    total,
    params,
    loadingList,
    mutating,
    setParams,
    ban,
    unban,
    remove,
    promote,
    demote,
    fetchUserById,
  } = useAdminUsers({
    initialParams: { page: 1, pageSize: PAGE_SIZE, role: "", search: "" },
  });

  const search = params.search ?? "";
  const page = params.page;

  const status = useMemo<UserStatus>(() => {
    if (!params.role) return "all";
    if (params.role === "banned") return "inactive";
    return "active";
  }, [params.role]);

  useEffect(() => {
    if (params.pageSize !== PAGE_SIZE) {
      setParams((prev) => ({ ...prev, pageSize: PAGE_SIZE }));
    }
    console.log(users);
  }, [params.pageSize, setParams]);

  const handleSearchChange = (value: string) => {
    setParams((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleStatusChange = (value: string) => {
    const nextStatus = value as UserStatus;

    setParams((prev) => ({
      ...prev,
      page: 1,
      role:
        nextStatus === "all"
          ? ""
          : nextStatus === "inactive"
            ? "banned"
            : "user",
    }));
  };

  return (
    <div className="space-y-6">
      <ListToolbar
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="جستجوی کاربر..."
        filters={[
          {
            key: "status",
            value: status,
            onChange: handleStatusChange,
            options: [
              { label: "همه وضعیت‌ها", value: "all" },
              { label: "فعال", value: "active" },
              { label: "غیرفعال", value: "inactive" },
            ],
          },
        ]}
      />

      <div className="space-y-2">
        {loadingList ? (
          <Loading />
        ) : users.length > 0 ? (
          users.map((user) => {
            const isBanned = user.role === "banned";
            const uiStatus = isBanned ? "banned" : "active";

            return (
              <UserCard
                key={user.id}
                name={user.name}
                email={user.email}
                role={user.role}
                status={uiStatus}
                onView={() => fetchUserById(user.id)}
                onBan={() => (isBanned ? void unban(user.id) : void ban(user.id))}
                onDelete={() => void remove(user.id)}
                onUpgrade={() => (user.role =="admin" ? void demote(user.id) : void promote(user.id))}
              />
            );
          })
        ) : (
          <NotFound/>
        )}
      </div>

      <Pagination
        page={page}
        totalItems={total}
        onPageChange={(nextPage) => setParams((prev) => ({ ...prev, page: nextPage }))}
      />

      {mutating ? (
        <Loading text="در حال اعمال تغییرات..."/>
      ) : null}
    </div>
  );
}
