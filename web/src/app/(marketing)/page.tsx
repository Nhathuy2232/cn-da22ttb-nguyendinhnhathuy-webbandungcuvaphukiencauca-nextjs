import { Header } from "@/components/Header";
import { Banner } from "@/components/Banner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FlashSale } from "@/components/FlashSale";
import { PromotionSection } from "@/components/PromotionSection";
import { ProductSection } from "@/components/ProductSection";
import { Footer } from "@/components/Footer";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>
        <Banner />
        <CategoryGrid />
        <FlashSale />
        <PromotionSection />
        <ProductSection />
      </main>
      <Footer />
    </div>
  );
}

