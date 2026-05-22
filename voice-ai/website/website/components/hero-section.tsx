"use client"

import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(24,55,101,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(24,55,101,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Decorative barber pole stripes on sides */}
        <div className="absolute left-0 top-0 bottom-0 w-2 barber-pole-vertical animate-barber-pole opacity-30" />
        <div className="absolute right-0 top-0 bottom-0 w-2 barber-pole-vertical animate-barber-pole opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered Booking</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
            >
              <span className="text-gradient">Sharp Cuts.</span>
              <br />
              <span className="text-gradient-red">Smart Booking.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Team12 Barbershop delivers clean fades, fresh styles, and AI-powered appointment booking. Experience the future of grooming.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-base px-8" asChild>
                <a href="#book">
                  <Calendar className="h-5 w-5" />
                  Book an Appointment
                </a>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-base px-8 border-accent/30 text-accent hover:bg-accent/10" asChild>
                <a href="#services">
                  View Services
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border"
            >
              {[
                { value: '2K+', label: 'Happy Clients' },
                { value: '5+', label: 'Years Experience' },
                { value: '4.9', label: 'Star Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-3xl blur-2xl" />
              <div className="relative glass-card rounded-3xl p-8 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-xs text-emerald-600 font-medium">AI Booking Assistant Online</span>
                  </div>
                </div>

                {/* Dashboard Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Today&apos;s Overview</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-secondary rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-foreground">12</div>
                      <div className="text-xs text-muted-foreground">Bookings</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-600">9</div>
                      <div className="text-xs text-muted-foreground">Confirmed</div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-amber-600">3</div>
                      <div className="text-xs text-muted-foreground">Pending</div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Recent AI Bookings</h4>
                  {[
                    { name: 'Jonathan', time: '3:00 PM', service: 'Fresh Fade' },
                    { name: 'Mike', time: '4:30 PM', service: 'Beard Trim' },
                  ].map((booking, i) => (
                    <motion.div
                      key={booking.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                          {booking.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{booking.name}</div>
                          <div className="text-xs text-muted-foreground">{booking.service}</div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{booking.time}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements - Smooth CSS animation */}
            <div className="absolute -top-6 -right-6 glass rounded-2xl p-4 shadow-xl available-now-badge">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-foreground">Available Now</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
