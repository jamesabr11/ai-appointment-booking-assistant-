"use client"

import { motion } from 'framer-motion'
import { Users, Scissors, Award, Instagram, Star } from 'lucide-react'
import { barbers } from '@/lib/types'

const gradients = [
  'from-primary/30 to-primary/10',
  'from-accent/30 to-accent/10',
  'from-emerald-500/30 to-emerald-500/10',
]

export function BarbersSection() {
  return (
    <section id="team" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/20">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
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
            <Users className="h-4 w-4 text-accent" />
            <span className="text-sm text-accent font-medium">Our Team</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Meet the <span className="text-gradient-red">Barbers</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert stylists with years of experience delivering precision cuts and exceptional service.
          </p>
        </motion.div>

        {/* Barbers Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {barbers.map((barber, index) => (
            <motion.div
              key={barber.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative glass-card rounded-3xl p-6 text-center hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
                {/* Avatar */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} rounded-full blur-lg opacity-50`} />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center border-2 border-border group-hover:border-primary/50 transition-colors">
                    <span className="text-4xl font-bold text-gradient">{barber.name[0]}</span>
                  </div>
                  {/* Online Badge */}
                  <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-background border-2 border-emerald-500 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold mb-1 text-foreground">{barber.name}</h3>
                <p className="text-primary text-sm font-medium mb-4">{barber.specialty}</p>

                {/* Stats */}
                <div className="flex items-center justify-center gap-4 mb-5">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-medium text-foreground">4.9</span>
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center gap-1">
                    <Scissors className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">500+ cuts</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap justify-center gap-2 mb-5">
                  {['Fades', 'Lineups', 'Designs'].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-xs bg-secondary text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social */}
                <div className="flex justify-center gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Award className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
