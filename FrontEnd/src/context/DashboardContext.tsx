"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Profile } from "@/types";
import { toast } from "react-hot-toast";

type DashboardContextType = {
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/profile/get", { method: "GET" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "خطا در دریافت پروفایل");
      }

      setProfile(data.user);
    } catch (err: any) {
      toast.error(err.message || "خطایی رخ داد");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        profile,
        loading,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

/** Hook امن */
export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard باید داخل DashboardProvider استفاده شود");
  }
  return ctx;
}
