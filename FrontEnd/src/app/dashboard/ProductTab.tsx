"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import ListToolbar from "@/components/ui/ListToolbar";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ui/ProductCard";
import { ProductStatus, Product } from "@/types";
import Pagination from "@/components/ui/Pagination";
import { tokenStore } from "@/lib/token";
import { useProducts } from "@/context/ProductContext";

const PAGE_SIZE = 9;
export default function ProductsTab() {
  const { items, pagination, deleteProduct, setParams, fetchProducts } =
    useProducts();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchProducts({
      page,
      limit: PAGE_SIZE,
      q: search || undefined,
      owner_id: tokenStore.getUserId() ?? "",
      in_stock:
        status == "active" ? true : status == "inactive" ? false : undefined,
    });
  }, [page, search, status]);

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
    <div className="space-y-6">
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
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setStatus("all");
                setPage(1);
              }}
            >
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
      {products.length > 0 ? (
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
        <div className="rounded-xl border bg-muted/30 p-10 text-center text-sm opacity-70">
          هنوز محصولی ثبت نشده است
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
