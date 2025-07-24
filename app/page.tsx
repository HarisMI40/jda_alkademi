import FeaturesSection from "./_component/FeaturesSection";
import Footer from "./_component/Footer";
import Header from "./_component/Header";
import HeroSection from "./_component/HeroSection";
import KuisSection from "./_component/KuisSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1">
        <HeroSection />
        <KuisSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
