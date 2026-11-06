"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import useSWR, { mutate } from 'swr'
import {
  Search,
  Users,
  Phone,
  Calendar,
  Star,
  Bot,
  Globe,
  Clock,
} from 'lucide-react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { useAuth } from '@/lib/auth-context'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Customer {
  id?: number
  name: string
  phone: string
  email?: string | null
  total_visits?: number
  last_visit?: string
  last_visit_time?: string
  preferred_service?: string
  source?: string
  created_at?: string
}

function displaySource(source?: string) {
  const normalized = String(source || '').toLowerCase()
  if (normalized.includes('website')) return 'Website Booking'
  if (normalized.includes('admin')) return 'Admin Dashboard'
  if (normalized.includes('phone') || normalized.includes('ai')) return 'AI Voice Assistant'
  return source || 'Unknown Source'
}

function isAiSource(source?: string) {
  const normalized = String(source || '').toLowerCase()
  return normalized.includes('ai') || normalized.includes('phone')
}

function formatLastVisit(date?: string, time?: string) {
  if (!date && !time) return 'No completed visits yet'
  return [date, time].filter(Boolean).join(' at ')
}

export default function AdminCustomersPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading } = useSWR<Customer[]>('/api/customers', fetcher, {
    refreshInterval: 5000,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated) return

    const handleFocus = () => mutate('/api/customers')
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null
  }

  const customers = Array.isArray(data) ? data : []
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  )

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <main className="lg:ml-[280px] min-h-screen">
        <div className="glass border-b border-border/30 sticky top-0 z-30">
          <div className="px-6 py-4 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="pl-12 lg:pl-0">
                <h1 className="text-2xl font-bold">Customers</h1>
                <p className="text-sm text-muted-foreground">Recently completed customers from real bookings</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {customers.length} completed customer{customers.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-4"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search completed customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50"
              />
            </div>
          </motion.div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="glass-card rounded-2xl p-5 animate-pulse h-56" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomers.map((customer, index) => (
                <motion.div
                  key={`${customer.phone}-${customer.last_visit || index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-lg font-bold uppercase">
                      {(customer.name || 'C')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{customer.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                    <Badge className="bg-accent/20 text-accent border-accent/20">Completed</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Calendar className="h-3 w-3" />
                        Visits
                      </div>
                      <div className="font-semibold">{customer.total_visits || 0}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Star className="h-3 w-3" />
                        Service
                      </div>
                      <div className="font-semibold truncate text-xs">{customer.preferred_service || 'Appointment'}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Last completed: {formatLastVisit(customer.last_visit, customer.last_visit_time)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {isAiSource(customer.source) ? (
                        <Bot className="h-3 w-3 text-accent" />
                      ) : (
                        <Globe className="h-3 w-3 text-accent" />
                      )}
                      {displaySource(customer.source)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filteredCustomers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed customers found</p>
              <p className="text-sm mt-1">Customers will appear here after bookings are marked as completed.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
