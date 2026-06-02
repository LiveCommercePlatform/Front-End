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
  Radio,
  Settings,
  Shield,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useEffect, useMemo, useState } from "react";
import { tokenStore } from "@/lib/token";

const sidebarItems = [
  { href: "/", icon: Home, label: "صفحه اصلی", roles: "all", exact: false },
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "داشبورد",
    roles: "all",
    exact: false,
  },
  {
    href: "/products",
    icon: Package,
    label: "محصولات",
    roles: "all",
    exact: false,
  },
  {
    href: "/Live_Rooms",
    icon: Radio,
    label: "لایو استریم ها",
    roles: "all",
    exact: false,
  },
  {
    href: "/products/new",
    icon: Plus,
    label: "افزودن محصول",
    roles: "all",
    exact: true,
  },
  {
    href: "/orders",
    icon: Users,
    label: "سفارشات من",
    roles: "all",
    exact: false,
  },
  {
    href: "/dashboard/settings",
    icon: Settings,
    label: "تنظیمات",
    roles: "all",
    exact: true,
  },
  {
    href: "/admin_dashboard",
    icon: Shield,
    label: "ادمین پنل",
    roles: "admin",
    exact: false,
  },
] as const;

const normalizePath = (path: string) => {
  if (!path) return "/";
  return path === "/" ? "/" : path.replace(/\/+$/, "");
};

const isPathMatch = (pathname: string, href: string, exact?: boolean) => {
  const current = normalizePath(pathname);
  const target = normalizePath(href);

  if (exact) return current === target;
  if (target === "/") return current === "/";

  return current === target || current.startsWith(target + "/");
};

export function Sidebar() {
  const { collapsed, mobileOpen, closeMobileSidebar } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isLoggedIn = !!tokenStore.getAccess();
    if (!isLoggedIn) {
      closeMobileSidebar();
    }
  }, [closeMobileSidebar]);

  if (!mounted) return null;

  return (
    <>
      <div
        onClick={closeMobileSidebar}
        className={clsx(
          "fixed inset-0 z-40 transition-opacity bg-background/80 md:hidden",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      />

      <aside
        className={clsx(
          "fixed right-0 top-12 md:top-11 z-50 flex flex-col",
          "h-[calc(100vh-3rem)] md:h-[calc(100vh-3.5rem)]",
          "border-s bg-muted px-2 transition-all duration-300",
          "md:translate-x-0",
          mobileOpen
            ? "translate-x-0 w-40"
            : "translate-x-full md:translate-x-0",
        )}
        style={{
          width: collapsed ? "4rem" : mobileOpen ? "" : "14rem",
        }}
      >
        <SidebarContent
          collapsed={collapsed}
          onItemClick={closeMobileSidebar}
        />
      </aside>
    </>
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

function SidebarContent({
  collapsed,
  onItemClick,
}: {
  collapsed: boolean;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();
  const userRole = tokenStore.getRole();

  const visibleItems = useMemo(() => {
    return sidebarItems.filter(
      (item) => item.roles === "all" || item.roles === userRole,
    );
  }, [userRole]);

  const activeHref = useMemo(() => {
    const matchedItems = visibleItems.filter((item) =>
      isPathMatch(pathname, item.href, item.exact),
    );

    if (matchedItems.length === 0) return null;

    return matchedItems.sort(
      (a, b) => normalizePath(b.href).length - normalizePath(a.href).length,
    )[0].href;
  }, [pathname, visibleItems]);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-col gap-2 py-4 w-full">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === activeHref;

          return (
            <div key={item.href}>
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.href} onClick={onItemClick}>
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
                <Link href={item.href} onClick={onItemClick}>
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
