"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Video,
  Users,
  ShoppingBag,
  Sparkles,
  Rocket,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();
  return (
    <main className="space-y-24">
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/40 to-background">
        <div className="max-w-6xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            ما اومدیم فروش آنلاین رو زنده کنیم
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-lg opacity-80 leading-relaxed">
            پلتفرم ما جاییه که فروشنده و مشتری رو در لحظه، واقعی و شفاف
            به هم وصل می‌کنه — با لایو، گفتگو و اعتماد.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold">
            مأموریت ما
          </h2>
          <p className="text-sm md:text-base opacity-80 leading-loose">
            ما باور داریم آینده‌ی تجارت آنلاین فقط «کلیک» نیست.
            آینده، تعامل زنده، شفافیت و اعتماد واقعیه.
            هدف ما اینه که فروش آنلاین رو انسانی‌تر، جذاب‌تر
            و مؤثرتر کنیم.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <MissionCard
            icon={<Video />}
            title="لایو واقعی"
            desc="فروش زنده با ارتباط مستقیم"
          />
          <MissionCard
            icon={<Users />}
            title="تعامل انسانی"
            desc="چت، سوال، جواب واقعی"
          />
          <MissionCard
            icon={<ShoppingBag />}
            title="فروش مؤثر"
            desc="اعتماد = فروش بیشتر"
          />
          <MissionCard
            icon={<Sparkles />}
            title="تجربه نو"
            desc="فراتر از فروش سنتی"
          />
        </div>
      </section>

      <section className="bg-card border-y">
        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-3 gap-8 text-center">
          <WhyCard
            title="اعتماد بیشتر"
            desc="مشتری محصول رو زنده می‌بینه، نه فقط عکس."
          />
          <WhyCard
            title="تعامل لحظه‌ای"
            desc="سؤال می‌پرسه، جواب می‌گیره، تصمیم می‌گیره."
          />
          <WhyCard
            title="فروش بالاتر"
            desc="لایو، نرخ تبدیل رو چند برابر می‌کنه."
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
          ارزش‌های ما
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <ValueCard title="شفافیت">
            هیچ چیز پنهان نیست، همه‌چیز زنده‌ست.
          </ValueCard>
          <ValueCard title="اعتماد">
            پایه‌ی هر فروش موفق.
          </ValueCard>
          <ValueCard title="نوآوری">
            همیشه یک قدم جلوتر.
          </ValueCard>
        </div>
      </section>

      <section className="text-center ">
        <h3 className="text-xl md:text-2xl font-semibold mb-4">
          آماده‌ای وارد دنیای فروش زنده بشی؟
        </h3>
        <p className="text-sm opacity-70 mb-6">
          اولین لایوت رو همین امروز شروع کن
        </p>

        <Button size="lg" className="gap-2" onClick={()=>router.push("/register ")}>
          <Rocket className="w-4 h-4" />
          شروع کن
        </Button>
      </section>
    </main>
  );
}


function MissionCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border p-4 text-center space-y-2">
      <div className="flex justify-center text-primary">{icon}</div>
      <div className="font-medium">{title}</div>
      <div className="text-xs opacity-70">{desc}</div>
    </div>
  );
}

function WhyCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border bg-background p-6 space-y-3">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm opacity-70">{desc}</p>
    </div>
  );
}

function ValueCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-primary/50 shadow shadow-primary shadow-md hover:shadow-lg p-6 text-center space-y-2">
      <div className="font-semibold">{title}</div>
      <div className="text-sm opacity-70">{children}</div>
    </div>
  );
}
