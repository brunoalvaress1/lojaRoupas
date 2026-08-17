import { Header } from "@/components/layout/Header";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { AppDataProvider } from "@/context/AppDataContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { getStoreSettings } from "@/lib/queries/settings";
import { getCategories } from "@/lib/queries/categories";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([
    getStoreSettings(),
    getCategories(),
  ]);

  return (
    <AppDataProvider value={{ settings, categories }}>
      <FavoritesProvider>
        <Header />
        <MobileHeader />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNav />
      </FavoritesProvider>
    </AppDataProvider>
  );
}
