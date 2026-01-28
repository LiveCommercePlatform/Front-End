"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Search, ShoppingCart, PanelRightOpen, PanelRightClose } from "lucide-react";

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
import { toPersianDigits } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useSidebar } from "@/context/SidebarContext";

export function Navbar() {
  const [search, setSearch] = useState("");
  const { cart } = useCart();
  const { collapsed, toggle } = useSidebar();

  const handleSearch = () => {
    toast(`جستجو برای: ${search}`);
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-12 md:h-14 border-b bg-background">
      <div className="h-full flex items-center justify-between px-3 md:px-4">
        {/* Right section (RTL) */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle}>
            {collapsed ? (
              <PanelRightOpen className="w-5 h-5" />
            ) : (
              <PanelRightClose className="w-5 h-5" />
            )}
          </Button>

          <h1 className="text-[15px] md:text-lg font-bold">📦 سایت من</h1>
        </div>

        {/* Search */}
        <div className="flex-1 mx-3 max-w-xs md:max-w-md hidden sm:block">
          <div className="relative">
            <Input
              placeholder="جستجو..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 md:pr-10 rounded-full text-xs md:text-sm"
            />
            <Button
              onClick={handleSearch}
              size="icon"
              variant="ghost"
              className="absolute top-1/2 -translate-y-1/2 right-1 rounded-full"
            >
              <Search className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>

        {/* Left section */}
        <div className="flex items-center gap-2">
          <ModeToggle />

          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] md:text-xs rounded-full px-1.5">
                {toPersianDigits(cart.length)}
              </span>
            )}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer w-7 h-7 md:w-9 md:h-9">
                <AvatarImage src="https://randomuser.me/api/portraits/men/50.jpg" />
                <AvatarFallback>شما</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>پروفایل</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>تنظیمات</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("خارج شدید")}>
                خروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
