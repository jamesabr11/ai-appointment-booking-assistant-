"use client"

import { motion } from 'framer-motion'
import { Info, Award, Users, Clock, Sparkles } from 'lucide-react'

const stats = [
  { icon: Users, value: '2000+', label: 'Happy Clients' },
  { icon: Award, value: '5+', label: 'Years Experience' },
  { icon: Clock, value: '40min', label: 'Avg. Service Time' },
  { icon: Sparkles, value: '99%', label: 'Satisfaction Rate' },
]

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/20">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Info className="h-4 w-4 text-accent" />
            <span className="text-sm text-accent font-medium">Our Story</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            About <span className="text-gradient-blue">Team12</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Where classic barbershop traditions meet modern technology.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-foreground">
              Sharp Cuts. Smart Booking. Real Community.
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Team12 Barbershop was founded with a simple mission: deliver premium haircuts with zero hassle. Located in the heart of Vancouver, we&apos;ve built a reputation for precision cuts, clean fades, and an atmosphere that feels like home.
              </p>
              <p>
                What sets us apart? We&apos;ve embraced technology without losing our soul. Our AI booking assistant means no hold times, no phone tag - just speak naturally and you&apos;re booked. But when you walk through our doors, you&apos;ll find the same warm, classic barbershop experience that&apos;s been bringing people together for generations.
              </p>
              <p>
                Our team of skilled barbers each brings their own specialty to the chair. Whether you want a fresh fade, a classic taper, or expert beard work, we&apos;ve got you covered. Every cut is a craft, and every client leaves looking and feeling their best.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#team"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Meet Our Team
              </a>
              <a
                href="#book"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-foreground font-medium hover:bg-secondary transition-colors"
              >
                Book Now
              </a>
            </div>
          </motion.div>

          {/* Right - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
