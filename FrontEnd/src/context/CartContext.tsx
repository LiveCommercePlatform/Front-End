"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartItemType } from "@/types";

type CartContextType = {
  cart: CartItemType[];
  addToCart: (item: CartItemType) => void;
  removeFromCart: (id: number | string) => void;
  updateQty: (id: number | string, qty: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItemType[]>([]);

  const addToCart = (item: CartItemType) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id:  number | string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id: number | string , qty: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart باید داخل CartProvider استفاده شود");
  return ctx;
};
