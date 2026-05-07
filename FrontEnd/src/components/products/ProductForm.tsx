"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ImagePlus, X, Eye, FileText } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { faToEnDigits, formatPriceFa } from "@/lib/utils";
import {
  CategoryNode,
  CategoryOption,
  CategoryTreeResponse,
  CategoryTagsMap,
} from "@/types";
import { apiFetch } from "@/lib/api";
/* ---------------- schema ---------------- */
const schema = z.object({
  title: z.string().min(3, "عنوان محصول باید بلند تر باشد."),
  description: z.string().optional(),
  price: z.number().min(0, "قیمت نامعتبر است"),
  stock: z.number().min(0, "قیمت نامعتبر است"),
  category: z.number(),
  tags: z.array(z.string()),
  cover: z.any().optional(),
});

export type ProductFormValues = z.infer<typeof schema>;

type ProductFormProps = {
  mode: "create" | "edit";
  initialData?: Partial<ProductFormValues>;
  parentID?: Number;
  onSubmit: (values: ProductFormValues) => Promise<void>;
};

/* ================= COMPONENT ================= */
export default function ProductForm({
  mode,
  initialData,
  parentID,
  onSubmit,
}: ProductFormProps) {
  const [priceDisplay, setPriceDisplay] = useState("");
  const [stockDisplay, setStockDisplay] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [CATEGORIES, setCATEGORIES] = useState<CategoryOption[]>([]);
  const [CATEGORY_TAGS, setCATEGORY_TAGS] = useState<CategoryTagsMap>({});
  const [selectedParent, setSelectedParent] = useState("");
  const [catsLoading, setCatsLoading] = useState(true);
  const [customTag, setCustomTag] = useState("");

  const addCustomTag = () => {
    const value = customTag.trim();
    if (!value) return;
    if (tags.includes(value)) {
      toast.error("این تگ قبلاً اضافه شده");
      return;
    }
    form.setValue("tags", [...tags, value], { shouldValidate: true });
    setCustomTag("");
  };
  useEffect(() => {
    (async () => {
      try {
        setCatsLoading(true);

        const res = await apiFetch("/categories/tree", { method: "GET" });
        const json = (await res.json()) as CategoryTreeResponse;

        if (!res.ok)
          throw new Error((json as any)?.error || "خطا در دریافت دسته‌بندی‌ها");

        const parents = json.data.map((p) => ({
          value: p.key,
          label: p.name_fa,
          id: p.id,
        }));

        const tagsMap: CategoryTagsMap = {};
        json.data.forEach((p) => {
          tagsMap[p.key] =
            p.children?.map((c) => ({
              id: c.id,
              value: c.key,
              label: c.name_fa,
            })) ?? [];
        });

        setCATEGORIES(parents);
        setCATEGORY_TAGS(tagsMap);
      } catch (e: any) {
        toast.error(e.message || "خطا در دریافت دسته‌بندی‌ها");
      } finally {
        setCatsLoading(false);
      }
    })();
  }, []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      stock: 0,
      category: 17,
      tags: [],
      ...initialData,
    },
  });

  const title = form.watch("title");
  const description = form.watch("description");
  const price = form.watch("price");
  const stock = form.watch("stock");
  const category = form.watch("category");
  const tags = form.watch("tags");

  useEffect(() => {
    setPriceDisplay(formatPriceFa(price));
  }, [price]);

  useEffect(() => {
    setStockDisplay(formatPriceFa(stock));
  }, [stock]);

  useEffect(() => {
    if (mode == "create") form.setValue("tags", []);
  }, [category]);

  useEffect(() => {
    if (mode == "edit") {
      setSelectedParent(
        CATEGORIES.find((c) => c.id === parentID)?.value || "—",
      );
    }
  }, [CATEGORIES]);

  const toggleTag = (tag: string) => {
    const current = form.getValues("tags") ?? [];
    const next = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    form.setValue("tags", next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleCoverFiles(files);
    }
  };
 
  const [coverPreviews, setCoverPreviews] = useState<string[]>([]);

  const handleCoverFiles = (files: FileList | File[]) => {
    const arr = Array.from(files);

    const previews = arr.map((file) => URL.createObjectURL(file));

    setCoverPreviews((prev) => [...prev, ...previews]);
    form.setValue("cover", [...(form.getValues("cover") || []), ...arr]);
  };

  const submitHandler = async (values: ProductFormValues) => {
    try {
      onSubmit(values);
    } catch (err: any) {}
  };

  return (
    <div className="max-w-5xl mx-5 py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-6">
          <div className="flex items-center justify-between border rounded-xl p-4">
            <div>
              <h1 className="font-semibold text-base sm:text-lg md:text-xl">
                {mode === "create" ? "ایجاد محصول جدید" : "ویرایش محصول"}
              </h1>
              <p className="text-xs sm:text-sm opacity-70">
                {mode === "create"
                  ? "اطلاعات محصول را تکمیل کنید"
                  : "اطلاعات محصول را ویرایش کنید"}
              </p>
            </div>

            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 ml-1" /> پیش‌نمایش
                  </Button>
                </SheetTrigger>

                <SheetContent side="left" className="sm:max-w-lg p-5">
                  <SheetHeader>
                    <SheetTitle>پیش‌نمایش محصول</SheetTitle>
                  </SheetHeader>

                  <div className="mt-4 space-y-4 text-right">
                    <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                    {coverPreviews.length ? (
                      coverPreviews.map((src, i) => (
                        <div
                          key={i}
                          className="aspect-[4/3] rounded-lg overflow-hidden border relative"
                        >
                          <img
                            src={src}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="aspect-[4/3] rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                        <div className="flex flex-col items-center gap-1 text-xs opacity-70">
                          <ImagePlus className="w-5 h-5" />
                          بدون تصویر
                        </div>
                      </div>
                    )}
                    </div>

                    <h2 className="text-lg font-semibold">
                      {title || "عنوان محصول"}
                    </h2>

                    {description && (
                      <p className="text-sm opacity-70">{description}</p>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="opacity-60">قیمت</span>
                        <span>{formatPriceFa(price)} تومان</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-60">تعداد موجودی</span>
                        <span>{formatPriceFa(stock)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-60">دسته‌بندی</span>
                        <span>
                          {CATEGORIES.find((c) => c.value === selectedParent)
                            ?.label || "—"}{" "}
                          -
                          {/* {selectedParent && CATEGORY_TAGS[selectedParent].find((c) => c.id === category)
                            ?.label || "—"} */}
                        </span>
                      </div>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {tags.map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <Button type="submit">
                {mode === "create" ? "ذخیره محصول" : "ذخیره تغییرات"}
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="flex items-center gap-2 font-medium">
              <ImagePlus className="w-4 h-4 opacity-70" />
              تصویر کاور محصول
            </CardHeader>

            <CardContent className="space-y-4">
              <div
                onDragEnter={(e) => {
                  e.preventDefault();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={handleDrop}
                className={[
                  "rounded-xl border border-dashed transition",
                  "p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center",
                  "bg-transparent",
                ].join(" ")}
              >
                <div className="w-full md:w-56">
                  <div className="grid grid-cols-3 gap-2">
                    {coverPreviews.length ? (
                      coverPreviews.map((src, i) => (
                        <div
                          key={i}
                          className="aspect-[4/3] rounded-lg overflow-hidden border relative"
                        >
                          <img
                            src={src}
                            className="w-full h-full object-cover"
                          />

                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded"
                            onClick={() => {
                              URL.revokeObjectURL(src);

                              const newPreviews = coverPreviews.filter(
                                (_, idx) => idx !== i,
                              );
                              const newFiles = (
                                form.getValues("cover") || []
                              ).filter((_: any, idx: number) => idx !== i);

                              setCoverPreviews(newPreviews);
                              form.setValue("cover", newFiles);
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="aspect-[4/3] rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                        <div className="flex flex-col items-center gap-1 text-xs opacity-70">
                          <ImagePlus className="w-5 h-5" />
                          بدون تصویر
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full space-y-2">
                <div className="font-medium text-sm">آپلود تصاویر محصول</div>

                <div className="text-xs opacity-70">
                  می‌توانید چند تصویر انتخاب کنید (حداکثر ۵MB)
                </div>

                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <ImagePlus className="w-4 h-4" />
                  انتخاب فایل
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleCoverFiles(e.target.files);
                  }}
                />
              </div>
              <FormField
                control={form.control}
                name="cover"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* BASIC INFO */}
          <Card>
            <CardHeader className="flex items-center gap-2 font-medium">
              <FileText className="w-4 h-4 opacity-70" />
              اطلاعات پایه
            </CardHeader>
            <CardContent className="md:cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <br />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>قیمت</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={priceDisplay}
                          onChange={(e) => {
                            const en = faToEnDigits(e.target.value);
                            const raw = en.replace(/[^\d]/g, "");

                            setPriceDisplay(
                              raw ? Number(raw).toLocaleString("fa-IR") : "",
                            );
                            field.onChange(raw ? Number(raw) : undefined);
                          }}
                          className="pl-12"
                        />

                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-60">
                          تومان
                        </span>
                      </div>
                    </FormControl>
                    <br />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تعداد موجودی</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={stockDisplay}
                        onChange={(e) => {
                          const en = faToEnDigits(e.target.value);
                          const raw = en.replace(/[^\d]/g, "");

                          setStockDisplay(
                            raw ? Number(raw).toLocaleString("fa-IR") : "",
                          );
                          field.onChange(raw ? Number(raw) : undefined);
                        }}
                        className="pl-12"
                      />
                    </FormControl>
                    <br />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>توضیحات</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* CATEGORY + TAGS */}
          <Card>
            <CardHeader>دسته‌بندی و تگ‌ها</CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>دسته‌بندی</FormLabel>

                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                      {/* Parent */}
                      <div className="w-full sm:w-1/2">
                        <Select
                          value={selectedParent}
                          onValueChange={(v) => {
                            setSelectedParent(v);
                            field.onChange("");
                          }}
                          disabled={catsLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="انتخاب سر دسته" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent className="bg-card">
                            {CATEGORIES.map((c) => (
                              <SelectItem
                                key={c.id}
                                value={c.value}
                                className="justify-end"
                              >
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Child */}
                      {selectedParent && (
                        <div className="w-full sm:w-1/2">
                          <Select
                            value={field.value ? String(field.value) : ""}
                            onValueChange={(v) => field.onChange(Number(v))}
                            disabled={catsLoading || !selectedParent}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="انتخاب زیر دسته" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent className="bg-card">
                              {(CATEGORY_TAGS[selectedParent] ?? []).map(
                                (t) => (
                                  <SelectItem
                                    key={t.id}
                                    value={String(t.id)} // 👈 اینجا id رو string می‌کنیم
                                    className="justify-end"
                                  >
                                    {t.label}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="max-w-sm space-y-2">
                <div className="text-sm font-medium">تگ دلخواه</div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="مثلاً: ارسال رایگان"
                    className="text-right"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomTag();
                      }
                    }}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    disabled={!customTag.trim()}
                    onClick={addCustomTag}
                    className="shrink-0"
                  >
                    افزودن
                  </Button>
                </div>
              </div>

              {/* Tags selected */}
              <div className="flex gap-2 flex-wrap">
                {tags.map((t) => {
                  return (
                    <Badge key={t} className="gap-1">
                      {t}

                      <button
                        type="button"
                        onClick={() => toggleTag(t)}
                        className="inline-flex items-center justify-center rounded-sm p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
                        aria-label="حذف تگ"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <Separator />
          <Button type="submit">
            {mode === "create" ? "ذخیره محصول" : "ذخیره تغییرات"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
