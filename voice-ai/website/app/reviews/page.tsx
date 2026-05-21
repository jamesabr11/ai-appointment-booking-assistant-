"use client"

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ReviewsSection } from '@/components/reviews-section'
import { MouseGlow } from '@/components/mouse-glow'
import { FloatingAIButton } from '@/components/floating-ai-button'

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-background">
      <MouseGlow />
      <Navbar />
      <div className="pt-20">
        <ReviewsSection />
      </div>
      <Footer />
      <FloatingAIButton />
    </main>
  )
}
