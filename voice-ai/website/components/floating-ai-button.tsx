"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, X, Mic } from 'lucide-react'

export function FloatingAIButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button - Instant hover response */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-primary shadow-lg glow-red flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6 text-primary-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="phone"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <Phone className="h-6 w-6 text-primary-foreground" />
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" style={{ animationDuration: '2s' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Popup Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-80 glass-card rounded-2xl p-5 shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Booking Assistant</h3>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" style={{ animationDuration: '2s' }} />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs text-emerald-600">Online & Ready</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <p className="text-sm text-muted-foreground mb-4">
              Call now and our AI assistant will book your appointment in under a minute. No waiting on hold!
            </p>

            {/* Phone Number */}
            <a
              href="tel:7785628468"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-5 w-5" />
              (778) 562-8468
            </a>

            {/* Voice Animation */}
            <div className="flex items-center justify-center gap-1 mt-4">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary/40 rounded-full"
                  animate={{ height: [4, 16, 4] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
