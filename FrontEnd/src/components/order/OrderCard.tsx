"use client";

import { useMemo, useState } from "react";
import {
  Eye,
  MapPin,
  Package,
  Trash2,
  Wallet,
  RefreshCw,
  Check,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPriceFa, PerDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import OrderDetailsModal from "@/components/order/OrderDetailsModal"; // مسیر خودت

type OrderCardProps = {
  order: Order;
  ownerId?: string;
  onView?: (order: Order) => void;
  onCancel?: (order: Order) => void;
  onChangeStatus?: (id: string, status: OrderStatus) => void;
  loading?: boolean;
  selected?: boolean;
  detailsOpen?: boolean;
  onDetailsOpenChange?: (open: boolean, order: Order) => void;
};

const orderStatuses: OrderStatus[] = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
];

const statusMap: Record<OrderStatus, { label: string; color: string; dot: string }> =
  {
    pending: { label: "در انتظار", color: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
    paid: { label: "پرداخت‌شده", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
    shipped: { label: "ارسال‌شده", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
    delivered: { label: "تحویل‌شده", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
    cancelled: { label: "لغوشده", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
  };

export default function OrderCard({
  order,
  ownerId,
  onView,
  onCancel,
  onChangeStatus,
  loading,
  selected = false,
  detailsOpen,
  onDetailsOpenChange,
}: OrderCardProps) {
  const status = statusMap[order.status];

  // اگر parent کنترل نکرد، خود کارت کنترل می‌کند
  const [internalOpen, setInternalOpen] = useState(false);
  const open = detailsOpen ?? internalOpen;

  const setOpen = (next: boolean) => {
    if (onDetailsOpenChange) onDetailsOpenChange(next, order);
    if (detailsOpen === undefined) setInternalOpen(next);
  };

  const handleViewClick = () => {
    onView?.(order);
    setOpen(true);
  };

  return (
    <div
      className={[
        "flex flex-col gap-4 rounded-lg border bg-card px-4 py-3 transition hover:bg-muted/40",
        "sm:flex-row sm:items-center sm:justify-between",
        selected ? "ring-2 ring-primary/30" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
          <Package className="w-5 h-5" />
        </div>

        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium truncate">سفارش #{order.id}</span>

            <Badge className="bg-violet-100 text-violet-700">
              {formatPriceFa(order.items?.length) ?? 0} آیتم
            </Badge>

            <Badge variant="secondary" className={status.color}>
              {status.label}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5" />
              {formatPriceFa(order.total_amount)} تومان
            </span>

            <span className="inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {order.receiver_name || "—"}
            </span>

            <span>{PerDate(order.created_at)}</span>
          </div>

          {order.address ? (
            
            <p className="inline-flex text-xs text-muted-foreground truncate max-w-[700px]">
              <MapPin className="w-3.5 h-3.5" />
              آدرس: {order.address}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={handleViewClick}
          disabled={loading}
        >
          <Eye className="w-4 h-4" />
          مشاهده
        </Button>

        {onChangeStatus ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                disabled={loading}
                className="gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900/40 dark:hover:bg-blue-900/20"
              >
                <RefreshCw className="w-4 h-4" />
                تغییر وضعیت
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-[170px]">
              {orderStatuses.map((itemStatus) => {
                const isCurrent = itemStatus === order.status;

                return (
                  <DropdownMenuItem
                    key={itemStatus}
                    disabled={isCurrent || loading}
                    onClick={() => onChangeStatus(order.id, itemStatus)}
                    className="flex items-center justify-end gap-3"
                  >
                    {isCurrent ? <Check className="w-4 h-4 text-green-600" /> : null}

                    <div className="flex items-center gap-2">
                      <span>{statusMap[itemStatus].label}</span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${statusMap[itemStatus].dot}`}
                      />
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}

        {order.status === "pending" && onCancel ? (
          <Button
            size="sm"
            variant="outline"
            disabled={loading}
            className="gap-1 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
            onClick={() => onCancel(order)}
          >
            <Trash2 className="w-4 h-4" />
            لغو سفارش
          </Button>
        ) : null}
      </div>

      <OrderDetailsModal
        open={open}
        onOpenChange={setOpen}
        order={order}
        ownerId={ownerId}
        loading={loading}
      />
    </div>
  );
}
