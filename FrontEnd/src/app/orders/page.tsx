"use client";

import { useState } from "react";
import ListToolbar from "@/components/ui/ListToolbar";
import NotFound from "@/components/ui/NotFound";
import OrderCard from "@/components/order/OrderCard";
import { useOrders } from "@/hooks/useOrders";
import { Order, OrderStatus } from "@/types";
import { tokenStore } from "@/lib/token";
import Loading from "@/components/ui/Loading";

export default function OrdersTab() {
  const { myOrders, loadingMyList, cancelOrder, mutating } = useOrders({
    autoStart: true,
    initialMyParams: {
      page: 1,
      pageSize: 10,
    },
  });

  const [status, setStatus] = useState<OrderStatus | "all">("all");

  const visibleOrders =
    status === "all"
      ? myOrders
      : myOrders.filter((o) => o.status === status);

  const handleCancel = async (order: Order) => {
    await cancelOrder(order.id);
  };

  return (
    <div className="space-y-6 px-4 mx-4 py-4 md:px-1 md:py-5">
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
                order={order}
                onCancel={handleCancel}
                loading={mutating}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}