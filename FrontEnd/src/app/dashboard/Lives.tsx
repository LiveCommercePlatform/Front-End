"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import ListToolbar from "@/components/ui/ListToolbar";
import { Button } from "@/components/ui/button";
import StreamCard from "@/components/stream/StreamCard";
import StreamUpsertModal from "@/components/stream/StreamUpsertModal";
import DeleteDialog from "@/components/ui/DeleteDialog";

import type { Stream, StreamStatus } from "@/types";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useLiveRooms } from "@/context/LiveRoomContext";

export default function LivesTab() {
  const router = useRouter();
  const { lives, fetchLiveRooms, deleteLiveRoom } = useLiveRooms();
  const [status, setStatus] = useState<StreamStatus | "all">("all");
  const [openUpsert, setOpenUpsert] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Stream | undefined>(undefined);
  
  useEffect(() => {
    fetchLiveRooms({
      status: status == "all" ? undefined : status,
    });
  }, [status]);

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

  const goToStream = (s: Stream) => {
    router.push(`/stream/${s.ID}`);
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
            />
          </div>
        ))}

        {lives.length === 0 && (
          <div className="px-10  py-20 text-center text-sm opacity-70">
            لایو استریمی یافت نشد!
          </div>
        )}
      </div>

      <StreamUpsertModal
        open={openUpsert}
        mode={mode}
        initial={editing}
        onClose={() => setOpenUpsert(false)}
      />
    </div>
  );
}
