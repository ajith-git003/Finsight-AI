import HeroSection from "@/components/HeroSection";
import DashboardPreview from "@/components/DashboardPreview";
import GoalTracking from "@/components/GoalTracking";
import AIChat from "@/components/AIChat";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <DashboardPreview />
      <GoalTracking />
      <AIChat />
      <Footer />
    </div>
  );
};

export default Index;
