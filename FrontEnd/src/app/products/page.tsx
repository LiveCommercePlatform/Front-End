"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import ListToolbar from "@/components/ui/ListToolbar";
import { Product } from "@/types";
import { categoryOptions } from "@/constant/category-data";
import Pagination from "@/components/ui/Pagination";
import { faToEnDigits, formatPriceFa } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/context/ProductContext";

const PAGE_SIZE = 6;
export default function AllProductsPage() {
  const { items, pagination, loading, setParams, fetchProducts } =
    useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchProducts({
      page,
      limit: PAGE_SIZE,
      q: search || undefined,
      min_price: minPrice?.trim() ? Number(minPrice) : undefined,
      max_price: maxPrice?.trim() ? Number(maxPrice) : undefined,
    });
  }, [page, search, minPrice, maxPrice]);

  useEffect(() => {
    const cleaned: Product[] = items.map((p: any) => ({
      id: String(p.id),
      title: String(p.title),
      price: Number(p.price),
      category: String(p.category_name_fa),
      cover: p.cover_image ?? "",
      status: p.stock > 0 ? "active" : "inactive",
    }));

    setProducts(cleaned);
    setProducts(cleaned);
    setTotalItems(pagination?.total ?? 0);
  }, [items, pagination]);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-6">
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
            placeholder: "دسته‌بندی",
          },
        ]}
        inputs={[
          {
            key: "min_price",
            value: minPrice ? formatPriceFa(Number(minPrice)) : "",
            onChange: (v: string) => {
              const en = faToEnDigits(v);
              const raw = en.replace(/[^\d]/g, "");
              setMinPrice(raw);
              setPage(1);
            },
            placeholder: "حداقل قیمت",
            type: "text",
            inputMode: "numeric",
          },
          {
            key: "max_price",
            value: maxPrice ? formatPriceFa(Number(maxPrice)) : "",
            onChange: (v: string) => {
              const en = faToEnDigits(v);
              const raw = en.replace(/[^\d]/g, "");
              setMaxPrice(raw);
              setPage(1);
            },
            placeholder: "حداکثر قیمت",
            type: "text",
            inputMode: "numeric",
          },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setMinPrice("");
              setMaxPrice("");
              setCategory("all");
              setPage(1);
            }}
          >
            حذف فیلترها
          </Button>
        }
      />

      {/* Products */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, key) => (
            <ProductCard
              key={key}
              id={product.id}
              title={product.title}
              price={product.price}
              status={product.status}
              cover={"https://picsum.photos/600/400?2"}
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

      <Pagination
        page={page}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
