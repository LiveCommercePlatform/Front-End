"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { CartItemType } from "@/types";
import { isProfileComplete } from "@/lib/api";

type AddToCartInput = Omit<CartItemType, "qty"> & {
  qty?: number;
};

type CartContextType = {
  cart: CartItemType[];
  addToCart: (item: CartItemType) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  getQty: (id: string) => number;
  clearCart: () => void;

  handleAddToCart: (item: AddToCartInput) => Promise<void>;

  profileModalOpen: boolean;
  setProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pendingAdd: boolean;
  setPendingAdd: React.Dispatch<React.SetStateAction<boolean>>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [cart, setCart] = useState<CartItemType[]>([]);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [pendingAdd, setPendingAdd] = useState(false);



  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

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

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => String(i.id) !== String(id)));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prev) =>
      prev.map((i) =>
        String(i.id) === String(id) ? { ...i, qty } : i
      )
    );
  };

  const increase = (id: string) => {
    const item = cart.find((i) => String(i.id) === String(id));
    if (!item) return;
    updateQty(id, item.qty + 1);
  };

  const decrease = (id: string) => {
    const item = cart.find((i) => String(i.id) === String(id));
    if (!item) return;
    updateQty(id, item.qty - 1);
  };

  const getQty = (id: string) => {
    return cart.find((i) => String(i.id) === String(id))?.qty ?? 0;
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleAddToCart = async (itemData: AddToCartInput) => {
    try {
      const check = await isProfileComplete();
      console.log(check);

      if (check.reason === "not_logged_in") {
        toast("برای افزودن به سبد خرید، اول وارد شوید");
        router.push("/login");
        return;
      }

      if (!check.ok) {
        setPendingAdd(true);
        setProfileModalOpen(true);
        return;
      }

      addToCart({
        ...itemData,
        qty: itemData.qty ?? 1,
      });
    } catch (e: any) {
      toast.error(e?.message || "خطا در بررسی پروفایل");
      throw e;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        increase,
        decrease,
        getQty,
        clearCart,
        handleAddToCart,
        profileModalOpen,
        setProfileModalOpen,
        pendingAdd,
        setPendingAdd,
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
