"use client";

import { usePathname, useRouter } from "next/navigation";
import Guard from "@/components/auth/Guard";
// import { useDashboard } from "@/context/DashboardContext";
import Loading from "@/components/ui/Loading";
import { tokenStore } from "@/lib/token";

const tabs = [
  { key: "reports", label: "گزارشات" },
  { key: "lives", label: "استریم‌ها" },
  { key: "users", label: "کاربران" },
  { key: "orders", label: "سفارشات" },
];

function AdminDashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentTab = pathname.split("/").at(-1);

  return (
    <div className="min-h-screen p-3 md:p-6">
      {/* <div className="flex items-center gap-3 md:gap-6 mb-6">
        <div>
          <h2 className="text-base md:text-2xl font-semibold">
            پنل مدیریت ادمین
          </h2>
        </div>
      </div> */}

      {/* Tabs */}
      <div className="relative mb-6">
        <div className="flex justify-around items-center bg-card py-2 px-4 rounded-full shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => router.push(`/admin_dashboard/${tab.key}`)}
              className={`px-3 py-2 text-xs md:text-lg font-semibold transition-all ${
                currentTab === tab.key
                  ? "text-primary"
                  : "text-forground hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Guard requireAuth roles={["admin"]}>
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </Guard>
  );
}
