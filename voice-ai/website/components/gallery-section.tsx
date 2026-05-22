"use client"

import { motion } from 'framer-motion'
import { Camera, ZoomIn, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const galleryItems = [
  { id: 1, title: 'Skin Fade', category: 'Fades', image: '/gallery/skin-fade.jpg' },
  { id: 2, title: 'Textured Crop', category: 'Modern', image: '/gallery/textured-crop.jpg' },
  { id: 3, title: 'Beard Shape-Up', category: 'Beard', image: '/gallery/beard-shapeup.jpg' },
  { id: 4, title: 'Clean Lineup', category: 'Precision', image: '/gallery/lineup.jpg' },
  { id: 5, title: 'Classic Taper', category: 'Classic', image: '/gallery/classic-taper.jpg' },
  { id: 6, title: 'Burst Fade', category: 'Fades', image: '/gallery/burst-fade.jpg' },
  { id: 7, title: 'French Crop', category: 'Modern', image: '/gallery/french-crop.jpg' },
  { id: 8, title: 'Low Fade', category: 'Fades', image: '/gallery/low-fade.jpg' },
]

export function GallerySection() {
  const [lightboxImage, setLightboxImage] = useState<typeof galleryItems[0] | null>(null)

  return (
    <section id="gallery" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/20">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        {/* Barber stripe decoration */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1 barber-stripe opacity-20" />
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
            <Camera className="h-4 w-4 text-accent" />
            <span className="text-sm text-accent font-medium">Our Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Style <span className="text-gradient-red">Gallery</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our portfolio of fresh cuts and clean styles. Your next look is just an appointment away.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setLightboxImage(item)}
              className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md ${
                index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              {/* Actual Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                >
                  <span className="text-xs text-primary font-medium mb-1 block">{item.category}</span>
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary-foreground transition-colors">{item.title}</h3>
                </motion.div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <ZoomIn className="h-5 w-5 text-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View Full Portfolio
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm">→</span>
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-4xl w-full aspect-square rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImage.image}
              alt={lightboxImage.title}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-sm text-primary font-medium">{lightboxImage.category}</span>
              <h3 className="text-2xl font-bold text-white">{lightboxImage.title}</h3>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
