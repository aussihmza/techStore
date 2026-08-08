import Hero from "@/user/components/home/Hero";
import CategoryShowcase from "@/user/components/home/CategoryShowcase";
import FeaturedSection from "@/user/components/featured/FeaturedSection";
import Newsletter from "@/user/components/home/Newsletter";

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
