"use client";
import dynamic from "next/dynamic";
import TabSkeleton from "../../admin_dashboard/TabSkeleton";

const OrdersTab = dynamic(() => import("@/app/dashboard/OrdersTab"), {
  loading: () => <TabSkeleton />,
  ssr: false,
});

export default function ProductsPage() {
  return <OrdersTab />;
}