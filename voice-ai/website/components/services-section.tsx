"use client"

import { motion } from 'framer-motion'
import { Scissors, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { services } from '@/lib/types'

export function ServicesSection() {
  return (
    <section id="services" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        {/* Decorative stripes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1 barber-stripe opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Scissors className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Our Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Premium <span className="text-gradient-red">Grooming Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From fresh fades to classic cuts, we offer a full range of barbering services tailored to your style.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative glass-card rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Price Badge */}
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-lg font-bold text-primary">${service.price}</span>
                  </div>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-5 group-hover:from-primary/30 group-hover:to-accent/20 transition-colors">
                  <Scissors className="h-7 w-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2 text-foreground">{service.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration}</span>
                </div>

                {/* CTA */}
                <Button
                  variant="ghost"
                  className="w-full justify-between group/btn hover:bg-primary/10 text-foreground"
                  asChild
                >
                  <a href="#book">
                    <span>Book Now</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
