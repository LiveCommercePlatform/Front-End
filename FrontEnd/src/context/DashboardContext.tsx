"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Profile } from "@/types";

type DashboardContextType = {
  profile: Profile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    setIsLoading(true); 
    try {
      const res = await apiFetch("/profile/get", {
        method: "GET",
        authMode: "optional",
      });

      if (res.status === 401) {
        setProfile(null);
      } else if (!res.ok) {
        setProfile(null);
      } else {
        const data = await res.json();
        setProfile(data.user ?? null);
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      setProfile(null);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        profile,
        isLoading,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard باید داخل DashboardProvider استفاده شود");
  return ctx;
}
