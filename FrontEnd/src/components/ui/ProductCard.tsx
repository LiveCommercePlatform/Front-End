// components/ui/ProductCard.tsx
"use client";

import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id:string;
  title: string;
  description?: string;
  image: string;
  bestseller?:Boolean;
  price?: string;
}

export default function ProductCard({
  id,
  title,
  description,
  image,
  bestseller,
  price = "$180.00",
}: ProductCardProps) {
  const router = useRouter();
  return (
    <div className="w-full bg-card rounded-3xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-200">
      <div className="bg-gray-50 rounded-2xl w-full h-48 flex justify-center items-center mb-3">
        <Image
          src={image}
          alt={title}
          width={300}
          height={200}
          className="object-contain"
        />
      </div>
      {/* تگ ها با استفاده از boolean  */}
      <div className="w-full text-end ps-5" dir="rtl">
        {bestseller ? <span className="bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full mb-1">
          Best Seller
        </span> : <br/>}
        {/* <span className="bg-red-50 text-red-600 text-xs font-medium px-3 py-1 rounded-full mb-1">
          Best Seller
        </span> */}
      </div>

      <div className="w-full text-start ps-5" dir="rtl">
        <h2 className="text-card-foreground text-lg font-semibold ">{title}</h2>
        {description!=null ? (
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        ) : (<br/>)}
      </div>

      {/* Price and Button */}
      <div className="flex justify-between items-center w-full mt-3">
        <p className="text-green-600 font-bold text-lg">{price}</p>
        <button className="cursor-pointer text-muted-foreground px-4 py-2 rounded-xl font-medium hover:bg-gray-200 hover:text-black flex items-center gap-2"
          onClick={() => router.push(`/product/${id}`)}>
          <ShoppingBag className="w-4 h-4" />
          مشاهده و خرید
        </button>
      </div>
    </div>
  );
}
