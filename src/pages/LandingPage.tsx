import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { WorkflowSection } from '@/components/landing/WorkflowSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { Footer } from '@/components/landing/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <BenefitsSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
