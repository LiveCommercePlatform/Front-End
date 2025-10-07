"use client"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Home,
  LayoutDashboard,
  Users,
  Settings,
  Menu,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

const sidebarItems = [
  { href: "/", icon: Home, label: "صفحه اصلی" },
  { href: "/dashboard", icon: LayoutDashboard, label: "داشبورد" },
  { href: "/users", icon: Users, label: "کاربران" },
  { href: "/settings", icon: Settings, label: "تنظیمات" },
]

export function SidebarMobile() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex h-full w-16 flex-col items-center border-e bg-muted">
      <SidebarContent />
    </aside>
  )
}

function SidebarContent() {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center gap-4 py-4 rtl">
        {sidebarItems.map((item) => {
          const Icon = item.icon

          // فعال بودن: اگر pathname دقیقاً برابر href باشه، یا با href شروع بشه (برای subpages)
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="icon"
                    className={clsx(
                      "w-10 h-10",
                      isActive && "ring-2 ring-primary"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
