"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Profile } from "@/types";

type UpdateProfilePayload = {
  name?: string;
  address?: string;
  postal_code?: string;
  phone?: string;
};

type UseDashboardReturn = {
  profile: Profile | null;
  isLoading: boolean;
  isUpdating: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<boolean>;
};

export function useDashboard(): UseDashboardReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const didInitRef = useRef(false);
  const inFlightRef = useRef<Promise<void> | null>(null);

  const refreshProfile = useCallback(async () => {
    if (inFlightRef.current) {
      return inFlightRef.current;
    }

    const promise = (async () => {
      setIsLoading(true);

      try {
        const res = await apiFetch("/profile/get", {
          method: "GET",
          authMode: "optional",
        });

        if (res.status === 401) {
          setProfile(null);
          return;
        }

        if (!res.ok) {
          setProfile(null);
          return;
        }

        const data = await res.json();
        setProfile(data.user ?? null);
      } catch (err) {
        console.error("Fetch profile error:", err);
        setProfile(null);
      } finally {
        setIsLoading(false);
        inFlightRef.current = null;
      }
    })();

    inFlightRef.current = promise;
    return promise;
  }, []);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      setIsUpdating(true);

      try {
        const res = await apiFetch("/profile/update", {
          method: "PUT",
          authMode: "required",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.error("Update profile failed:", res.status);
          return false;
        }

        const data = await res.json();

        if (data?.user) {
          setProfile(data.user);
        } else {
          await refreshProfile();
        }

        return true;
      } catch (err) {
        console.error("Update profile error:", err);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [refreshProfile],
  );

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    void refreshProfile();
  }, [refreshProfile]);

  return { profile, isLoading, isUpdating, refreshProfile, updateProfile };
}
