"use client";

import Guard from "@/components/auth/Guard";
import ProductForm, {
  ProductFormValues,
} from "@/components/products/ProductForm";
import { useProducts } from "@/context/ProductContext";
import { apiFetch } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import toast from "react-hot-toast";

export default function CreateProductPage() {
  const { refresh } = useProducts();
  const handleCreate = async (values: ProductFormValues) => {
    try {
      const payload = {
        category_id: values.category,
        description: values.description ?? "",
        price: Number(values.price),
        stock: Number(values.stock),
        tags: values.tags ?? [],
        title: values.title,
      };

      const res = await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "خطا در ثبت محصول");
      }

      const productId = data?.id;
      if (!productId) {
        throw new Error("شناسه محصول از سرور دریافت نشد");
      }

      if (values.cover) {
        for (const file of values.cover) {
          const formData = new FormData();
          formData.append("file", file);

          const uploadRes = await apiFetch(`/products/${productId}/media`, {
            method: "POST",
            body: formData,
          });
          const uploadData = await uploadRes.json();

          if (!uploadRes.ok) {
            throw new Error(uploadData?.error || "خطا در آپلود تصویر");
          }
        }
      }
      await refresh();
      toast.success("محصول با موفقیت ثبت شد!");
    } catch (err: any) {
      toast.error(getErrorMessage(err.message));
    }
  };

  return (
    <Guard requireAuth>
      <ProductForm mode="create" onSubmit={handleCreate} />
    </Guard>
  );
}
