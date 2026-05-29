"use client";

import { usePathname, useRouter } from "next/navigation";
import Guard from "@/components/auth/Guard";
import { useDashboard } from "@/context/DashboardContext";
import Loading from "@/components/ui/Loading";

const tabs = [
  { key: "products", label: "محصولات من" },
  { key: "lives", label: "استریم‌ها" },
  { key: "users", label: "مدیریت کاربران" },
  { key: "settings", label: "پروفایل کاربری" },
];

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentTab = pathname.split("/").at(-1);
  
 
  const { profile, isLoading} = useDashboard();
if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading /> {/* یا هر کامپوننت لودینگ دیگری که دارید */}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        پروفایل یافت نشد!
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 md:p-6">
      <div className="flex items-center gap-3 md:gap-6 mb-6">
        <img
          src="/user1.svg"
          alt="Profile"
          className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 "
        />
        <div>
          <h2 className="text-base md:text-2xl font-semibold">
            {profile.name}
          </h2>
          <p className="text-xs md:text-sm">خوش آمدید به داشبورد</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative mb-6">
        <div className="flex justify-around items-center bg-card py-2 px-4 rounded-full shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => router.push(`/dashboard/${tab.key}`)}
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Guard requireAuth>
      <DashboardShell>{children}</DashboardShell>
    </Guard>
  );
}
