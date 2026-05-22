"use client"

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AboutSection } from '@/components/about-section'
import { MouseGlow } from '@/components/mouse-glow'
import { FloatingAIButton } from '@/components/floating-ai-button'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <MouseGlow />
      <Navbar />
      <div className="pt-20">
        <AboutSection />
      </div>
      <Footer />
      <FloatingAIButton />
    </main>
  )
}
