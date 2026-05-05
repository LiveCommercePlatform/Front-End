"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ListToolbar from "@/components/ui/ListToolbar";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ui/ProductCard";
import { ProductStatus, Product } from "@/types";
import Pagination from "@/components/ui/Pagination";
import { tokenStore } from "@/lib/token";
import { useProducts } from "@/context/ProductContext";
import { Loader2 } from "lucide-react";
import Loading from "@/components/ui/Loading";
import NotFound from "@/components/ui/NotFound";

const PAGE_SIZE = 9;

export default function ProductsTab() {
  const { items, pagination, loading, deleteProduct, setParams } =
    useProducts();

  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // 🔹 تنظیم پارامترهای API
  useEffect(() => {
    setParams({
      page,
      limit: PAGE_SIZE,
      q: search || undefined,
      owner_id: tokenStore.getUserId() ?? "",
      in_stock:
        status === "active" ? true : status === "inactive" ? false : undefined,
    });
  }, [page, search, status, setParams]);

  // 🔹 نرمال‌سازی داده‌ها
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
    setTotalItems(pagination?.total ?? 0);
  }, [items, pagination]);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <ListToolbar
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="جستجوی محصول..."
        filters={[
          {
            key: "status",
            value: status,
            onChange: (v) => {
              setStatus(v);
              setPage(1);
            },
            options: [
              { label: "همه وضعیت‌ها", value: "all" },
              { label: "فعال", value: "active" },
              { label: "غیرفعال", value: "inactive" },
            ],
          },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              حذف فیلترها
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push("/products/new")}
            >
              افزودن محصول جدید
            </Button>
          </>
        }
      />

      {loading ? (
        <Loading text="در حال دریافت محصولات..." />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              showState
              onEdit={() => router.push(`/products/${product.id}/edit`)}
              onDelete={() => deleteProduct(product.id)}
            />
          ))}
        </div>
      ) : (
        <NotFound
          title="محصولی موجود نیست"
          message="در حال حاضر هیچ محصولی با فیلترهای اعمال شده پیدا نشد."
          action={
            <Button variant="outline" onClick={handleResetFilters}>
              حذف فیلترها
            </Button>
          }
        />
      )}
      {!loading && products.length > 0 && (
        <Pagination
          page={page}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
}
