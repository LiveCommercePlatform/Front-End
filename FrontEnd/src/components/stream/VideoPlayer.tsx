"use client"
import { Card, CardContent } from "@/components/ui/card"

export function VideoPlayer() {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-lg">
      <CardContent className="p-0">
        <video 
          className="w-full h-[400px] object-cover" 
          controls 
          poster="/thumbnail.jpg"
        >
          <source src="/sample-video.mp4" type="video/mp4" />
        </video>
      </CardContent>
    </Card>
  )
}
