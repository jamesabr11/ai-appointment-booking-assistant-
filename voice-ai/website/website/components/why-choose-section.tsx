"use client"

import { motion } from 'framer-motion'
import { 
  Zap, 
  Sparkles, 
  Bot, 
  GraduationCap, 
  CalendarCheck, 
  Building2,
  CheckCircle2
} from 'lucide-react'

const benefits = [
  {
    icon: Zap,
    title: 'Fast Booking',
    description: 'Book in under a minute with our AI assistant or online form.',
    color: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
  },
  {
    icon: Sparkles,
    title: 'Clean Professional Cuts',
    description: 'Precision styling from experienced barbers who care about details.',
    color: 'from-accent/20 to-accent/5',
    iconColor: 'text-accent',
  },
  {
    icon: Bot,
    title: 'AI-Powered Appointments',
    description: 'Our voice assistant handles bookings 24/7, no waiting on hold.',
    color: 'from-emerald-500/20 to-emerald-500/5',
    iconColor: 'text-emerald-600',
  },
  {
    icon: GraduationCap,
    title: 'Student-Friendly Pricing',
    description: 'Quality cuts at prices that respect your budget.',
    color: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-600',
  },
  {
    icon: CalendarCheck,
    title: 'Reliable Scheduling',
    description: 'Show up on time, get styled on time. We value your schedule.',
    color: 'from-rose-500/20 to-rose-500/5',
    iconColor: 'text-rose-600',
  },
  {
    icon: Building2,
    title: 'Modern Shop Experience',
    description: 'Clean, comfortable space with premium tools and products.',
    color: 'from-amber-500/20 to-amber-500/5',
    iconColor: 'text-amber-600',
  },
]

export function WhyChooseSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
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
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <span className="text-sm text-accent font-medium">Why Team12</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Why Choose <span className="text-gradient-red">Team12</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We combine traditional barbering excellence with modern technology to deliver an unmatched grooming experience.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl from-primary/10 to-transparent" />
              <div className="relative glass-card rounded-2xl p-6 h-full hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className={`h-7 w-7 ${benefit.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-card inline-flex items-center gap-4 rounded-full px-6 py-4">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-background flex items-center justify-center text-xs font-bold text-foreground"
                >
                  {['N', 'J', 'M', '+'][i]}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-foreground">Join 5,000+ satisfied clients</div>
              <div className="text-xs text-muted-foreground">Rated 4.9 stars on Google</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
