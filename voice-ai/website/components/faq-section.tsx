"use client"

import { motion } from 'framer-motion'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: 'How do I book an appointment?',
    answer: 'You can book online through our website, call our AI assistant at (778) 562-8468, or walk in during business hours. We recommend booking ahead to secure your preferred time slot.'
  },
  {
    question: 'What are your business hours?',
    answer: 'We are open Monday through Friday from 10 AM to 5 PM. We are closed on weekends.'
  },
  {
    question: 'How does the AI booking assistant work?',
    answer: 'Simply call (778) 562-8468 and speak naturally. Our AI assistant will collect your name, preferred date and time, and service selection. It confirms your booking instantly without any hold times.'
  },
  {
    question: 'Do you accept walk-ins?',
    answer: 'Yes! Walk-ins are welcome during business hours. However, appointments are given priority, so we recommend booking ahead to avoid wait times.'
  },
  {
    question: 'What services do you offer?',
    answer: 'We offer a variety of services including Fresh Fades ($35), Classic Cuts ($30), Beard Trims ($20), Line Ups ($15), Hair + Beard Combos ($50), and Student Cuts ($25).'
  },
  {
    question: 'Can I request a specific barber?',
    answer: 'Absolutely! When booking, you can request James, Nick, or Ahmad. Each barber has their own specialty, so feel free to choose based on the style you want.'
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'We appreciate at least 2 hours notice for cancellations. You can cancel or reschedule by calling us or through the booking confirmation link.'
  },
  {
    question: 'Do you offer student discounts?',
    answer: 'Yes! We offer a Student Cut for $25. Just show your valid student ID when you arrive.'
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-background">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-gradient-red">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our services, booking, and policies.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-muted-foreground">
                  {faq.answer}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Still have questions? We&apos;re here to help.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  )
}
