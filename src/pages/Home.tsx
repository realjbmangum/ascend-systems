import SEO from '../components/SEO';
import HeroSection from '../components/HeroSection';
import TrustedBySection from '../components/TrustedBySection';
import ServicesSection from '../components/ServicesSection';
import CalculatorCTASection from '../components/CalculatorCTASection';
import ProcessSection from '../components/ProcessSection';
import CaseStudiesSection from '../components/CaseStudiesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import FinalCTASection from '../components/FinalCTASection';

export default function Home() {
  return (
    <>
      <SEO
        title="Ascend Systems | Custom Software & AI for Growing Businesses | Charlotte, NC"
        description="Software that moves legacy businesses forward. Custom SaaS, AI agents, and internal tools built by senior engineers. Based in Charlotte, NC."
      />
      <HeroSection />
      <TrustedBySection />
      <ServicesSection />
      <ProcessSection />
      <CaseStudiesSection />
      <TestimonialsSection />
      <FAQSection />
      <CalculatorCTASection />
      <FinalCTASection />
    </>
  );
}
