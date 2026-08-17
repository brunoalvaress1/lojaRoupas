import { HeroVideo } from "@/components/home/HeroVideo";
import { NoveltiesSection } from "@/components/home/NoveltiesSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { StoreExperienceSection } from "@/components/home/StoreExperienceSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { WhatsAppCTASection } from "@/components/home/WhatsAppCTASection";

export default function Home() {
  return (
    <>
      <HeroVideo />
      <NoveltiesSection />
      <CategoriesSection />
      <FeaturedSection />
      <StoreExperienceSection />
      <InstagramSection />
      <WhatsAppCTASection />
    </>
  );
}
