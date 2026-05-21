"use client"

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FAQSection } from '@/components/faq-section'
import { MouseGlow } from '@/components/mouse-glow'
import { FloatingAIButton } from '@/components/floating-ai-button'

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background">
      <MouseGlow />
      <Navbar />
      <div className="pt-20">
        <FAQSection />
      </div>
      <Footer />
      <FloatingAIButton />
    </main>
  )
}
