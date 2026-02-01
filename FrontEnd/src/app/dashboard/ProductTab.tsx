"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import ListToolbar from "@/components/ui/ListToolbar";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ui/ProductCard";
import { ProductStatus, Product } from "@/types";
import Pagination from "@/components/ui/Pagination";

const PAGE_SIZE = 9;

const PRODUCTS: Product[] = [
    ...Array.from({ length: 12 }).map((_, i) => ({
    id: `${i + 3}`,
    title: `محصول ${i + 3}`,
    price: 500000 + i * 10000,
    status: i % 2 === 0 ? "active" : "inactive",
    cover: `https://picsum.photos/600/400?${i + 3}`,
  })),
];

export default function ProductsTab() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus>("all");
  const [page, setPage] = useState(1);

  /* ===== Reset page on filter/search ===== */
  useEffect(() => {
    setPage(1);
  }, [search, status]);

  /* ===== Filter products ===== */
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase());

      const matchStatus = status === "all" || p.status === status;

      return matchSearch && matchStatus;
    });
  }, [search, status]);

  /* ===== Paginated products ===== */
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

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
          <Button onClick={() => router.push("/products/new")}>
            افزودن محصول جدید
          </Button>
        }
      />

      {/* Products */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              showState
              onEdit={() =>
                router.push(`/products/${product.id}/edit`)
              }
              onDelete={() => console.log("delete", product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-muted/30 p-10 text-center text-sm opacity-70">
          هنوز محصولی ثبت نشده است
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        totalItems={filteredProducts.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}
