"use client"

import { motion } from 'framer-motion'
import { Phone, Mic, CheckCircle2, User, Calendar, Clock } from 'lucide-react'

const transcriptMessages = [
  { role: 'assistant', text: "Hi, this is Team12's AI booking assistant. What is your first name?" },
  { role: 'customer', text: 'Jonathan' },
  { role: 'assistant', text: 'What phone number should we use?' },
  { role: 'customer', text: '250-123-1736' },
  { role: 'assistant', text: 'What day and time would you like to come in?' },
  { role: 'customer', text: 'Friday at 3 PM' },
  { role: 'assistant', text: "Perfect. I'll confirm your appointment details." },
]

const features = [
  { icon: User, title: 'Name Collection', description: 'AI collects customer first name' },
  { icon: Phone, title: 'Phone Verification', description: 'Captures contact number for confirmation' },
  { icon: Calendar, title: 'Date Selection', description: 'Flexible booking day preferences' },
  { icon: Clock, title: 'Time Booking', description: 'Finds available time slots' },
]

export function AIBookingSection() {
  return (
    <section id="ai-booking" className="relative py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
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
            <Mic className="h-4 w-4 text-accent" />
            <span className="text-sm text-accent font-medium">Voice AI Technology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">AI-Powered</span> Booking Assistant
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Call our shop and let our intelligent voice assistant handle your booking. No waiting on hold, no complex apps—just a natural conversation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Transcript Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-xl" />
            <div className="relative glass-card rounded-3xl p-6 sm:p-8">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">AI Voice Assistant</div>
                    <div className="text-xs text-muted-foreground">Live Call Transcript</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Voice Waveform Animation */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-primary rounded-full"
                        animate={{ height: [8, 20, 8] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Transcript Messages */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {transcriptMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${msg.role === 'customer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                        msg.role === 'customer'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-secondary text-foreground rounded-bl-md'
                      }`}
                    >
                      <div className={`text-xs mb-1 ${msg.role === 'customer' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {msg.role === 'customer' ? 'Customer' : 'Assistant'}
                      </div>
                      <div className="text-sm">{msg.text}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Confirmation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <div>
                    <div className="text-sm font-medium text-emerald-600">Booking Confirmed</div>
                    <div className="text-xs text-muted-foreground">Friday at 3 PM - Fresh Fade</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-xl p-5 group hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Card */}
            <div className="glass-card rounded-xl p-6 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Ready to Book?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Call us anytime and our AI assistant will handle your booking in under a minute.
                  </p>
                  <div className="text-2xl font-bold text-gradient-red">(778) 562-8468</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
