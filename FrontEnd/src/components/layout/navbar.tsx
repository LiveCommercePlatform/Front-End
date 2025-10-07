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
  
  // Get cartCount from context
  const { cart } = useCart();
  const cartCount = cart.length; 

  const handleLogout = () => {
    toast.success("با موفقیت خارج شدید");
  };

  const handleSearch = () => {
    toast(`جستجو برای: ${search}`);
  };

  return (
    <header className="w-full h-14 border-b flex items-center px-4 justify-between bg-background">
      <h1 className="text-xl font-bold">📦 سایت من</h1>

      <div className="flex-1 mx-4 max-w-md">
        <div className="relative">
          <Input
            placeholder="جستجو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 rounded-full"
          />
          <Button
            onClick={handleSearch}
            size="icon"
            variant="ghost"
            className="absolute top-1/2 -translate-y-1/2 right-1 rounded-full"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />

        <Link href="/cart" className="relative">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ShoppingCart className="h-5 w-5" />
          </Button>

          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
              {toPersianDigits(cartCount)}
            </span>
          )}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
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
