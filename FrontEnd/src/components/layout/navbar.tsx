"use client";

import Link from "next/link";
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
import { toast } from "react-hot-toast";
import { ShoppingCart, Search } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const [search, setSearch] = useState("");

  const { cart } = useCart();
  const cartCount = cart.length;

  const handleLogout = () => {
    toast.success("با موفقیت خارج شدید");
  };

  const handleSearch = () => {
    toast(`جستجو برای: ${search}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 md:h-14 border-b flex items-center px-3 md:px-4 justify-between bg-background">
      <h1 className="text-[15px] md:text-md lg:text-lg font-bold">
        📦 سایت من
      </h1>

      <div className="flex-1 mx-2 md:mx-4 max-w-xs md:max-w-md">
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

      <div className="flex items-center md:gap-2">
        <ModeToggle className="w-4 md:w-9" />
        <Link href="/cart" className="relative">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ShoppingCart className="h-3 w-4 md:h-5 md:w-5" />
          </Button>

          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] md:text-xs rounded-full px-1.5 py-0.5">
              {toPersianDigits(cartCount)}
            </span>
          )}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer w-6 h-6 md:w-9 md:h-9">
              <AvatarImage src="https://randomuser.me/api/portraits/men/50.jpg" />
              <AvatarFallback>شما</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>پروفایل</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>تنظیمات</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>خروج</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
