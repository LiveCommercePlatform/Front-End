// app/category/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";

// داده‌های تمرینی محصول
const mockProducts = [
  {
    id: 1,
    title: "محصول اول",
    description: "توضیح کوتاه درباره محصول اول.",
    image: "/images/product1.jpg",
  },
  {
    id: 2,
    title: "محصول دوم",
    description: "توضیح کوتاه درباره محصول دوم.",
    image: "/images/product2.jpg",
  },
  {
    id: 3,
    title: "محصول سوم",
    description: "توضیح کوتاه درباره محصول سوم.",
    image: "/images/product3.jpg",
  },
  {
    id: 1,
    title: "محصول اول",
    description: "توضیح کوتاه درباره محصول اول.",
    image: "/images/product1.jpg",
  },
  {
    id: 2,
    title: "محصول دوم",
    description: "توضیح کوتاه درباره محصول دوم.",
    image: "/images/product2.jpg",
  },
  {
    id: 3,
    title: "محصول سوم",
    description: "توضیح کوتاه درباره محصول سوم.",
    image: "/images/product3.jpg",
  },
  {
    id: 1,
    title: "محصول اول",
    description: "توضیح کوتاه درباره محصول اول.",
    image: "/images/product1.jpg",
  },
  
];

export default function CategoryPage() {
  const params = useParams();
  const { slug } = params;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">صفحه {slug}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            description={product.description}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
}
