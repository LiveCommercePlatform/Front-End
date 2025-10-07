import { VideoPlayer } from "@/components/stream/VideoPlayer"
import { VideoInfo } from "@/components/stream/VideoInfo"
import { LiveChat } from "@/components/stream/LiveChat"
import { RelatedVideos } from "@/components/stream/RelatedVideos"

export default function StreamPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* بخش ویدیو + توضیحات */}
        <div className="lg:col-span-2 space-y-6">
          <VideoPlayer />
          <VideoInfo />
        </div>

        {/* بخش چت و ویدیوهای مرتبط */}
        <div className="space-y-6">
          <LiveChat />
          <RelatedVideos />
        </div>
      </div>
    </div>
  )
}
