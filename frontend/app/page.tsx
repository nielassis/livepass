import { Header } from "@/app/components/landing/header";
import { HeroSection } from "@/app/components/landing/hero-section";
import { FeaturesSection } from "@/app/components/landing/features-section";
import { HowItWorksSection } from "@/app/components/landing/how-it-works-section";
import { PricingSection } from "@/app/components/landing/pricing-section";
import { CTASection } from "@/app/components/landing/cta-section";
import { Footer } from "@/app/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
