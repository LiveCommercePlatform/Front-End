"use client";
import dynamic from "next/dynamic";
import TabSkeleton from "../TabSkeleton";

const ProductsTab = dynamic(() => import("@/app/dashboard/ProductTab"), {
  loading: () => <TabSkeleton />,
  ssr: false,
});

export default function ProductsPage() {
  return <ProductsTab />;
}
