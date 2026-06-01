"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import ListToolbar from "@/components/ui/ListToolbar";
import { Button } from "@/components/ui/button";
import StreamCard from "@/components/stream/StreamCard";
import StreamUpsertModal from "@/components/stream/StreamUpsertModal";

import type { Stream, StreamStatus } from "@/types";
import { Plus } from "lucide-react";
import { useLiveRooms } from "@/context/LiveRoomContext";
import toast from "react-hot-toast";
import NotFound from "@/components/ui/NotFound";
import { tokenStore } from "@/lib/token";

export default function LivesTab() {
  const router = useRouter();
  const { lives, fetchLiveRooms, deleteLiveRoom, startStream, endStream } =
    useLiveRooms();
  const [status, setStatus] = useState<StreamStatus | "all">("all");
  const [openUpsert, setOpenUpsert] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Stream | undefined>(undefined);
  const currentUserId = tokenStore.getUserId();
  useEffect(() => {
    fetchLiveRooms({
      status: status == "all" ? undefined : status,
      host_id: currentUserId ? currentUserId : ""
    });
  }, [status]);

  // const filteredLives = useMemo(() => {
  //   if (!hostId) return [];
  //   return lives.filter((s) => s.HostID === hostId);
  // }, [lives, hostId]);

  const openCreate = () => {
    setMode("create");
    setEditing(undefined);
    setOpenUpsert(true);
  };

  const openEdit = (s: Stream) => {
    setMode("edit");
    setEditing(s);
    setOpenUpsert(true);
  };

  const handleDelete = (s: Stream) => {
    deleteLiveRoom(s.ID);
  };

  const handleStart = async (s: Stream) => {
    const ok = await startStream(s.ID);

    if (ok) {
      router.push(`/Live_Rooms/${s.ID}`);
    }
  };

  const handleEnd = async (s: Stream) => {
    const ok = await endStream(s.ID);
  };

  const goToStream = (s: Stream) => {
    router.push(`/Live_Rooms/${s.ID}`);
  };

  return (
    <div className="space-y-6">
      <ListToolbar
        filters={[
          {
            key: "status",
            value: status,
            onChange: setStatus,
            options: [
              { label: "همه وضعیت‌ها", value: "all" },
              { label: "در آینده", value: "scheduled" },
              { label: "درحال پخش", value: "live" },
              { label: "پایان‌یافته", value: "ended" },
            ],
          },
        ]}
        actions={
          <Button className="gap-2" onClick={openCreate}>
            <Plus className="w-4 h-4" />
            ساخت استریم
          </Button>
        }
      />

      <div className="space-y-3">
        {lives.map((s) => (
          <div key={s.ID} className="relative">
            <StreamCard
              stream={s}
              onView={goToStream}
              onEdit={openEdit}
              onDelete={handleDelete}
              onStart={handleStart}
              onEnd={handleEnd}
            />
          </div>
        ))}

        {lives.length === 0 && <NotFound message="" />}
      </div>

      <StreamUpsertModal
        open={openUpsert}
        mode={mode}
        initial={editing}
        onClose={() => 
          setOpenUpsert(false)
        }
      />
    </div>
  );
}
