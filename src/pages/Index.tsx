import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TechSection from "@/components/TechSection";
import InfraSection from "@/components/InfraSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TechSection />
      <InfraSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
