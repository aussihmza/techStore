import AboutHero from "@/components/about/AboutHero";
import PrecisionSection from "@/components/about/PrecisionSection";
import ValuesSection from "@/components/about/ValuesSection";
import FootprintSection from "@/components/about/FootprintSection";
import EcosystemCta from "@/components/about/EcosystemCta";

export default function AboutPage() {
  return (
    <div className="page-shell">
      <div className="pt-0 sm:pt-2">
        <AboutHero />
      </div>
      <PrecisionSection />
      <ValuesSection />
      <FootprintSection />
      <EcosystemCta />
    </div>
  );
}
