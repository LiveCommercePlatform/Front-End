"use client";
import dynamic from "next/dynamic";
import TabSkeleton from "../TabSkeleton";

const UsersTab = dynamic(() => import("@/app/admin_dashboard/UsersTab"), {
  loading: () => <TabSkeleton />,
  ssr: false,
});

export default function UserPage() {
  return <UsersTab />;
}
