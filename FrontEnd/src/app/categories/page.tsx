"use client";

import { Card, CardContent } from "@/components/ui/card";
import { categories_data } from "@/constant/category-data";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen py-6 px-5">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-14">
        دسته بندی محصولات
      </h1>
      <div className="bg-card max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {categories_data.map((category, index) => (
          <Card
            key={index}
            className="shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden border border-gray-100"
          >
            <div className="flex justify-end px-6">
              <div className="bg-gradient-to-r from-blue-50 to-emerald-50 h-20 w-20 flex justify-center items-center rounded-2xl">
                {category.icon}
              </div>
            </div>
            <CardContent className="text-start px-6">
              <h2 className="text-lg font-bold  mb-3">
                {category.title}
              </h2>
              <p className="text-sm leading-relaxed mb-4">
                {category.description}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => router.push(`/categories/${category.name}`)}
                  className="text-emerald-600 font-medium hover:underline transition">
                  → مشاهده
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
