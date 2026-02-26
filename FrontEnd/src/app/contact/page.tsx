"use client";

import { Mail, Phone, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <main className="space-y-24 pb-24">
      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            با ما در ارتباط باشید
          </h1>
          <p className="text-sm md:text-base opacity-80 max-w-xl mx-auto">
            سوال، پیشنهاد یا همکاری؟  
            خوشحال می‌شیم صدات رو بشنویم.
          </p>
        </div>
      </section>

     <section className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        {/* ===== INFO ===== */}
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold">
            راه‌های ارتباطی
          </h2>

          <ContactItem
            icon={<Mail />}
            title="ایمیل"
            value="support@yourplatform.com"
          />

          <ContactItem
            icon={<Phone />}
            title="تلفن"
            value="۰۲۱-۱۲۳۴۵۶۷۸"
          />

          <ContactItem
            icon={<MessageCircle />}
            title="پشتیبانی آنلاین"
            value="همه‌روزه ۹ تا ۱۸"
          />

          <p className="text-sm opacity-70 leading-relaxed">
            تیم ما در سریع‌ترین زمان ممکن پیام شما رو بررسی
            و پاسخ می‌ده.
          </p>
        </div>

        <div className="rounded-xl border p-6 space-y-4">
          <h3 className="text-lg font-semibold">ارسال پیام</h3>

          <div className="space-y-3">
            <Input placeholder="نام شما" />
            <Input placeholder="ایمیل" />
            <Textarea rows={4} placeholder="پیام شما..." />
          </div>

          <Button className="gap-2 w-full">
            <Send className="w-4 h-4" />
            ارسال پیام
          </Button>
        </div>
      </section>

      <section className="text-center">
        <p className="text-sm opacity-70 mb-4">
          اگر فروشنده هستی، همین الان شروع کن 👇
        </p>
        <Button size="lg">شروع فروش زنده</Button>
      </section>
    </main>
  );
}

/* ================= SMALL COMPONENT ================= */

function ContactItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-sm opacity-70">{value}</div>
      </div>
    </div>
  );
}
