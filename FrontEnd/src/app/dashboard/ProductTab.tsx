"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ListToolbar from "@/components/ui/ListToolbar";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ui/ProductCard";
import { ProductStatus, Product } from "@/types/product";

export default function ProductsTab() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus>("all");

  const products: Product[] = [
    {
      id: 1,
      title: "دوره آموزش Next.js",
      price: 1200000,
      status: "active",
      cover: "https://picsum.photos/600/400?1",
    },
    {
      id: 2,
      title: "پکیج طراحی UI",
      price: 850000,
      status: "inactive",
      cover: "https://picsum.photos/600/400?2",
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
          <Button onClick={() => router.push("/new_product")}>
            افزودن محصول جدید
          </Button>
        }
      />

      {/* Products */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              price={product.price}
              status={product.status}
              cover={product.cover}
              onEdit={() => router.push(`/products/${product.id}/edit`)}
              onDelete={() => console.log("delete", product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-muted/30 p-10 text-center text-sm opacity-70">
          هنوز محصولی ثبت نشده است
        </div>
      )}
    </div>
  );
}
