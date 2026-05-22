import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { AIBookingSection } from '@/components/ai-booking-section'
import { ServicesSection } from '@/components/services-section'
import { BookingSection } from '@/components/booking-section'
import { BarbersSection } from '@/components/barbers-section'
import { GallerySection } from '@/components/gallery-section'
import { WhyChooseSection } from '@/components/why-choose-section'
import { ReviewsSection } from '@/components/reviews-section'
import { FAQSection } from '@/components/faq-section'
import { Footer } from '@/components/footer'
import { FloatingAIButton } from '@/components/floating-ai-button'
import { MouseGlow } from '@/components/mouse-glow'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <MouseGlow />
      <Navbar />
      <HeroSection />
      <AIBookingSection />
      <ServicesSection />
      <BookingSection />
      <BarbersSection />
      <GallerySection />
      <WhyChooseSection />
      <ReviewsSection />
      <FAQSection />
      <Footer />
      <FloatingAIButton />
    </main>
  )
}
