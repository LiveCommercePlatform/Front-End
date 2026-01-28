"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ImagePlus, X, RotateCcw, Eye } from "lucide-react";

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

/* ---------------- helpers ---------------- */

function slugifyFa(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^-\w\u0600-\u06FF]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseCsv(s?: string) {
  if (!s) return [];
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

/* ---------------- category/tags ---------------- */

const CATEGORIES = [
  { value: "education", label: "آموزشی" },
  { value: "software", label: "نرم‌افزار" },
  { value: "design", label: "طراحی" },
  { value: "other", label: "سایر" },
] as const;

const CATEGORY_TAGS: Record<string, string[]> = {
  education: ["آموزشی", "دوره", "ویدیو"],
  software: ["نرم‌افزار", "اپلیکیشن", "سیستمی"],
  design: ["طراحی", "UI", "UX"],
  other: ["عمومی"],
};

/* ---------------- schema ---------------- */

const schema = z
  .object({
    title: z.string().min(3, "حداقل ۳ کاراکتر"),
    slug: z.string().min(1, "اسلاگ الزامی است"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "قیمت باید ۰ یا بیشتر باشد"),
    compareAtPrice: z.coerce.number().optional(),
    category: z.string().min(1, "دسته‌بندی را انتخاب کنید"),
    tags: z.array(z.string()).default([]),

    publishMode: z.enum(["now", "scheduled"]),
    publishAt: z.string().optional(), // datetime-local string

    cover: z.any().optional(), // File
  })
  .superRefine((val, ctx) => {
    if (val.publishMode === "scheduled" && !val.publishAt) {
      ctx.addIssue({
        code: "custom",
        message: "زمان انتشار را مشخص کنید",
        path: ["publishAt"],
      });
    }
    if (
      val.compareAtPrice !== undefined &&
      val.compareAtPrice !== null &&
      Number.isFinite(val.compareAtPrice) &&
      val.compareAtPrice < val.price
    ) {
      // معمولاً قیمت قبل باید >= قیمت فعلی باشد
      ctx.addIssue({
        code: "custom",
        message: "قیمت قبل باید بزرگ‌تر یا مساوی قیمت فعلی باشد",
        path: ["compareAtPrice"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

/* ---------------- page ---------------- */

export default function CreateProductPage() {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      price: 0,
      compareAtPrice: undefined,
      category: "",
      tags: [],
      publishMode: "now",
      publishAt: "",
      cover: undefined,
    },
    mode: "onBlur",
  });

  const title = form.watch("title");
  const category = form.watch("category");
  const tags = form.watch("tags") || [];
  const publishMode = form.watch("publishMode");
  const slugValue = form.watch("slug");

  const suggestedSlug = useMemo(() => slugifyFa(title || ""), [title]);

  // Auto-slug: فقط وقتی کاربر هنوز چیزی دستی ننوشته یا slug خالی است
  useEffect(() => {
    if (!title) return;

    // اگر slug خالیه یا برابر با اسلاگ پیشنهادی قبلی بوده، آپدیت کن
    if (!slugValue || slugValue === slugifyFa(slugValue)) {
      form.setValue("slug", suggestedSlug, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestedSlug]);

  // پاکسازی URL preview
  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  const setCoverFile = (file: File) => {
    // validate ساده (اختیاری)
    if (!file.type.startsWith("image/")) {
      toast.error("فقط فایل تصویر مجاز است");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم تصویر نباید بیشتر از ۵ مگابایت باشد");
      return;
    }

    if (coverPreview) URL.revokeObjectURL(coverPreview);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    form.setValue("cover", file, { shouldValidate: true });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) setCoverFile(file);
  };

  const toggleSuggestedTag = (tag: string) => {
    const current = form.getValues("tags") || [];
    const exists = current.includes(tag);
    form.setValue(
      "tags",
      exists ? current.filter((t) => t !== tag) : [...current, tag],
      { shouldValidate: true }
    );
  };

  const addCustomTag = (value: string) => {
    const v = value.trim();
    if (!v) return;
    const current = form.getValues("tags") || [];
    if (current.includes(v)) return;
    form.setValue("tags", [...current, v], { shouldValidate: true });
  };

  const removeTag = (tag: string) => {
    const current = form.getValues("tags") || [];
    form.setValue("tags", current.filter((t) => t !== tag), {
      shouldValidate: true,
    });
  };

  const onSubmit = async (values: FormValues) => {
    try {
      // اینجا بهتره با FormData به بک‌اند بفرستی چون فایل داریم
      const fd = new FormData();
      fd.append("title", values.title);
      fd.append("slug", values.slug);
      fd.append("description", values.description || "");
      fd.append("price", String(values.price));
      if (values.compareAtPrice !== undefined && values.compareAtPrice !== null)
        fd.append("compareAtPrice", String(values.compareAtPrice));
      fd.append("category", values.category);
      fd.append("tags", JSON.stringify(values.tags));
      fd.append("publishMode", values.publishMode);
      if (values.publishMode === "scheduled" && values.publishAt)
        fd.append("publishAt", values.publishAt);
      if (values.cover instanceof File) fd.append("cover", values.cover);

      // نمونه:
      // const res = await fetch("/api/products/create", { method: "POST", body: fd });
      // if (!res.ok) throw new Error("Request failed");

      console.log("FORMDATA READY", values);
      toast.success("محصول ثبت شد");
    } catch {
      toast.error("خطا در ثبت محصول");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Header */}
          <div className="mt-10 bg-background/80 backdrop-blur rounded-xl border p-4 flex items-center justify-between">
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-semibold truncate">
                ایجاد محصول جدید
              </h1>
              <p className="text-xs md:text-sm opacity-70">
                تصویر، دسته‌بندی، تگ‌ها و زمان انتشار را مشخص کنید.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button type="button" variant="outline" className="gap-2">
                    <Eye className="w-4 h-4" />
                    پیش‌نمایش
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle>پیش‌نمایش محصول</SheetTitle>
                  </SheetHeader>

                  <div className="mt-4 space-y-4">
                    <div className="rounded-xl border overflow-hidden">
                      <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                        {coverPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={coverPreview}
                            alt="cover"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-sm opacity-60">
                            تصویر کاور انتخاب نشده
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="text-lg font-semibold">
                          {title || "عنوان محصول"}
                        </div>

                        <div className="text-sm opacity-70">
                          {form.watch("description") || "توضیحات محصول..."}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary">
                            {CATEGORIES.find((c) => c.value === category)
                              ?.label || "بدون دسته‌بندی"}
                          </Badge>

                          {tags.slice(0, 6).map((t) => (
                            <Badge key={t} variant="outline">
                              {t}
                            </Badge>
                          ))}
                          {tags.length > 6 && (
                            <Badge variant="secondary">+{tags.length - 6}</Badge>
                          )}
                        </div>

                        <div className="pt-2 flex items-end justify-between">
                          <div className="text-lg font-semibold">
                            {Number(form.watch("price") || 0).toLocaleString()}
                          </div>

                          {form.watch("compareAtPrice") ? (
                            <div className="text-sm opacity-60 line-through">
                              {Number(form.watch("compareAtPrice") || 0).toLocaleString()}
                            </div>
                          ) : null}
                        </div>

                        <div className="text-xs opacity-60 pt-2">
                          slug: {form.watch("slug") || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "در حال ذخیره..." : "ذخیره"}
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader className="font-medium">تصویر کاور</CardHeader>
            <CardContent className="space-y-3">
              <div
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                }}
                onDrop={onDrop}
                className={[
                  "rounded-xl border border-dashed p-4 md:p-6 transition",
                  "flex flex-col md:flex-row items-center gap-4",
                  isDragging ? "bg-muted/60" : "bg-transparent",
                ].join(" ")}
              >
                <div className="w-full md:w-64">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                    {coverPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverPreview}
                        alt="cover preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-sm opacity-60 flex items-center gap-2">
                        <ImagePlus className="w-4 h-4" />
                        بدون تصویر
                      </div>
                    )}
                  </div>

                  {coverPreview && (
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        تغییر
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          if (coverPreview) URL.revokeObjectURL(coverPreview);
                          setCoverPreview(null);
                          form.setValue("cover", undefined);
                        }}
                      >
                        حذف
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div className="font-medium">آپلود با Drag & Drop</div>
                  <div className="text-sm opacity-70">
                    تصویر را اینجا رها کنید یا با دکمه زیر انتخاب کنید (حداکثر ۵MB).
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <ImagePlus className="w-4 h-4" />
                      انتخاب فایل
                    </Button>

                    {isDragging && (
                      <Badge variant="secondary">در حال رها کردن فایل…</Badge>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setCoverFile(f);
                    }}
                  />
                </div>
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

          {/* Basics */}
          <Card>
            <CardHeader className="font-medium">اطلاعات پایه</CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان محصول</FormLabel>
                    <FormControl>
                      <Input placeholder="مثلاً دوره React" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="slug"
                          {...field}
                          onChange={(e) => field.onChange(slugifyFa(e.target.value))}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-2"
                          onClick={() =>
                            form.setValue("slug", suggestedSlug, {
                              shouldValidate: true,
                            })
                          }
                          disabled={!suggestedSlug}
                          title="بازنشانی بر اساس عنوان"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span className="hidden sm:inline">خودکار</span>
                        </Button>
                      </div>
                    </FormControl>
                    <div className="text-xs opacity-60 mt-1">
                      پیشنهاد: {suggestedSlug || "-"}
                    </div>
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
                      <Textarea
                        rows={5}
                        placeholder="توضیحات محصول..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Category + Tags */}
          <Card>
            <CardHeader className="font-medium">دسته‌بندی و تگ‌ها</CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="max-w-sm">
                    <FormLabel>دسته‌بندی</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب دسته‌بندی" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Suggested tags */}
              {category ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium">تگ‌های پیشنهادی</div>
                  <div className="flex flex-wrap gap-2">
                    {(CATEGORY_TAGS[category] || []).map((tag) => {
                      const active = tags.includes(tag);
                      return (
                        <Button
                          key={tag}
                          type="button"
                          size="sm"
                          variant={active ? "default" : "outline"}
                          onClick={() => toggleSuggestedTag(tag)}
                        >
                          {tag}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-sm opacity-70">
                  برای دیدن تگ‌های پیشنهادی، ابتدا دسته‌بندی را انتخاب کنید.
                </div>
              )}

              {/* Custom tag input */}
              <div className="space-y-2">
                <div className="text-sm font-medium">افزودن تگ دلخواه</div>
                <Input
                  placeholder="تگ را بنویس و Enter بزن (مثلاً: تخفیف ویژه)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomTag(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>

              {/* Selected tags */}
              <div className="flex flex-wrap gap-2">
                {tags.length === 0 ? (
                  <div className="text-sm opacity-70">هنوز تگی انتخاب نشده</div>
                ) : (
                  tags.map((t) => (
                    <Badge key={t} variant="secondary" className="gap-1">
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="opacity-70 hover:opacity-100"
                        aria-label="remove tag"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader className="font-medium">قیمت‌گذاری</CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>قیمت</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="compareAtPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>قیمت قبل (اختیاری)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Publish */}
          <Card>
            <CardHeader className="font-medium">زمان انتشار</CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="publishMode"
                render={({ field }) => (
                  <FormItem className="max-w-sm">
                    <FormLabel>نوع انتشار</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="now">انتشار فوری</SelectItem>
                        <SelectItem value="scheduled">زمان‌بندی شده</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {publishMode === "scheduled" && (
                <FormField
                  control={form.control}
                  name="publishAt"
                  render={({ field }) => (
                    <FormItem className="max-w-sm">
                      <FormLabel>زمان انتشار</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {publishMode === "now" && (
                <div className="text-sm opacity-70">
                  محصول بلافاصله پس از ذخیره، منتشر خواهد شد.
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Bottom actions */}
          <div className="flex justify-start gap-2">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "در حال ذخیره..." : "ذخیره محصول"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                if (coverPreview) URL.revokeObjectURL(coverPreview);
                setCoverPreview(null);
                toast.success("فرم پاک شد");
              }}
            >
              پاک کردن فرم
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
