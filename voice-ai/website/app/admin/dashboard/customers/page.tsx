"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Search,
  Users,
  Phone,
  Calendar,
  Star,
  Bot,
  Globe,
} from 'lucide-react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { useAuth } from '@/lib/auth-context'
import { useBookings } from '@/lib/bookings-context'
import { Input } from '@/components/ui/input'

interface Customer {
  name: string
  phone: string
  totalBookings: number
  lastVisit: string
  preferredService: string
  source: string
}

export default function AdminCustomersPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { bookings } = useBookings()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  // Aggregate customer data from bookings
  const customerMap = new Map<string, Customer>()
  bookings.forEach(booking => {
    const existing = customerMap.get(booking.phone)
    if (existing) {
      existing.totalBookings++
      if (booking.date > existing.lastVisit) {
        existing.lastVisit = booking.date
      }
    } else {
      customerMap.set(booking.phone, {
        name: booking.customerName,
        phone: booking.phone,
        totalBookings: 1,
        lastVisit: booking.date,
        preferredService: booking.service,
        source: booking.source,
      })
    }
  })

  const customers = Array.from(customerMap.values())
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  )

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <main className="lg:ml-[280px] min-h-screen">
        {/* Header */}
        <div className="glass border-b border-border/30 sticky top-0 z-30">
          <div className="px-6 py-4 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="pl-12 lg:pl-0">
                <h1 className="text-2xl font-bold">Customers</h1>
                <p className="text-sm text-muted-foreground">View customer history</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {customers.length} customer{customers.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8 space-y-6">
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-4"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50"
              />
            </div>
          </motion.div>

          {/* Customers Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.phone}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-lg font-bold">
                    {customer.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{customer.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {customer.phone}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Calendar className="h-3 w-3" />
                      Visits
                    </div>
                    <div className="font-semibold">{customer.totalBookings}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Star className="h-3 w-3" />
                      Service
                    </div>
                    <div className="font-semibold truncate text-xs">{customer.preferredService}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                  <div className="text-xs text-muted-foreground">
                    Last visit: {customer.lastVisit}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {customer.source === 'AI Voice Assistant' ? (
                      <Bot className="h-3 w-3 text-accent" />
                    ) : (
                      <Globe className="h-3 w-3 text-accent" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No customers found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
