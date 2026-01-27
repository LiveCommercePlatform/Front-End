"use client";

import { useState, useMemo } from "react";
import { toPersianDigits } from "@/lib/utils";
import ListToolbar from "@/components/ui/ListToolbar";

type ProductStatus = "all" | "active" | "inactive";

type Product = {
  id: number;
  title: string;
  price: number;
  status: ProductStatus;
};

export default function ProductsTab() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus>("all");

  const products: Product[] = [
    {
      id: 1,
      title: "دوره آموزش Next.js",
      price: 1200000,
      status: "active",
    },
    {
      id: 2,
      title: "پکیج طراحی UI",
      price: 850000,
      status: "inactive",
    },
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      result = result.filter((p) => p.status === status);
    }

    return result;
  }, [products, search, status]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="جستجوی محصول..."
        filters={[
          {
            key: "status",
            value: status,
            onChange: setStatus,
            options: [
              { label: "همه وضعیت‌ها", value: "all" },
              { label: "فعال", value: "active" },
              { label: "غیرفعال", value: "inactive" },
            ],
          },
        ]}
        actions={
          <button className="px-4 py-2 rounded-lg border bg-primary">
            افزودن محصول جدید
          </button>
        }
      />

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-xl shadow p-4 flex flex-col justify-between border"
          >
            <div>
              <h4 className="font-semibold text-lg mb-2">
                {product.title}
              </h4>

              <p className="text-sm opacity-70 mb-2">
                قیمت: {toPersianDigits(product.price)} تومان
              </p>

              <span
                className={`inline-block text-xs px-3 py-1 rounded-full ${
                  product.status === "active"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {product.status === "active" ? "فعال" : "غیرفعال"}
              </span>
            </div>

            <div className="flex justify-between mt-4 text-sm">
              <button className="text-yellow-600 hover:underline">
                ویرایش
              </button>
              <button className="text-red-500 hover:underline">
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <div className="text-center opacity-60">
          هنوز محصولی ثبت نشده است
        </div>
      )}
    </div>
  );
}
