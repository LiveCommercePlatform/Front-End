"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import ListToolbar from "@/components/ui/ListToolbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import { categoryOptions } from "@/constant/category-data";

const PAGE_SIZE = 6;
export default function AllProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  const products: Product[] = [
    // {
    //   id: "1",
    //   title: "دوره آموزش Next.js",
    //   price: 1200000,
    //   status: "active",
    //   cover: "https://picsum.photos/600/400?1",
    //   category: "education",
    // },
    // {
    //   id: "2",
    //   title: "پکیج طراحی UI",
    //   price: 850000,
    //   status: "active",
    //   cover: "https://picsum.photos/600/400?2",
    //   category: "design",
    // },
    // {
    //   id: "3",
    //   title: "اپلیکیشن مدیریت پروژه",
    //   price: 540000,
    //   status: "active",
    //   cover: "https://picsum.photos/600/400?3",
    //   category: "software",
    // },
    // {
    //   id: "5",
    //   title: "دوره پیشرفته TypeScript",
    //   price: 990000,
    //   status: "active",
    //   cover: "https://picsum.photos/600/400?4",
    //   category: "education",
    // },
  ];

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.status === "active");

    if (search) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    return result;
  }, [products, search, category]);

  /* ---------------- pagination ---------------- */

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Toolbar */}
      <ListToolbar
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="جستجوی محصول..."
        filters={[
          {
            key: "category",
            value: category,
            onChange: (v) => {
              setCategory(v);
              setPage(1);
            },
            options: categoryOptions,
          },
        ]}
      />

      {/* Products */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((product, key) => (
            <ProductCard
              key={key}
              id={product.id}
              title={product.title}
              price={product.price}
              status={product.status}
              cover={product.cover}
              showAddToCart={true}
              showEdit={false}
              showDelete={false}
            />
          ))}
        </div>
      ) : (
        <div className="min-h-[60vh] w-full flex items-center justify-center px-4">
          <div className="max-w-md w-full rounded-2xl border bg-card p-10 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <span className="text-2xl">📦</span>
            </div>

            <h3 className="text-lg font-semibold mb-2">محصولی موجود نیست</h3>

            <p className="text-sm text-muted-foreground mb-6">
              در حال حاضر هیچ محصولی برای نمایش وجود ندارد. لطفاً بعداً دوباره
              بررسی کنید.
            </p>

            <button className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition">
              بازگشت
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronRight className="w-4 h-4" />
            قبلی
          </Button>

          <div className="text-sm opacity-70">
            صفحه {page} از {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            بعدی
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
