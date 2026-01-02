import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { PackagesSection } from "@/components/PackagesSection";
import { AmenitiesSection } from "@/components/AmenitiesSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <PackagesSection />
        <AmenitiesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
