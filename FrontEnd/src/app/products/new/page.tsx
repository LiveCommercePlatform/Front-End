"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ImagePlus, X, RotateCcw, Eye, FileText } from "lucide-react";
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
import { slugifyEn } from "@/lib/utils";
/* ------------------------------ constants ------------------------------- */
const CATEGORIES = [
  { value: "education", label: "آموزشی" },
  { value: "software", label: "نرم‌افزار" },
  { value: "design", label: "طراحی" },
  { value: "other", label: "سایر" },
];

const CATEGORY_TAGS: Record<string, string[]> = {
  education: ["دوره", "آموزشی", "ویدیو"],
  software: ["نرم‌افزار", "اپلیکیشن"],
  design: ["طراحی", "UI", "UX"],
  other: ["عمومی"],
};

/* -------------------------------- schema -------------------------------- */

const schema = z
  .object({
    title: z.string().min(3),
    slug: z.string().min(1),
    description: z.string().optional(),
    price: z.coerce.number().min(0),
    compareAtPrice: z.coerce.number().optional(),
    category: z.string(),
    tags: z.array(z.string()),
    publishMode: z.enum(["now", "scheduled"]),
    publishAt: z.string().optional(),
    cover: z.any().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.publishMode === "scheduled" && !v.publishAt) {
      ctx.addIssue({
        path: ["publishAt"],
        message: "زمان انتشار را مشخص کنید",
        code: "custom",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

/* ============================== PAGE ============================== */

export default function CreateProductPage() {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      price: 0,
      category: "",
      tags: [],
      publishMode: "now",
    },
  });

  const title = form.watch("title");
  const slug = form.watch("slug");
  const category = form.watch("category");
  const tags = form.watch("tags");
  const publishMode = form.watch("publishMode");

  const suggestedSlug = useMemo(() => slugifyEn(title || ""), [title]);

  useEffect(() => {
    if (!slug || slug === slugifyEn(slug)) {
      form.setValue("slug", suggestedSlug);
    }
  }, [suggestedSlug]);

  const setCover = (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("فایل تصویر نیست");
    if (file.size > 5 * 1024 * 1024) return toast.error("حداکثر ۵MB");

    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(URL.createObjectURL(file));
    form.setValue("cover", file);
  };

  const toggleTag = (tag: string) => {
    form.setValue(
      "tags",
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    );
  };

  const handleSubmit = async (values: FormValues) => {
    console.log(values);
    toast.success("محصول ذخیره شد");
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCoverFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("فقط فایل تصویر مجاز است");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حداکثر حجم تصویر ۵ مگابایت است");
      return;
    }

    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
    form.setValue("cover", file, { shouldValidate: true });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleCoverFile(file);
  };

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  return (
    <div className="max-w-5xl mx-auto py-10 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* HEADER */}
          <div className="flex items-center justify-between border rounded-xl p-4">
            <div>
              <h1 className="font-semibold text-lg">ایجاد محصول جدید</h1>
              <p className="text-sm opacity-70">اطلاعات محصول را تکمیل کنید</p>
            </div>

            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 ml-1" /> پیش‌نمایش
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle>پیش‌نمایش محصول</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-2">
                    <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                      {coverPreview && (
                        <img
                          src={coverPreview}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="font-semibold">
                      {title || "عنوان محصول"}
                    </div>
                    <div className="text-sm opacity-70">
                      {form.watch("description")}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Button type="submit">ذخیره</Button>
            </div>
          </div>

          {/* COVER */}
          <Card>
            <CardHeader className="flex items-center gap-2 font-medium">
              <ImagePlus className="w-4 h-4 opacity-70" />
              تصویر کاور محصول
            </CardHeader>

            <CardContent className="space-y-4">
              <div
                onDragEnter={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={[
                  "rounded-xl border border-dashed transition",
                  "p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center",
                  isDragging ? "bg-muted/60 border-primary" : "bg-transparent",
                ].join(" ")}
              >
                {/* Preview */}
                <div className="w-full md:w-56">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                    {coverPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverPreview}
                        alt="cover preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-xs opacity-70">
                        <ImagePlus className="w-5 h-5" />
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
                        className="flex-1"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        تغییر
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
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

                {/* Controls */}
                <div className="flex-1 w-full space-y-2">
                  <div className="font-medium text-sm">آپلود تصویر کاور</div>

                  <div className="text-xs opacity-70 leading-relaxed">
                    تصویر را بکشید و اینجا رها کنید یا از دکمه زیر برای انتخاب
                    فایل استفاده کنید (حداکثر ۵MB)
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <ImagePlus className="w-4 h-4" />
                      انتخاب فایل
                    </Button>

                    {isDragging && (
                      <Badge variant="secondary">فایل را رها کنید</Badge>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCoverFile(file);
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

          {/* BASIC INFO */}
          <Card>
            <CardHeader className="flex items-center gap-2 font-medium">
              <FileText className="w-4 h-4 opacity-70" />
              اطلاعات پایه
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
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
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (آدرس محصول)</FormLabel>

                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="مثلاً react-course"
                          onChange={(e) =>
                            field.onChange(slugifyEn(e.target.value))
                          }
                        />
                      </FormControl>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          form.setValue("slug", suggestedSlug, {
                            shouldValidate: true,
                          })
                        }
                        disabled={!suggestedSlug}
                        title="ساخت خودکار از عنوان"
                      >
                        خودکار
                      </Button>
                    </div>

                    <div className="text-xs opacity-60 mt-1">
                      آدرس صفحه محصول:{" "}
                      <span className="font-mono">
                        /products/{field.value || "example-slug"}
                      </span>
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
                  <FormItem className="max-w-sm">
                    <FormLabel>دسته‌بندی</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
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
                  </FormItem>
                )}
              />

              {category && (
                <div className="flex gap-2 flex-wrap">
                  {CATEGORY_TAGS[category]?.map((t) => (
                    <Button
                      key={t}
                      size="sm"
                      variant={tags.includes(t) ? "default" : "outline"}
                      onClick={() => toggleTag(t)}
                      type="button"
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {tags.map((t) => (
                  <Badge key={t} className="gap-1">
                    {t}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => toggleTag(t)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* PRICE */}
          <Card>
            <CardHeader>قیمت</CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>قیمت</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="compareAtPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>قیمت قبل</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* PUBLISH */}
          <Card>
            <CardHeader>زمان انتشار</CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="publishMode"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="max-w-sm">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="now">فوری</SelectItem>
                      <SelectItem value="scheduled">زمان‌بندی</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {publishMode === "scheduled" && (
                <FormField
                  control={form.control}
                  name="publishAt"
                  render={({ field }) => (
                    <FormItem className="max-w-sm">
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          <Separator />

          <Button type="submit">ذخیره محصول</Button>
        </form>
      </Form>
    </div>
  );
}
