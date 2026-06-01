"use client";

import { useMemo, useState } from "react";
import ListToolbar from "@/components/ui/ListToolbar";
import NotFound from "@/components/ui/NotFound";
import OrderCard from "@/components/order/OrderCard";
import { useOrders } from "@/hooks/useOrders";
import type { Order, OrderStatus } from "@/types";
import Loading from "@/components/ui/Loading";
import { tokenStore } from "@/lib/token";

export default function OrdersTab() {
  const currentUserId = tokenStore.getUserId();

  const {
    adminOrders,
    loadingAdminList,
    cancelOrder,
    adminUpdateOrderStatus,
    mutating,
  } = useOrders({
    autoStart: true,
    initialAdminParams: { page: 1, pageSize: 10 },
  });

  const [status, setStatus] = useState<OrderStatus | "all">("all");

  const myProductOrders = useMemo(() => {
    if (!currentUserId) return [];
    return adminOrders.filter((order) =>
      order.items?.some(
        (item) => String(item.product?.owner_id) === String(currentUserId),
      ),
    );
  }, [adminOrders, currentUserId]);

  const visibleOrders = useMemo(() => {
    return status === "all"
      ? myProductOrders
      : myProductOrders.filter((o) => o.status === status);
  }, [myProductOrders, status]);

  const handleCancel = async (order: Order) => {
    await cancelOrder(order.id);
  };

  const handleChangeStatus = async (id: string, status: OrderStatus) => {
    await adminUpdateOrderStatus(id, status);
  };

  return (
    <div className="space-y-6 px-4 py-4 md:px-0 md:py-5">
      <ListToolbar
        filters={[
          {
            key: "status",
            value: status,
            onChange: setStatus,
            options: [
              { label: "همه وضعیت‌ها", value: "all" },
              { label: "در انتظار", value: "pending" },
              { label: "پرداخت‌شده", value: "paid" },
              { label: "ارسال‌شده", value: "shipped" },
              { label: "تحویل‌شده", value: "delivered" },
              { label: "لغوشده", value: "cancelled" },
            ],
          },
        ]}
      />

      <div className="space-y-3">
        {loadingAdminList ? (
          <Loading />
        ) : visibleOrders.length === 0 ? (
          <NotFound message="هنوز سفارشی برای محصولات شما ثبت نشده است." />
        ) : (
          visibleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              ownerId={currentUserId ? currentUserId : undefined} // ✅ برای فیلتر آیتم‌ها در مودال
              onCancel={handleCancel} // اگر نمی‌خوای فروشنده لغو کنه، حذفش کن
              onChangeStatus={handleChangeStatus}
              loading={mutating}
            />
          ))
        )}
      </div>
    </div>
  );
}
