"use client";
import dynamic from "next/dynamic";
import TabSkeleton from "../TabSkeleton";

const ReportsTab = dynamic(() => import("@/app/admin_dashboard/ReportsTab"), {
  loading: () => <TabSkeleton />,
  ssr: false,
});

export default function ReportsPage() {
  return <ReportsTab />;
}
