"use client";

import { useState } from "react";
import ListToolbar from "@/components/ui/ListToolbar";
import NotFound from "@/components/ui/NotFound";
import OrderCard from "@/components/order/OrderCard";
import { useOrders } from "@/hooks/useOrders";
import { Order, OrderStatus } from "@/types";
import Loading from "@/components/ui/Loading";

export default function OrdersTab() {
  const {
    adminOrders,
    loadingMyList,
    cancelOrder,
    adminUpdateOrderStatus,
    mutating,
  } = useOrders({
    autoStart: true,
    initialMyParams: {
      page: 1,
      pageSize: 10,
    },
  });
  const handleChangeStatus = async (id: string, status: OrderStatus) => {
    await adminUpdateOrderStatus(id, status);
  };
  const [status, setStatus] = useState<OrderStatus | "all">("all");

  const visibleOrders =
    status === "all"
      ? adminOrders
      : adminOrders.filter((o) => o.status === status);

  const handleCancel = async (order: Order) => {
    await cancelOrder(order.id);
  };

  return (
    <div className="space-y-6">
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
        {loadingMyList ? (
          <Loading />
        ) : visibleOrders.length === 0 ? (
          <NotFound message="هنوز سفارشی ثبت نشده است." />
        ) : (
          visibleOrders.map((order) => (
            <div key={order.id} className="relative">
              <OrderCard
                key={order.id}
                order={order}
                onCancel={handleCancel}
                onChangeStatus={handleChangeStatus}
                loading={mutating}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
