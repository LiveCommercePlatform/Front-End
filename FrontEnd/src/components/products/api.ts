import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";

export type GetProductsParams = {
  owner_id?: string;
  q?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  tags?: string[];
  in_stock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
};

export async function getProducts(params?: GetProductsParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      searchParams.append(key, value.join(","));
    } else {
      searchParams.append(key, String(value));
    }
  });

  const res = await apiFetch(`/products?${searchParams.toString()}`);

  if (!res.ok) throw new Error("خطا در دریافت محصولات");

  return res.json();
}

export async function getProductsByID(id: string) {
  const res = await apiFetch(`/products/${id}`);
  if (!res.ok) throw new Error("خطا در یافت محصولات");
  return res.json();
}

export async function DeleteProduct(id: string) {
  try {
      const res = await apiFetch(`/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error("خطا در حذف محصول");
      }
      toast.success("محصول با موفقیت حذف شد");
    } catch (err: any) {
      toast.error(err.message);
    }
}

