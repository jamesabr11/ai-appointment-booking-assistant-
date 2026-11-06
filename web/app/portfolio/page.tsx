"use client"

import { motion } from 'framer-motion'
import { Camera, ArrowLeft, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const portfolioItems = [
  { id: 1, title: 'Skin Fade', category: 'Fades', image: '/gallery/skin-fade.jpg' },
  { id: 2, title: 'Textured Crop', category: 'Modern', image: '/gallery/textured-crop.jpg' },
  { id: 3, title: 'Beard Shape-Up', category: 'Beard', image: '/gallery/beard-shapeup.jpg' },
  { id: 4, title: 'Clean Lineup', category: 'Precision', image: '/gallery/lineup.jpg' },
  { id: 5, title: 'Classic Taper', category: 'Classic', image: '/gallery/classic-taper.jpg' },
  { id: 6, title: 'Burst Fade', category: 'Fades', image: '/gallery/burst-fade.jpg' },
  { id: 7, title: 'French Crop', category: 'Modern', image: '/gallery/french-crop.jpg' },
  { id: 8, title: 'Low Fade', category: 'Fades', image: '/gallery/low-fade.jpg' },
  { id: 9, title: 'High Top Fade', category: 'Fades', image: '/gallery/skin-fade.jpg' },
  { id: 10, title: 'Pompadour', category: 'Classic', image: '/gallery/classic-taper.jpg' },
  { id: 11, title: 'Undercut', category: 'Modern', image: '/gallery/textured-crop.jpg' },
  { id: 12, title: 'Beard Trim', category: 'Beard', image: '/gallery/beard-shapeup.jpg' },
  { id: 13, title: 'Temple Fade', category: 'Fades', image: '/gallery/burst-fade.jpg' },
  { id: 14, title: 'Crew Cut', category: 'Classic', image: '/gallery/lineup.jpg' },
  { id: 15, title: 'Quiff', category: 'Modern', image: '/gallery/french-crop.jpg' },
  { id: 16, title: 'Taper Fade', category: 'Fades', image: '/gallery/low-fade.jpg' },
]

const categories = ['All', 'Fades', 'Modern', 'Classic', 'Beard', 'Precision']

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [lightboxImage, setLightboxImage] = useState<typeof portfolioItems[0] | null>(null)

  const filteredItems = selectedCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory)

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Camera className="h-4 w-4 text-accent" />
              <span className="text-sm text-accent font-medium">Full Collection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Our <span className="text-gradient-red">Portfolio</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our complete collection of cuts, fades, and styles. Click any image to view in full size.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => setLightboxImage(item)}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <span className="text-xs text-primary font-medium mb-1">{item.category}</span>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
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

      {/* CTA */}
      <div className="bg-secondary/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready for Your New Look?</h2>
          <p className="text-muted-foreground mb-6">Book an appointment and let us create your perfect style.</p>
          <Link
            href="/#book"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </main>
  )
}
