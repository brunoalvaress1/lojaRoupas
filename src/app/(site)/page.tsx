import { HeroVideo } from "@/components/home/HeroVideo";
import { NoveltiesSection } from "@/components/home/NoveltiesSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { StoreExperienceSection } from "@/components/home/StoreExperienceSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { WhatsAppCTASection } from "@/components/home/WhatsAppCTASection";
import { getProducts } from "@/lib/queries/products";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <HeroVideo />
      <NoveltiesSection products={products} />
      <CategoriesSection />
      <FeaturedSection products={products} />
      <StoreExperienceSection />
      <InstagramSection products={products} />
      <WhatsAppCTASection />
    </>
  );
}
