"use client";
import dynamic from "next/dynamic";
import Lives from "../LivesTab";
import TabSkeleton from "../TabSkeleton";

const LivesTab = dynamic(() => import("@/app/dashboard/LivesTab"), {
  loading: () => <TabSkeleton />,
  ssr: false,
});

export default function LivesPage() {
  return <LivesTab />;
}
