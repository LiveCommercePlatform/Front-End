// components/ui/ProductCard.tsx
"use client";

import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  title: string;
  description?: string;
  image: string;
  price?: string;
}

export default function ProductCard({
  title,
  description,
  image,
  price = "$180.00",
}: ProductCardProps) {
  return (
    <div className="w-full bg-white rounded-3xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-200">
      {/* Product Image */}
      <div className="bg-gray-50 rounded-2xl w-full h-48 flex justify-center items-center mb-3">
        <Image
          src={image}
          alt={title}
          width={180}
          height={180}
          className="object-contain"
        />
      </div>

      <div className="w-full text-end ps-5" dir="rtl">
        <span className="bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full mb-1">
          Best Seller
        </span>
        <span className="bg-red-50 text-red-600 text-xs font-medium px-3 py-1 rounded-full mb-1">
          Best Seller
        </span>
      </div>

      <div className="w-full text-start ps-5" dir="rtl">
        <h2 className="text-gray-800 text-lg font-semibold ">{title}</h2>
        {description && (
          <p className="text-gray-500 text-sm mt-1">{description}</p>
        )}
      </div>

      {/* Price and Button */}
      <div className="flex justify-between items-center w-full mt-3">
        <p className="text-green-600 font-bold text-lg">{price}</p>
        <button className="bg-black text-white px-4 py-2 rounded-xl font-medium hover:bg-gray-800 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          مشاهده و خرید
        </button>
      </div>
    </div>
  );
}
