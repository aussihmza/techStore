import AboutHero from "@/user/components/about/AboutHero";
import PrecisionSection from "@/user/components/about/PrecisionSection";
import ValuesSection from "@/user/components/about/ValuesSection";
import FootprintSection from "@/user/components/about/FootprintSection";
import EcosystemCta from "@/user/components/about/EcosystemCta";

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
