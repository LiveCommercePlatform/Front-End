import HeroSection from "@/components/Home/HeroProps";

export default function Home() {
  return (
    <main>
      <HeroSection
        liveThumbnail="/images/thumbnail.png"
        viewersCount={120}
        sellersCount={15}
        ctaUrl={"/stream"} 
      />
    </main>
  );
}
