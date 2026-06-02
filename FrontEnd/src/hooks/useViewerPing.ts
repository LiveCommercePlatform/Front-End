import { apiFetch } from "@/lib/api";
import { useEffect, useRef, useState } from "react";

const PING_INTERVAL = 15_000;
const STORAGE_KEY = "viewer_key";

function getOrCreateViewerKey(): string {
  let key = localStorage.getItem(STORAGE_KEY);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, key);
  }
  return key;
}

type ViewPingResponse = {
  viewer_count: number;
};

export function useViewerPing(roomId: string, isLive: boolean) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    if (!isLive || !roomId) {
      setViewCount(0);
      return;
    }

    let active = true;
    const viewerKey = getOrCreateViewerKey();

    const ping = async () => {
      try {
        const res = await apiFetch(`/live-rooms/${roomId}/view/ping`, {
          method: "POST",
          body: JSON.stringify({ viewer_key: viewerKey }),
        });

        const data: ViewPingResponse = await res.json();
        setViewCount(data.viewer_count);
      } catch (err) {
        console.error("viewer ping error:", err);
      }
    };

    ping();
    intervalRef.current = setInterval(ping, PING_INTERVAL);

    return () => {
      active = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [roomId, isLive]);

  return { viewCount };
}
