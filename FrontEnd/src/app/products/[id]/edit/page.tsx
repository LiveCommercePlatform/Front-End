"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import ProductForm, { ProductFormValues } from "@/components/products/ProductForm";
import { apiFetch } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useProducts } from "@/context/ProductContext";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const ID = Array.isArray(params.id) ? params.id[0] : (params.id as string | undefined);
const { getProductByIdCached } =
    useProducts();
  const [initialData, setInitialData] = useState<Partial<ProductFormValues> | null>(null);
  const [parentID, setParentID] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ID) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductByIdCached(ID);
        setParentID(res.category?.parent_id ?? 0)
        setInitialData({
          title: res.title ?? "",
          description: res.description ?? "",
          price: res.price ?? 0,
          category: res.category_id ?? "",
          stock: res.stock ?? 0,
          tags: res.tags ? res.tags.map((t: any) => t.name) : [],
        });
      } catch (err: any) {
        toast.error(err?.message || "خطا در دریافت محصول");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [ID]);

  const handleUpdate = async (values: ProductFormValues) => {
    if (!ID) return;
const coverImage =
        typeof values.cover === "string"
          ? values.cover
          : values.cover
            ? URL.createObjectURL(values.cover)
            : "";
  
      const payload = {
        category_id: values.category,
        cover_image: coverImage,
        description: values.description ?? "",
        price: Number(values.price),
        stock: Number(values.stock),
        tags: values.tags ?? [],
        title: values.title,
      };
  
      try {
        const res = await apiFetch(`/products/${ID}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data?.error || "خطا در ویرایش محصول");
        }
  
        toast.success("محصول با موفقیت ویرایش شد");
      } catch (err: any) {
        toast.error(getErrorMessage(err.message));
      }
    };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm opacity-70">
        در حال دریافت اطلاعات محصول...
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm opacity-70">
        محصول پیدا نشد
      </div>
    );
  }

  return (
    <ProductForm mode="edit" initialData={initialData} parentID={parentID} onSubmit={handleUpdate} />
  );
}