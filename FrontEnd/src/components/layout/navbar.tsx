"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  PanelRightOpen,
  PanelRightClose,
  LogOut,
  Settings,
  LogIn,
  Menu,
} from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatPriceFa } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useSidebar } from "@/context/SidebarContext";
import { tokenStore } from "@/lib/token";
import { logoutRequest } from "@/lib/auth";

export function Navbar() {
  const [search, setSearch] = useState("");
  const { cart } = useCart();
  const { collapsed, toggleCollapsed, toggleMobileOpen } = useSidebar();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!tokenStore.getAccess());
  }, []);

  if (!mounted) return null;
  const handleSearch = () => {
    toast(`جستجو برای: ${search}`);
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();

      toast.success("با موفقیت خارج شدید");
      router.push("/login");
      router.refresh();
    } catch (err) {
      toast.error("خطا در خروج");
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-12 md:h-14 border-b bg-background">
      <div className="h-full flex items-center justify-between px-3 md:px-4">
        {/* Right section */}
        <div className="flex items-center gap-2">
         <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobileOpen}
        className="md:hidden"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Desktop */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCollapsed}
        className="hidden md:flex"
      >
        {collapsed ? (
          <PanelRightOpen className="w-5 h-5" />
        ) : (
          <PanelRightClose className="w-5 h-5" />
        )}
      </Button>

          <h1 className="text-[15px] md:text-lg font-bold">📦 سایت من</h1>
        </div>

        {/* Left section */}
        <div className="flex items-center gap-2">
          <ModeToggle />

          {/* Cart */}

          {isLoggedIn && (
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
              </Button>

              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] md:text-xs rounded-full px-1.5">
                  {formatPriceFa(cart.length)}
                </span>
              )}
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer w-7 h-7 md:w-9 md:h-9">
                <AvatarImage src="/user1.svg" />
                <AvatarFallback>شما</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="
      w-40
      rounded-xl
      border
      bg-white dark:bg-zinc-900
      text-foreground
      shadow-xl
      mx-4
    "
            >
              <DropdownMenuLabel
                onClick={() => router.push("/dashboard")}
                className="text-right text-sm opacity-80"
              >
                حساب کاربری
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer justify-end gap-2"
                onClick={() => router.push("/profile/settings")}
              >
                تنظیمات
                <Settings className="w-4 h-4" />
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={
                  isLoggedIn ? handleLogout : () => router.push("/login")
                }
                className={`cursor-pointer justify-end gap-2 ${
                  isLoggedIn
                    ? "text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/30"
                    : "text-blue-600 focus:text-blue-600 focus:bg-blue-50 dark:focus:bg-blue-900/30"
                }`}
              >
                {isLoggedIn ? (
                  <>
                    خروج
                    <LogOut className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    ورود
                    <LogIn className="w-4 h-4" />
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
