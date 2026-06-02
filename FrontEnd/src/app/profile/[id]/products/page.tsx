"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";

import Loading from "@/components/ui/Loading";
import { apiFetch } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import ListToolbar from "@/components/ui/ListToolbar";
import Pagination from "@/components/ui/Pagination";

import { Product } from "@/types";

const PAGE_SIZE = 12;

export default function ProfileProductsPage() {
  const params = useParams();
  const id = String(params.id ?? "");

  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // سبک: فقط سرچ
  const [search, setSearch] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // جلوگیری از دوبار fetch در dev به خاطر StrictMode (اختیاری ولی کاربردی)
  const devDoubleFetchGuard = useRef(false);

  const fetchProducts = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set("page", String(page));
      qs.set("limit", String(PAGE_SIZE));
      if (search.trim()) qs.set("q", search.trim());

      const res = await apiFetch(
        `/users/${encodeURIComponent(id)}/products?${qs.toString()}`,
        { method: "GET" }
      );

      const data = res.ok ? await res.json() : null;

      const rawItems = data?.items ?? data?.products ?? data?.data ?? [];
      const total =
        data?.pagination?.total ??
        data?.meta?.total ??
        data?.total ??
        rawItems.length;

      const cleaned: Product[] = rawItems.map((p: any) => {
        const stock = Number(p.stock ?? p.stcok ?? 0);
        return {
          id: String(p.id),
          title: String(p.title ?? ""),
          price: Number(p.price ?? 0),
          category: String(p.category_name_fa ?? p.category ?? ""),
          media: p.media ?? [],
          stock,
          status: stock > 0 ? "active" : "inactive",
        };
      });

      setItems(cleaned);
      setTotalItems(Number(total) || 0);
    } catch (e) {
      console.error(e);
      setItems([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  // فقط یک effect برای fetch (منبع اصلی دوبار ریکوست همین دوتا effect بود)
  useEffect(() => {
    // dev/StrictMode: جلوگیری از دوبار اجرا در mount
    if (process.env.NODE_ENV === "development") {
      if (devDoubleFetchGuard.current) return;
      devDoubleFetchGuard.current = true;
    }

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page, search]);

  const handleReset = () => {
    setSearch("");
    setPage(1);
  };

  const NoProductsState = () => (
    <div className="min-h-[55vh] w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 md:p-10 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <span className="text-2xl">📦</span>
        </div>

        <h3 className="mb-2 text-lg font-semibold">محصولی پیدا نشد</h3>

        <p className="mb-6 text-sm text-muted-foreground leading-6">
          یا این کاربر محصولی منتشر نکرده، یا چیزی با جستجوی شما پیدا نشد.
        </p>

        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" onClick={handleReset}>
            پاک کردن جستجو
          </Button>
          <Button variant="secondary" onClick={fetchProducts}>
            تلاش مجدد
          </Button>
        </div>
      </div>
    </div>
  );

  // اگر سرور total نداد، fallback کلاینتی
  const effectiveTotalItems = totalItems || items.length;

  const pagedItems = useMemo(() => {
    // اگر سرور pagination می‌کند، items همین صفحه است
    if (totalItems) return items;

    // fallback: pagination سمت کلاینت
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page, totalItems]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-3 pb-6 md:px-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm md:text-lg font-semibold">محصولات</h3>
        {!isLoading && effectiveTotalItems > 0 ? (
          <span className="text-xs md:text-sm text-muted-foreground">
            {effectiveTotalItems.toLocaleString("fa-IR")} محصول
          </span>
        ) : null}
      </div>

      {/* Toolbar سبک */}
      <ListToolbar
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1); // اینجا صفحه رو ریست می‌کنیم، نه تو useEffect جدا
        }}
        searchPlaceholder="جستجوی محصول..."
        actions={
          search ? (
            <Button variant="outline" size="sm" onClick={handleReset}>
              پاک کردن
            </Button>
          ) : null
        }
      />

      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loading text="در حال بارگذاری محصولات..." />
        </div>
      ) : pagedItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
            {pagedItems.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title ?? "بدون عنوان"}
                price={product.price ?? 0}
                status={product.status ?? "inactive"}
                media={product.media}
                stock={product.stock ?? 0}
                showAddToCart={true}
                showEdit={false}
                showDelete={false}
              />
            ))}
          </div>

          {effectiveTotalItems > PAGE_SIZE && (
            <Pagination
              page={page}
              totalItems={effectiveTotalItems}
              pageSize={PAGE_SIZE}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </>
      ) : (
        <NoProductsState />
      )}
    </div>
  );
}
