"use client";

import { VideoInfo } from "@/components/stream/VideoInfo";
import { LiveChat } from "@/components/stream/LiveChat";
import { useParams } from "next/navigation";
import { useLiveStream } from "@/hooks/useLiveStream";
import Loading from "@/components/ui/Loading";
import NotFound from "@/components/ui/NotFound";
import { tokenStore } from "@/lib/token";
import LiveBroadcaster from "@/components/stream/Broadcaster/LiveBroadcaster";
import LiveViewer from "@/components/stream/Viewer/LiveViewer";

export default function StreamPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  const {
    stream,
    stats,
    myReaction,
    loading,
    error,
    like,
    dislike,
    refetch,
    pinLiveProduct,
    end,
    removeProductFromLive,
  } = useLiveStream(id,false);
  const UserID = tokenStore.getUserId();
  const IsHost = stream?.HostID == UserID;
  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!stream || !stats)
    return <NotFound title="لایو استریم مورد نظر پیدا نشد." />;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {IsHost ? (
            <LiveBroadcaster roomId={stream.ID} status={stream.Status} />
          ) : (
            <LiveViewer roomId={stream.ID} status={stream.Status} />
          )}{" "}
          <VideoInfo
            streamInfo={stream}
            stat={stats}
            myReaction={myReaction}
            isOwner={IsHost}
            onLike={like}
            onDislike={dislike}
            onRefresh={refetch}
            onPin={pinLiveProduct}
            onDelete={removeProductFromLive}
          />
        </div>

        <div className="space-y-6">
          <LiveChat id={stream.ID} UserId={UserID || ""} Livestatus={stream.Status} />
        </div>
      </div>
    </div>
  );
}
