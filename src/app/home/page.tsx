import Hero from "@/components/home/Hero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedSection from "@/components/featured/FeaturedSection";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
      <div className="pt-6">
        <Hero />
      </div>
      <CategoryShowcase />
      <FeaturedSection />
      <Newsletter />
    </div>
  );
}
