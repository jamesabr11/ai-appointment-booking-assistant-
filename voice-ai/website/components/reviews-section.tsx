"use client"

import { motion } from 'framer-motion'
import { Star, Quote, MessageSquare } from 'lucide-react'

const reviews = [
  {
    id: 1,
    name: 'Marcus T.',
    rating: 5,
    text: "Best fade I've had in Vancouver. Nick really knows his craft. Clean shop, great vibes.",
    service: 'Fresh Fade',
    date: '2 weeks ago',
  },
  {
    id: 2,
    name: 'David L.',
    rating: 5,
    text: 'Booking was super easy, the AI assistant actually worked really well. No more waiting on hold!',
    service: 'Classic Cut',
    date: '1 month ago',
  },
  {
    id: 3,
    name: 'Chris M.',
    rating: 5,
    text: 'Clean shop, good prices, and professional barbers. Jay does amazing beard work.',
    service: 'Hair + Beard Combo',
    date: '3 weeks ago',
  },
  {
    id: 4,
    name: 'Ryan K.',
    rating: 5,
    text: 'Student discount is clutch. Quality cuts that actually look good for weeks.',
    service: 'Student Cut',
    date: '1 week ago',
  },
  {
    id: 5,
    name: 'Jason W.',
    rating: 5,
    text: 'The lineup precision is unmatched. Marcus has steady hands and real attention to detail.',
    service: 'Line Up',
    date: '2 weeks ago',
  },
  {
    id: 6,
    name: 'Alex P.',
    rating: 5,
    text: "Finally found my go-to barbershop. The AI booking is actually genius - called in, done in 30 seconds.",
    service: 'Fresh Fade',
    date: '1 month ago',
  },
]

export function ReviewsSection() {
  return (
    <section id="reviews" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Client Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            What Our <span className="text-gradient-red">Clients Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Hear from the people who keep coming back.
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative glass-card rounded-2xl p-6 h-full hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="h-12 w-12 text-primary" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-foreground mb-6 leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Reviewer Info */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm font-bold text-foreground">
                      {review.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{review.name}</div>
                      <div className="text-xs text-muted-foreground">{review.service}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{review.date}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass-card rounded-2xl p-8"
        >
          <div className="grid sm:grid-cols-4 gap-8 text-center">
            {[
              { value: '4.9', label: 'Average Rating', icon: Star },
              { value: '500+', label: 'Google Reviews', icon: MessageSquare },
              { value: '98%', label: 'Would Recommend', icon: Quote },
              { value: '5K+', label: 'Happy Clients', icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index > 0 && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-border hidden sm:block" />
                )}
                <div className="text-3xl font-bold text-gradient-red mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
