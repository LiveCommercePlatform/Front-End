"use client";

import { useState } from "react";
import ProductTab from "./ProductTab";
import AnalyticsTab from "./AnalyticsTab";
import UsersTab from "./UsersTab";
import SettingsTab from "./SettingsTab";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("products");
  const userName = "محمد علی";
  const profileImage = "https://randomuser.me/api/portraits/men/50.jpg";

  return (
    <div className="min-h-screen p-3 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 md:gap-6 mb-6">
        <img
          src={profileImage}
          alt="Profile"
          className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-primary"
        />
        <div>
          <h2 className="text-base md:text-2xl font-semibold">{userName}</h2>
          <p className="text-xs md:text-sm">خوش آمدید به داشبورد</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative mb-6">
        <div className="flex justify-around items-center bg-card py-1.5 md:py-2 px-2 md:px-4 rounded-full shadow-sm">
          <button
            className={`px-3 py-1.5 md:px-6 md:py-2 text-xs md:text-lg font-semibold transition-all duration-300 ease-in-out ${
              selectedTab === "products"
                ? "text-primary"
                : "text-muted hover:text-primary"
            }`}
            onClick={() => setSelectedTab("products")}
          >
            محصولات من
          </button>

          <button
            className={`px-3 py-1.5 md:px-6 md:py-2 text-xs md:text-lg font-semibold transition-all duration-300 ease-in-out ${
              selectedTab === "analytics"
                ? "text-primary"
                : "text-muted hover:text-primary"
            }`}
            onClick={() => setSelectedTab("analytics")}
          >
            تحلیل‌ها
          </button>

          <button
            className={`px-3 py-1.5 md:px-6 md:py-2 text-xs md:text-lg font-semibold transition-all duration-300 ease-in-out ${
              selectedTab === "users"
                ? "text-primary"
                : "text-muted hover:text-primary"
            }`}
            onClick={() => setSelectedTab("users")}
          >
            مدیریت کاربران
          </button>

          <button
            className={`px-3 py-1.5 md:px-6 md:py-2 text-xs md:text-lg font-semibold transition-all duration-300 ease-in-out ${
              selectedTab === "settings"
                ? "text-primary"
                : "text-muted hover:text-primary"
            }`}
            onClick={() => setSelectedTab("settings")}
          >
            تنظیمات
          </button>
        </div>

        {/* Slider */}
        <div
          className="absolute bottom-0 h-1 bg-primary transition-all duration-300 ease-in-out rounded-full"
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
        {selectedTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
