"use client";

import ProductForm, {
  ProductFormValues,
} from "@/components/products/ProductForm";
import { apiFetch } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import toast from "react-hot-toast";

export default function CreateProductPage() {
  const handleCreate = async (values: ProductFormValues) => {
      const coverImage =
        typeof values.cover === "string"
          ? values.cover
          : values.cover
            ? URL.createObjectURL(values.cover)
            : "";
  
      const payload = {
        category_id: values.category, // 👈 مهم
        cover_image: coverImage,
        description: values.description ?? "",
        price: Number(values.price),
        stock: Number(values.stock),
        tags: values.tags ?? [],
        title: values.title,
      };
  
      try {
        const res = await apiFetch("/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data?.error || "خطا در ثبت محصول");
        }
  
        toast.success("محصول با موفقیت ثبت شد");
      } catch (err: any) {
        toast.error(getErrorMessage(err.message));
      }
    };


  return <ProductForm mode="create" onSubmit={handleCreate} />;
}
