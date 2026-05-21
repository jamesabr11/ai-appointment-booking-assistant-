"use client"

import { motion } from 'framer-motion'
import { Scissors, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react'
import Link from 'next/link'

const footerLinks = {
  services: [
    { name: 'Fresh Fade', href: '/#services' },
    { name: 'Classic Cut', href: '/#services' },
    { name: 'Beard Trim', href: '/#services' },
    { name: 'Hair + Beard Combo', href: '/#services' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/team' },
    { name: 'Gallery', href: '/portfolio' },
    { name: 'Reviews', href: '/reviews' },
  ],
  support: [
    { name: 'Book Online', href: '/#book' },
    { name: 'AI Assistant', href: '/#ai-booking' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ],
}

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
]

export function Footer() {
  return (
    <footer id="contact" className="relative pt-24 pb-8 overflow-hidden bg-secondary/30">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1 barber-stripe opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Side - Brand & Contact */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent">
                  <Scissors className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Team<span className="text-primary">12</span>
              </span>
            </Link>

            <p className="text-muted-foreground max-w-md leading-relaxed">
              Premium barbershop in Vancouver delivering sharp cuts, clean styles, and an AI-powered booking experience. Walk-ins welcome.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Location</div>
                  <div className="text-sm text-muted-foreground">Vancouver, BC</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Phone</div>
                  <div className="text-sm text-muted-foreground">(778) 562-8468</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Email</div>
                  <div className="text-sm text-muted-foreground">bookings@team12barbershop.com</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Business Hours</div>
                  <div className="text-sm text-muted-foreground">Mon-Fri: 10 AM - 5 PM</div>
                  <div className="text-sm text-primary">Sat-Sun: Closed</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors group"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Links */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-3 gap-8"
          >
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Services</h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Team12 Barbershop. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-emerald-600">AI Assistant Online</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
