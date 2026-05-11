// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import clsx from "clsx";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Button } from "@/components/ui/button";
// import {
//   Home,
//   Plus,
//   LayoutDashboard,
//   Users,
//   Package,
//   Video ,
//   Settings,
// } from "lucide-react";
// import { useSidebar } from "@/context/SidebarContext";
// import { useEffect, useState } from "react";
// import { tokenStore } from "@/lib/token";

// const sidebarItems = [
//   { href: "/", icon: Home, label: "صفحه اصلی" },
//   { href: "/dashboard", icon: LayoutDashboard, label: "داشبورد" },
//   { href: "/products", icon: Package, label: "محصولات" },
//   { href: "/Live_Rooms", icon: Video , label: "لایو استریم ها" },
//   { href: "/products/new", icon: Plus, label: "افزودن محصول" },
//   { href: "/seller", icon: Users, label: "فروشندگان" },
//   { href: "/dashboard/settings", icon: Settings, label: "تنظیمات" },
// ];

// export function Sidebar() {
//   const { collapsed } = useSidebar();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     setIsLoggedIn(!!tokenStore.getAccess());
//   }, []);

//   if (!mounted) return null;
//   return (
//     <aside
//       style={{ width: collapsed ? "4rem" : "14rem" }}
//       className="
//         hidden md:flex fixed top-12 md:top-14 right-0
//         h-[calc(100vh-3rem)] md:h-[calc(100vh-3.5rem)]
//         border-start bg-muted transition-all duration-300 px-2
//       "
//     >
//       <SidebarContent collapsed={collapsed} />
//     </aside>
//   );
// }

// function SidebarButton({
//   isActive,
//   collapsed,
//   Icon,
//   label,
// }: {
//   isActive: boolean;
//   collapsed: boolean;
//   Icon: React.ElementType;
//   label: string;
// }) {
//   return (
//     <Button
//       variant={isActive ? "secondary" : "ghost"}
//       className={clsx(
//         "w-full flex items-center gap-3 justify-start px-3 h-10",
//         collapsed && "justify-center px-0",
//         isActive && "ring-2 ring-primary",
//       )}
//     >
//       <Icon className="w-5 h-5 shrink-0" />
//       {!collapsed && <span className="text-sm whitespace-nowrap">{label}</span>}
//     </Button>
//   );
// }

// function SidebarContent({ collapsed }: { collapsed: boolean }) {
//   const pathname = usePathname();

//   return (
//     <TooltipProvider delayDuration={100}>
//       <div className="flex flex-col gap-2 py-4 w-full">
//         {sidebarItems.map((item) => {
//           const Icon = item.icon;
//           const isActive =
//             pathname === item.href 

//           return (
//             <div key={item.href}>
//               {collapsed ? (
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Link href={item.href}>
//                       <SidebarButton
//                         Icon={Icon}
//                         label={item.label}
//                         isActive={isActive}
//                         collapsed
//                       />
//                     </Link>
//                   </TooltipTrigger>
//                   <TooltipContent side="left">{item.label}</TooltipContent>
//                 </Tooltip>
//               ) : (
//                 <Link href={item.href}>
//                   <SidebarButton
//                     Icon={Icon}
//                     label={item.label}
//                     isActive={isActive}
//                     collapsed={false}
//                   />
//                 </Link>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </TooltipProvider>
//   );
// }
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
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useEffect, useState } from "react";
import { tokenStore } from "@/lib/token";

const sidebarItems = [
  { href: "/", icon: Home, label: "صفحه اصلی" },
  { href: "/dashboard", icon: LayoutDashboard, label: "داشبورد" },
  { href: "/products", icon: Package, label: "محصولات" },
  { href: "/Live_Rooms", icon: Radio, label: "لایو استریم ها" },
  { href: "/products/new", icon: Plus, label: "افزودن محصول" },
  { href: "/seller", icon: Users, label: "فروشندگان" },
  { href: "/dashboard/settings", icon: Settings, label: "تنظیمات" },
];

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
          "fixed inset-0 z-40  transition-opacity bg-background w-40 md:hidden",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />

      <aside
        className={clsx(
          "fixed right-0 top-12 md:top-11 z-50 flex flex-col",
          "h-[calc(100vh-3rem)] md:h-[calc(100vh-3.5rem)]",
          "border-s bg-muted px-2 transition-all duration-300",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0 w-40" : "translate-x-full md:translate-x-0"
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
        isActive && "ring-2 ring-primary"
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

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-col gap-2 py-4 w-full">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

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
