import { HeroSection } from '@/components/home/hero-section';
import { ServicesSection } from '@/components/home/services-section';
import { ClientPortalSection } from '@/components/home/client-portal-section';
import { DeliveriesSection } from '@/components/home/deliveries-section';
import { WhySection } from '@/components/home/why-section';
import { FooterSection } from '@/components/home/footer-section';
import { Navbar } from '@/components/home/navbar';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <ClientPortalSection />
      <DeliveriesSection />
      <WhySection />
      <FooterSection />
    </main>
  );
}
