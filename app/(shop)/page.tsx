import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import WhyChooseUsSection from "@/components/home/WhyUsSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <FeaturedCollection />
      <WhyChooseUsSection />
    </main>
  );
}
