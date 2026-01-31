"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ProductTab from "./ProductTab";
import AnalyticsTab from "./AnalyticsTab";
import UsersTab from "./UsersTab";
import SettingsTab from "./SettingsTab";
import { Profile } from "@/types";
import { apiFetch } from "@/lib/api";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("products");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const DEFAULT_AVATAR =
    "https://commons.wikimedia.org/wiki/File:Unknown_person.jpg";

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("لطفاً دوباره وارد شوید");
        setLoading(false);
        return;
      }

      try {
        const res = await apiFetch(`/profile/get`,{method: "GET"});
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "خطا در دریافت اطلاعات پروفایل");
        }
        setProfile(data.user);
      } catch (err: any) {
        toast.error(err.message || "خطایی رخ داد");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          اطلاعات کاربر یافت نشد
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 md:gap-6 mb-6">
        <img
          src={`${DEFAULT_AVATAR}${encodeURIComponent(profile.name)}`}
          alt="Profile"
          className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-primary object-cover"
        />
        <div>
          <h2 className="text-base md:text-2xl font-semibold">
            {profile.name}
          </h2>
          <p className="text-xs md:text-sm">
            خوش آمدید به داشبورد
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative mb-6">
        <div className="flex justify-around items-center bg-card py-1.5 md:py-2 px-2 md:px-4 rounded-full shadow-sm">
          {[
            { key: "products", label: "محصولات من" },
            { key: "analytics", label: "تحلیل‌ها" },
            { key: "users", label: "مدیریت کاربران" },
            { key: "settings", label: "پروفایل کاربری" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`px-3 py-1.5 md:px-6 md:py-2 text-xs md:text-lg font-semibold transition-all ${
                selectedTab === tab.key
                  ? "text-primary"
                  : "text-muted hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div
          className="absolute bottom-0 h-1 bg-primary transition-all duration-300 rounded-full"
          style={{
            left:
              selectedTab === "products"
                ? "calc(86.25%)"
                : selectedTab === "analytics"
                ? "calc(62.5%)"
                : selectedTab === "users"
                ? "calc(37.5%)"
                : "calc(13.75%)",
            width: "20%",
            transform: "translateX(-50%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="mt-4 md:mt-6">
        {selectedTab === "products" && <ProductTab />}
        {selectedTab === "analytics" && <AnalyticsTab />}
        {selectedTab === "users" && <UsersTab />}
        {selectedTab === "settings" && (
          <SettingsTab profile={profile} />
        )}
      </div>
    </div>
  );
}
