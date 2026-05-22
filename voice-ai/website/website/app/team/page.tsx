"use client"

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { BarbersSection } from '@/components/barbers-section'
import { MouseGlow } from '@/components/mouse-glow'
import { FloatingAIButton } from '@/components/floating-ai-button'

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-background">
      <MouseGlow />
      <Navbar />
      <div className="pt-20">
        <BarbersSection />
      </div>
      <Footer />
      <FloatingAIButton />
    </main>
  )
}
