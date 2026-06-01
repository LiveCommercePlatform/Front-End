"use client";

import { useState } from "react";
import { Mail, Phone, MessageCircle, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !content.trim()) {
      toast.error("لطفاً همه فیلدها را کامل کنید.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await apiFetch("/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          content,
        }),
      });

      if (!res.ok) {
        throw new Error("ارسال پیام ناموفق بود.");
      }

      toast.success("پیام شما با موفقیت ارسال شد.");
      setName("");
      setEmail("");
      setContent("");
    } catch (error) {
      toast.error("مشکلی در ارسال پیام پیش آمد. دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="space-y-24 pb-24">
      <section className="bg-gradient-to-b from-primary/10 to-background">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">
            با ما در ارتباط باشید
          </h1>
          <p className="mx-auto max-w-xl text-sm opacity-80 md:text-base">
            سوال، پیشنهاد یا همکاری؟
            <br className="hidden sm:block" />
            خوشحال می‌شیم صدات رو بشنویم.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2">
        {/* ===== INFO ===== */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold md:text-2xl">راه‌های ارتباطی</h2>

          <ContactItem
            icon={<Mail className="h-5 w-5" />}
            title="ایمیل"
            value="support@yourplatform.com"
          />

          <ContactItem
            icon={<Phone className="h-5 w-5" />}
            title="تلفن"
            value="۰۲۱-۱۲۳۴۵۶۷۸"
          />

          <ContactItem
            icon={<MessageCircle className="h-5 w-5" />}
            title="پشتیبانی آنلاین"
            value="همه‌روزه ۹ تا ۱۸"
          />

          <p className="text-sm leading-relaxed opacity-70">
            تیم ما در سریع‌ترین زمان ممکن پیام شما رو بررسی
            و پاسخ می‌ده.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">ارسال پیام</h3>

          <div className="space-y-3">
            <Input
              placeholder="نام شما"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              type="email"
              placeholder="ایمیل"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Textarea
              rows={4}
              placeholder="پیام شما..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال ارسال...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                ارسال پیام
              </>
            )}
          </Button>
        </form>
      </section>

      <section className="text-center">
        <p className="mb-4 text-sm opacity-70">
          اگر فروشنده هستی، همین الان شروع کن 👇
        </p>
        <Button size="lg">شروع فروش زنده</Button>
      </section>
    </main>
  );
}

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
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-sm opacity-70">{value}</div>
      </div>
    </div>
  );
}
