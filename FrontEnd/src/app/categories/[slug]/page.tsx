// app/category/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";

// داده‌های تمرینی محصول
const mockProducts = [
  {
    index: 1,
    id: "dfkkf;rkferfsef",
    title: "محصول اول",
    description: "توضیح کوتاه درباره محصول اول.",
    bestseller: false,
    image: "/images/product1.jpg",
  },
  {
    index: 2,
    id: "dfkkf;rkferfsef",
    title: "محصول دوم",
    description: "توضیح کوتاه درباره محصول دوم.",
    bestseller: true,
    image: "/images/product2.jpg",
  },
  {
    index: 3,
    id: "dfkkf;rkferfsef",
    title: "محصول سوم",
    description: "توضیح کوتاه درباره محصول سوم.",
    bestseller: true,
    image: "/images/product3.jpg",
  },
  {
    index: 4,
    id: "dfkkf;rkferfsef",
    title: "محصول اول",
    description: "توضیح کوتاه درباره محصول اول.",
    bestseller: true,
    image: "/images/product1.jpg",
  },
  {
    index: 5,
    id: "dfkkf;rkferfsef",
    title: "محصول دوم",
    bestseller: true,
    image: "/images/product2.jpg",
  },
  {
    index: 6,
    id: "dfkkf;rkferfsef",
    title: "محصول سوم",
    description: "توضیح کوتاه درباره محصول سوم.",
    bestseller: true,
    image: "/images/product3.jpg",
  },
  {
    index: 7,
    id: "dfkkf;rkferfsef",
    title: "محصول اول",
    description: "توضیح کوتاه درباره محصول اول.",
    bestseller: true,
    image: "/images/thumbnail.png",
  },
  
];

export default function CategoryPage() {
  const params = useParams();
  const { slug } = params;
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">محصولات در زمینه {slug}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((product) => (
          <ProductCard
            key={product.index}
            id={product.id}
            title={product.title}
            description={product.description}
            bestseller={product.bestseller}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
}
