import HeroSection from "@/components/Home/HeroSection";
import AuthCTASection from "@/components/Home/AuthCTASection";
import LiveStreamsSection from "@/components/Home/LiveStreamsSection";
import StatsSection from "@/components/Home/StatsSection";
import HowItWorksSection from "@/components/Home/HowItWorksSection";
import FAQSection from "@/components/Home/FAQSection";
import MobileStickyCTA from "@/components/Home/MobileAuthCTA";
import { tokenStore } from "@/lib/token";

export default function Home() {
  const isLoggedIn = !!tokenStore.getAccess;

  return (
    <main className="space-y-0">
      {/* Hero همیشه هست */}
      <HeroSection />

      {/* Live Streams همیشه هست */}
      <LiveStreamsSection />

      {/* Stats فقط دسکتاپ */}
      <div className="hidden md:block">
        <StatsSection />
      </div>

      {/* CTA دسکتاپ فقط وقتی لاگین نیست */}
      {!isLoggedIn && (
        <div className="hidden md:block">
          <AuthCTASection page="home" usersCount={1240} />
        </div>
      )}

      {/* How it works همیشه هست */}
      <HowItWorksSection />

      {/* FAQ همیشه هست */}
      <FAQSection />

      {/* Sticky CTA فقط موبایل + فقط وقتی لاگین نیست */}
      {!isLoggedIn && (
        <div className="md:hidden">
          <MobileStickyCTA />
        </div>
      )}
    </main>
  );
}
