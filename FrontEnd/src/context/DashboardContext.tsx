"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Profile } from "@/types";

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

      const res = await apiFetch("/profile/get", {
        method: "GET",
        authMode: "optional",
      });

      if (res.status === 401) {
        setProfile(null);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setProfile(null);
        return;
      }

      setProfile(data.user ?? null);
    } catch {
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

export function useDashboard() {
  const ctx = useContext(DashboardContext);

  if (!ctx) {
    throw new Error("useDashboard باید داخل DashboardProvider استفاده شود");
  }

  return ctx;
}
