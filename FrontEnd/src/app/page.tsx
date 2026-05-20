import HeroSection from "@/components/Home/HeroSection";
import AuthCTASection from "@/components/Home/AuthCTASection";
import LiveStreamsSection from "@/components/Home/LiveStreamsSection";
import StatsSection from "@/components/Home/StatsSection";
import HowItWorksSection from "@/components/Home/HowItWorksSection";
import FAQSection from "@/components/Home/FAQSection";
import MobileStickyCTA from "@/components/Home/MobileAuthCTA";
import { tokenStore } from "@/lib/token";

export default function Home() {
  const isLoggedIn = !tokenStore.getAccess;

  return (
    <main className="space-y-0">
      <HeroSection />
      <LiveStreamsSection />
      <div className="hidden md:block">
        <StatsSection />
      </div>

      {!isLoggedIn && (
        <div className="hidden md:block">
          <AuthCTASection page="home" usersCount={1240} />
        </div>
      )}

      <HowItWorksSection />
      <FAQSection />

      {!isLoggedIn && (
        <div className="md:hidden">
          <MobileStickyCTA />
        </div>
      )}
    </main>
  );
}
