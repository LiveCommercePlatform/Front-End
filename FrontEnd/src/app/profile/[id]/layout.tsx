"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Loading from "@/components/ui/Loading";
import { apiFetch } from "@/lib/api";

const tabs = [
  { key: "products", label: "محصولات" },
  { key: "liverooms", label: "لایوها" },
];

type PublicProfile = {
  id: string;
  name?: string | null;
  bio?: string | null;
  avatar?: string | null;
  image?: string | null;
};

export default function PublicProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const id = String(params.id ?? "");

  const currentTab = pathname.split("/").at(-1);

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch(`/profile/get/${id}`, {
          method: "GET",
        });

        if (!res.ok) {
          setProfile(null);
          return;
        }
        const data = await res.json();
        setProfile(data?.user ?? data?.profile ?? data ?? null);
      } catch {
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        پروفایل یافت نشد!
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 md:p-6" dir="rtl">
      {/* Header (اطلاعات کم) */}
      <div className="flex items-center gap-3 md:gap-6 mb-6">
        <img
          src={profile.avatar ?? profile.image ?? "/user1.svg"}
          alt="Profile"
          className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 object-cover"
        />
        <div>
          <h2 className="text-base md:text-2xl font-semibold">{profile.name ?? "کاربر"}</h2>
          {profile.bio ? (
            <p className="text-xs md:text-sm text-muted-foreground">{profile.bio}</p>
          ) : (
            <p className="text-xs md:text-sm text-muted-foreground">—</p>
          )}
        </div>
      </div>

      {/* Tabs فقط برای محصولات/لایوها */}
      <div className="relative mb-6">
        <div className="flex justify-around items-center bg-card py-2 px-4 rounded-full shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => router.push(`/profile/${id}/${tab.key}`)}
              className={`px-3 py-2 text-xs md:text-lg font-semibold transition-all ${
                currentTab === tab.key ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
}
