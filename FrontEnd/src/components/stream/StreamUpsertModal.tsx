"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

import type { Stream } from "@/types/stream";
import type { Product } from "@/types/product";
import { useProducts } from "@/context/ProductContext";
import { useLiveRooms } from "@/context/LiveRoomContext";


const schema = z.object({
  title: z.string().min(3, "حداقل ۳ کاراکتر"),
  description: z.string().optional(),
  is_recorded: z.boolean(),
});

type Values = z.infer<typeof schema>;

export default function StreamUpsertModal({
  open,
  mode,
  initial,
  onClose,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Partial<Stream>;
  onClose: () => void;
}) {

  const [step, setStep] = useState<1 | 2>(1);
  const [streamId, setStreamId] = useState<string | null>(null);
  const { items, loading, fetchProducts } = useProducts();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const { createLiveRoom, updateLiveRoom } = useLiveRooms();
  const [loadingProducts, setLoadingProducts] = useState(false);


  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      is_recorded: false,
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      title: initial?.Title ?? "",
      description: initial?.Description ?? "",
      is_recorded: initial?.IsRecorded ?? false,
    });

    setStreamId(initial?.ID ?? null);
    setStep(1);
    setSelectedProducts([]);
    setSearch("");
  }, [open, initial, form]);


  const hasStreamChanged = (values: Values) => {
    if (mode === "create") return true;

    return (
      values.title !== (initial?.Title ?? "") ||
      (values.description ?? "") !== (initial?.Description ?? "") ||
      values.is_recorded !== (initial?.IsRecorded ?? false)
    );
  };

const handleStep1 = async (values: Values) => {
  if (mode === "edit" && !hasStreamChanged(values)) {
    setStep(2);
    return;
  }
  try {
    let id;
    if (mode === "create") {
      id = await createLiveRoom(values);
    } else {
      id = await updateLiveRoom(initial?.ID!, values) ? initial?.ID! : "0";
    }
    setStreamId(id);
    setStep(2);
  } catch (err: any) {
    toast.error(err.message || "خطا رخ داد!");
  }
};

 useEffect(() => {
  if (step !== 2 || !streamId) return;

  const loadData = async () => {
    setLoadingProducts(true);
    
    try {
      const requests: [Promise<any>, Promise<any>?] = [fetchProducts()];
      
      if (mode === "edit") {
        requests.push(apiFetch(`/live-rooms/${streamId}/products`).then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        }));
      }

      const [_, streamProducts] = await Promise.all(requests);

      if (mode === "edit" && streamProducts) {
        const productIds = streamProducts.map((p: any) => p.ProductID);
        setSelectedProducts(productIds);
      }
      
    } catch (error) {
      toast.error("خطا در دریافت لیست محصولات");
      console.error("Fetch Step 2 Error:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  loadData();
}, [step, streamId, mode, fetchProducts]); 

  const filteredProducts = useMemo(() => {
    return items.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [items, search]);


  const saveProducts = async () => {
    if (!streamId) return;

    try {
      const res = await apiFetch(`/live-rooms/${streamId}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_ids: selectedProducts,
        }),
      });

      if (!res.ok) {
        throw new Error("خطا در ثبت محصولات");
      }
      handleClose();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleClose = () => {
    setStep(1);
    setStreamId(null);
    setSelectedProducts([]);
    setSearch("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent dir="rtl" className="sm:max-w-lg">
        <DialogHeader className="text-right">
          <DialogTitle>
            {step === 1
              ? mode === "create"
                ? "ساخت استریم"
                : "ویرایش استریم"
              : "انتخاب محصولات"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleStep1)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>توضیحات</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_recorded"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between border p-3 rounded-lg">
                    <FormLabel>ضبط شود؟</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  انصراف
                </Button>
                <Button type="submit">ادامه</Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {/* 🔍 Search */}
            <Input
              placeholder="جستجو محصول..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* ✅ Scroll if more than 4 */}
            <div className="max-h-56 overflow-y-auto space-y-2 border rounded-lg p-2">
              {loadingProducts ? (
                <p className="text-center">در حال دریافت...</p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  موردی یافت نشد
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <span>{product.title}</span>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProducts((prev) => [...prev, product.id]);
                        } else {
                          setSelectedProducts((prev) =>
                            prev.filter((id) => id !== product.id),
                          );
                        }
                      }}
                    />
                  </div>
                ))
              )}
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                بازگشت
              </Button>
              <Button onClick={saveProducts}>ثبت نهایی</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
