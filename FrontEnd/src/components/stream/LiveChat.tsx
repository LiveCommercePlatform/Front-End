"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

const messages = [
  { id: 1, name: "ویجایا آبادی", text: "سلام بچه‌ها! آماده‌اید؟", avatar: "/u1.png" },
  { id: 2, name: "جانی وایز", text: "خیلی ویدیو جالبیه 👌", avatar: "/u2.png" },
  { id: 3, name: "بودی حکیم", text: "اسکیت خیلی باحاله 😎", avatar: "/u3.png" },
  { id: 4, name: "توماس هوپ", text: "من تازه شروع کردم یاد گرفتن.", avatar: "/u4.png" },
]

export function LiveChat() {
  return (
    <Card className="rounded-2xl shadow-lg flex flex-col h-[500px] bg-muted/30">
      <CardContent className="flex flex-col flex-1 p-4 space-y-4">
        <h3 className="font-semibold text-lg">چت زنده</h3>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-3 items-start">
              <img src={msg.avatar} alt={msg.name} className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-sm font-medium">{msg.name}</p>
                <p className="text-xs text-muted-foreground">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input placeholder="پیامت رو بنویس..." className="flex-1" />
          <Button size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
