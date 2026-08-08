import Hero from "@/components/home/Hero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedSection from "@/components/featured/FeaturedSection";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <div className="page-shell">
      <div className="pt-0 sm:pt-2">
        <Hero />
      </div>
      <CategoryShowcase />
      <FeaturedSection />
      <Newsletter />
    </div>
  );
}
