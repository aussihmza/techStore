import AboutHero from "@/components/about/AboutHero";
import PrecisionSection from "@/components/about/PrecisionSection";
import ValuesSection from "@/components/about/ValuesSection";
import FootprintSection from "@/components/about/FootprintSection";
import EcosystemCta from "@/components/about/EcosystemCta";

export default function AboutPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
      <div className="pt-6">
        <AboutHero />
      </div>
      <PrecisionSection />
      <ValuesSection />
      <FootprintSection />
      <EcosystemCta />
    </div>
  );
}
