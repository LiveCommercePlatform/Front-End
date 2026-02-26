"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "خرید از طریق لایو امن هست؟",
    a: "بله. پرداخت‌ها کاملاً امن انجام می‌شن و تا زمان دریافت محصول، مبلغ نزد پلتفرم باقی می‌مونه.",
  },
  {
    q: "اگه سوالی درباره محصول داشته باشم چی؟",
    a: "می‌تونی همون لحظه داخل چت لایو از فروشنده سوال بپرسی و پاسخ بگیری.",
  },
  {
    q: "لازم هست حتماً ثبت‌نام کنم؟",
    a: "برای تماشای لایو نیازی به ثبت‌نام نیست، اما برای خرید باید وارد حساب کاربری بشی.",
  },
  {
    q: "فروشنده‌ها قابل اعتماد هستن؟",
    a: "همه فروشنده‌ها احراز هویت شدن و سابقه فروش و امتیازشون قابل مشاهده‌ست.",
  },
  {
    q: "بعد از خرید پشتیبانی دارم؟",
    a: "بله، تیم پشتیبانی و خود فروشنده تا تحویل کامل همراهت هستن.",
  },
];

export default function FAQSection() {
  return (
    <section className="bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10 items-center">
          <div className="md:col-span-1 text-right space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              سوالات پرتکرار
            </h2>
            <p className="text-sm opacity-70 leading-relaxed">
              اگه قبل از خرید یا تماشای لایو سوالی داری، احتمالاً جوابش اینجاست
            </p>
          </div>

          <div className="md:col-span-2">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="
                    relative rounded-xl border bg-card
                    before:absolute before:right-0 before:top-4 before:h-6 before:w-1
                    before:rounded-full before:bg-primary
                    data-[state=open]:bg-primary/5
                  "
                >
                  <AccordionTrigger
                    className="
                      text-right text-sm font-semibold px-4
                      text-foreground hover:text-primary
                    "
                  >
                    {item.q}
                  </AccordionTrigger>

                  <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
