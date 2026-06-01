"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ClipboardList,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Wallet,
  Package,
} from "lucide-react";
import { PerDate, cn, enToFaDigits, formatPriceFa } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  ownerId?: string;
  onChangeStatus?: (id: string, status: OrderStatus) => void;
  loading?: boolean;
};

const statusMap: Record<
  OrderStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  pending: {
    label: "در انتظار",
    badgeClass: "bg-orange-100 text-orange-700",
    dotClass: "bg-orange-500",
  },
  paid: {
    label: "پرداخت‌شده",
    badgeClass: "bg-emerald-100 text-emerald-700",
    dotClass: "bg-emerald-500",
  },
  shipped: {
    label: "ارسال‌شده",
    badgeClass: "bg-blue-100 text-blue-700",
    dotClass: "bg-blue-500",
  },
  delivered: {
    label: "تحویل‌شده",
    badgeClass: "bg-green-100 text-green-700",
    dotClass: "bg-green-500",
  },
  cancelled: {
    label: "لغوشده",
    badgeClass: "bg-red-100 text-red-700",
    dotClass: "bg-red-500",
  },
};

const toman = (n: number) => `${formatPriceFa(Number(n || 0))} تومان`;

export default function OrderDetailsModal({
  open,
  onOpenChange,
  order,
  ownerId,
  loading,
}: Props) {
  const items = useMemo(() => {
    if (!order?.items) return [];
    if (!ownerId) return order.items;

    return order.items.filter(
      (it: any) => String(it.product?.owner_id) === String(ownerId),
    );
  }, [order, ownerId]);

  const itemsTotal = useMemo(() => {
    return items.reduce(
      (sum: number, it: any) => sum + Number(it.total_price || 0),
      0,
    );
  }, [items]);

  const status = order ? statusMap[order.status] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
            max-w-3xl p-0 text-right
            w-[calc(100%-2rem)]
            max-h-[calc(100vh-3rem)]
            overflow-hidden
        "
      >
        <DialogHeader className="px-6 pt-6 text-right">
          <DialogTitle className="flex flex-row items-center justify-start gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ClipboardList className="h-5 w-5" />
            </span>
            جزئیات سفارش
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground text-right">
            اطلاعات سفارش، خریدار و آیتم‌ها را اینجا ببینید.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 px-6 py-5 text-right">
            {!order ? (
              <div className="text-sm text-muted-foreground text-right">
                سفارشی انتخاب نشده است.
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border p-3 text-right">
                    <div className="text-xs text-muted-foreground">وضعیت</div>
                    <div className="flex h-full flex-row-reverse items-center justify-start mr-2 gap-2">
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full flex-none",
                          status?.dotClass,
                        )}
                        aria-hidden
                      />
                      <Badge
                        variant="secondary"
                        className={cn("leading-none", status?.badgeClass)}
                      >
                        {status?.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3 text-right">
                    <div className="text-xs text-muted-foreground">مبلغ کل</div>
                    <div className="mt-1 font-semibold mr-2">
                      {toman(order.total_amount)}
                    </div>
                  </div>
                </div>

                {/* Meta line */}
                <div className="flex flex-wrap justify-end gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <span className="inline-flex flex-row-reverse items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {PerDate(order.created_at)}
                  </span>
                  <span className="inline-flex flex-row-reverse items-center gap-1">
                    <Wallet className="h-4 w-4" />
                    جمع آیتم‌های قابل نمایش: {toman(itemsTotal)}
                  </span>
                  <span className="inline-flex flex-row-reverse items-center gap-1">
                    <Package className="h-4 w-4" />
                    {items.length} آیتم
                  </span>
                </div>

                <Separator />
                <section className="space-y-3 text-right">
                  <h3 className="text-sm font-semibold text-right">
                    اطلاعات گیرنده
                  </h3>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <InfoRow
                      label="نام گیرنده"
                      value={order.receiver_name ?? "—"}
                    />
                    <InfoRow label="کد پستی" value={enToFaDigits(order.postal_code) ?? "—"} />
                    <InfoRow label="شماره تماس" value={enToFaDigits(order.phone) ?? "—"} />
                  </div>

                  <div className="rounded-lg border p-3 text-right">
                    <div className="inline-flex flex-row-reverse items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      آدرس
                    </div>
                    <div className="mt-1 text-sm leading-6">
                      {order.address ?? "—"}
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Items */}
                <section className="space-y-3 text-right">
                  <h3 className="text-sm font-semibold text-right">
                    آیتم‌های سفارش
                  </h3>

                  <div dir="rtl"  className="overflow-hidden rounded-lg border">
                    <div className="grid grid-cols-12 bg-muted/40 px-3 py-2 text-xs text-muted-foreground text-right">
                      <div className="col-span-6 text-right">محصول</div>
                      <div className="col-span-2 text-center">تعداد</div>
                      <div className="col-span-2 text-center">قیمت واحد</div>
                      <div className="col-span-2 text-center">جمع</div>
                    </div>

                    <div className="divide-y">
                      {items.map((it: any) => (
                        <div
                          key={it.id}
                          className="grid grid-cols-12 px-3 py-3 text-sm text-right"
                        >
                          <div className="col-span-6 min-w-0 text-right">
                            <div className="truncate font-medium">
                              {it.product?.title ?? "—"}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                              محصول #{it.product_id}
                            </div>
                          </div>

                          <div className="col-span-2 text-center tabular-nums">
                            {enToFaDigits(String(it.qty))}
                          </div>

                          <div className="col-span-2 text-center tabular-nums">
                            {formatPriceFa(it.unit_price)}
                          </div>

                          <div className="col-span-2 text-center tabular-nums font-medium">
                            {formatPriceFa(it.total_price)}
                          </div>
                        </div>
                      ))}

                      {items.length === 0 ? (
                        <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                          آیتمی برای نمایش وجود ندارد.
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-row-reverse items-center justify-between rounded-lg border p-3 text-right">
                    <div className="text-sm text-muted-foreground">
                      جمع آیتم‌ها
                    </div>
                    <div className="text-sm font-semibold tabular-nums">
                      {toman(itemsTotal)}
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <div className="flex items-center justify-start px-6 py-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            بستن
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border p-3 text-right">
      <div className="inline-flex flex-row-reverse items-center gap-1 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 break-words text-sm font-medium">{value}</div>
    </div>
  );
}
