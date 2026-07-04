import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import HowItWorks from '@/components/how-it-works'
import LanguageCards from '@/components/language-cards'
import WhyTonguesTrend from '@/components/why-tongues-trend'
import PricingPreview from '@/components/pricing-preview'
import Testimonials from '@/components/testimonials'
import CTABanner from '@/components/cta-banner'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="w-full bg-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <LanguageCards />
      <WhyTonguesTrend />
      <PricingPreview />
      <Testimonials />
      <CTABanner />
      <Footer />
    </main>
  )
}
