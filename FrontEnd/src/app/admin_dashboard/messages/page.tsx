"use client";
import dynamic from "next/dynamic";
import TabSkeleton from "../TabSkeleton";

const MessagesTab = dynamic(() => import("@/app/admin_dashboard/MessagesTab"), {
  loading: () => <TabSkeleton />,
  ssr: false,
});

export default function UserPage() {
  return <MessagesTab />;
}
