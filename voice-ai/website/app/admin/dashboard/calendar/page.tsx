"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import useSWR, { mutate } from 'swr'
import {
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Clock,
  FileText,
  Bot,
  Globe,
} from 'lucide-react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns'

interface Appointment {
  id: number
  customer_name: string
  customer_phone: string
  service: string
  barber: string
  date: string
  time: string
  status: string
  notes: string | null
  source: string
  created_at: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AdminCalendarPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Appointment | null>(null)

  const { data: appointments = [], isLoading } = useSWR<Appointment[]>('/api/appointments', fetcher, {
    refreshInterval: 5000,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDay = monthStart.getDay()
  const paddingDays = Array(startDay).fill(null)

  const getBookingsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return appointments.filter(a => a.date === dateStr)
  }

  const selectedDateBookings = selectedDate
    ? getBookingsForDay(selectedDate)
    : []

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      mutate('/api/appointments')
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status })
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <main className="lg:ml-[280px] min-h-screen">
        <div className="glass border-b border-border/30 sticky top-0 z-30">
          <div className="px-6 py-4 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="pl-12 lg:pl-0">
                <h1 className="text-2xl font-bold">Calendar</h1>
                <p className="text-sm text-muted-foreground">View and manage appointments</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {appointments.length} total booking{appointments.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 glass-card rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {paddingDays.map((_, i) => (
                  <div key={`pad-${i}`} className="aspect-square" />
                ))}

                {days.map((day) => {
                  const dayBookings = getBookingsForDay(day)
                  const isSelected = selectedDate && isSameDay(day, selectedDate)
                  const isCurrentDay = isToday(day)

                  return (
                    <motion.button
                      key={day.toISOString()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(day)}
                      className={`aspect-square rounded-xl p-2 flex flex-col items-center justify-start transition-all relative ${
                        isSelected
                          ? 'bg-primary/20 border-2 border-primary'
                          : isCurrentDay
                          ? 'bg-accent/10 border border-accent/30'
                          : 'hover:bg-secondary/50 border border-transparent'
                      }`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          isSelected
                            ? 'text-primary'
                            : isCurrentDay
                            ? 'text-accent'
                            : ''
                        }`}
                      >
                        {format(day, 'd')}
                      </span>
                      
                      {dayBookings.length > 0 && (
                        <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                          {dayBookings.slice(0, 3).map((_, i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-primary"
                            />
                          ))}
                          {dayBookings.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{dayBookings.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              {selectedDate ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {format(selectedDate, 'EEEE')}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {format(selectedDate, 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {selectedDateBookings.length} booking{selectedDateBookings.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {selectedDateBookings.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateBookings.map((booking) => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{booking.customer_name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              booking.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-500'
                                : booking.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-500'
                                : booking.status === 'completed'
                                ? 'bg-primary/20 text-primary'
                                : 'bg-red-500/20 text-red-500'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {booking.time}
                            </span>
                            <span>{booking.service}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            {booking.source === 'ai' ? (
                              <Bot className="h-3 w-3 text-primary" />
                            ) : (
                              <Globe className="h-3 w-3 text-primary" />
                            )}
                            {booking.source === 'ai' ? 'AI Assistant' : 'Website'}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No bookings on this day</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a day to view bookings</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setSelectedBooking(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass-card rounded-2xl p-6 z-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Booking Details</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedBooking(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
                    {selectedBooking.customer_name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{selectedBooking.customer_name}</div>
                    <div className={`text-xs px-2 py-0.5 rounded-full inline-flex ${
                      selectedBooking.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-500'
                        : selectedBooking.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-500'
                        : selectedBooking.status === 'completed'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {selectedBooking.status}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-secondary/30">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <Phone className="h-4 w-4" />
                      Phone
                    </div>
                    <div className="font-medium">{selectedBooking.customer_phone}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/30">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <Clock className="h-4 w-4" />
                      Time
                    </div>
                    <div className="font-medium">{selectedBooking.time}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/30">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <FileText className="h-4 w-4" />
                      Service
                    </div>
                    <div className="font-medium">{selectedBooking.service}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/30">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      {selectedBooking.source === 'ai' ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <Globe className="h-4 w-4" />
                      )}
                      Source
                    </div>
                    <div className="font-medium text-sm">
                      {selectedBooking.source === 'ai' ? 'AI Assistant' : 'Website'}
                    </div>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="p-3 rounded-xl bg-secondary/30">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <FileText className="h-4 w-4" />
                      Notes
                    </div>
                    <div className="text-sm">{selectedBooking.notes}</div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')}
                    disabled={selectedBooking.status === 'confirmed'}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'completed')}
                    disabled={selectedBooking.status === 'completed'}
                  >
                    Complete
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-500 hover:bg-red-500/10"
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                    disabled={selectedBooking.status === 'cancelled'}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
