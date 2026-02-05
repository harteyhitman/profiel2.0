import FivefoldMinistry from '@/components/landingPage/FivefoldMinistry/FivefoldMinistry';
import FAQSection from '@/components/landingPage/FAQSection/FAQSection';
import Hero from '@/components/landingPage/Hero/Hero';
import HowItWorks from '@/components/landingPage/HowItWorks/HowItWorks';
import MapSection from '@/components/landingPage/MapSection/MapSection';
import Subscription from '@/components/landingPage/Subscription/Subscription';
import Testimonials from '@/components/landingPage/Testimonials/Testimonials';
import WhyChooseUs from '@/components/landingPage/WhyChooseUs/WhyChooseUs';
import CTABanner from '@/components/ui/CTABanner/CTABanner';

const Features = () => {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <FivefoldMinistry />
      <WhyChooseUs />
      <MapSection />
      <Subscription />
      <Testimonials />
      <FAQSection />
      <CTABanner />
    </div>
  );
};

export default Features;
