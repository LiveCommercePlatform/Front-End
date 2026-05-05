"use client";

import { VideoPlayer } from "@/components/stream/VideoPlayer";
import { VideoInfo } from "@/components/stream/VideoInfo";
import { LiveChat } from "@/components/stream/LiveChat";
import { RelatedVideos } from "@/components/stream/RelatedVideos";
import { useParams } from "next/navigation";
import { useLiveStream } from "@/hooks/useLiveStream";
import Loading from "@/components/ui/Loading";
import NotFound from "@/components/ui/NotFound";

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
    removeProductFromLive,
  } = useLiveStream(id);

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
          <VideoPlayer />

          <VideoInfo
            streamInfo={stream}
            stat={stats}
            myReaction={myReaction}
            onLike={like}
            onDislike={dislike}
            onRefresh={refetch}
            onPin={pinLiveProduct}
            onDelete={removeProductFromLive}
          />
        </div>

        <div className="space-y-6">
          <LiveChat />
          <RelatedVideos />
        </div>

      </div>
    </div>
  );
}
