"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Home,
  Plus,
  LayoutDashboard,
  Users,
  Package,
  Settings,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

const sidebarItems = [
  { href: "/", icon: Home, label: "صفحه اصلی" },
  { href: "/dashboard", icon: LayoutDashboard, label: "داشبورد" },

  // --- Domain ---
  { href: "/products", icon: Package, label: "محصولات" },

  // --- Action ---
  { href: "/products/new", icon: Plus, label: "افزودن محصول" },

  // --- Management ---
  { href: "/users", icon: Users, label: "کاربران" },

  // --- System ---
  { href: "/settings", icon: Settings, label: "تنظیمات" },
];

export function Sidebar() {
  const { collapsed } = useSidebar();

  return (
    <aside
      style={{ width: collapsed ? "4rem" : "14rem" }}
      className="
        hidden md:flex fixed top-12 md:top-14 right-0
        h-[calc(100vh-3rem)] md:h-[calc(100vh-3.5rem)]
        border-start bg-muted transition-all duration-300 px-2
      "
    >
      <SidebarContent collapsed={collapsed} />
    </aside>
  );
}

function SidebarButton({
  isActive,
  collapsed,
  Icon,
  label,
}: {
  isActive: boolean;
  collapsed: boolean;
  Icon: React.ElementType;
  label: string;
}) {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={clsx(
        "w-full flex items-center gap-3 justify-start px-3 h-10",
        collapsed && "justify-center px-0",
        isActive && "ring-2 ring-primary",
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!collapsed && <span className="text-sm whitespace-nowrap">{label}</span>}
    </Button>
  );
}

function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-col gap-2 py-4 w-full">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <div key={item.href}>
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <SidebarButton
                        Icon={Icon}
                        label={item.label}
                        isActive={isActive}
                        collapsed
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="left">{item.label}</TooltipContent>
                </Tooltip>
              ) : (
                <Link href={item.href}>
                  <SidebarButton
                    Icon={Icon}
                    label={item.label}
                    isActive={isActive}
                    collapsed={false}
                  />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
