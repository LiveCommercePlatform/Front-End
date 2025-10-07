import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toPersianDigits, formatTimeAgo } from "@/lib/utils"

const videos = [
  { id: 1, title: "اولین پرش با اسکیت", views: 125908, createdAt: "2025-09-18T12:00:00Z", thumbnail: "/thumb1.jpg" },
  { id: 2, title: "ترفندهای اسکیت روی رمپ", views: 98234, createdAt: "2025-09-20T06:30:00Z", thumbnail: "/thumb2.jpg" },
]

export function RelatedVideos() {
  return (
    <Card className="rounded-2xl shadow-lg bg-muted/30">
      <CardContent className="p-4 space-y-4">
        <h3 className="font-semibold text-lg">ویدیوهای مرتبط</h3>

        <div className="space-y-3">
          {videos.map((video) => (
            <div key={video.id} className="flex gap-3">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-24 h-16 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm font-medium leading-tight">{video.title}</p>
                <p className="text-xs text-muted-foreground">
                  {toPersianDigits(video.views.toLocaleString())} بازدید •{" "}
                  {formatTimeAgo(video.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button variant="secondary" className="w-full">
          دیدن همه ویدیوهای مرتبط
        </Button>
      </CardContent>
    </Card>
  )
}
