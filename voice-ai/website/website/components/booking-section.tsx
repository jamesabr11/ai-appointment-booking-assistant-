"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Phone, User, Clock, FileText, Send, CheckCircle2, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { services } from '@/lib/types'

function formatLocalDate(value: Date) {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDisplayDate(value: string) {
  if (!value) return ''
  const parsed = new Date(`${value}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}


function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10)

  if (digits.length <= 3) return digits ? `(${digits}` : ''
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function phoneDigits(value: string) {
  return value.replace(/\D/g, '')
}

function addDays(value: Date, days: number) {
  const copy = new Date(value)
  copy.setDate(copy.getDate() + days)
  return copy
}

function toSafeNoon(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12, 0, 0)
}

function isWeekendDate(date: Date) {
  const day = date.getDay()
  return day === 0 || day === 6
}

function isInBookingWindowDate(date: Date) {
  const selected = formatLocalDate(toSafeNoon(date))
  const today = new Date()
  const minDate = formatLocalDate(today)
  const maxDate = formatLocalDate(addDays(today, 14))
  return selected >= minDate && selected <= maxDate
}

function isWeekend(dateValue: string) {
  const day = new Date(`${dateValue}T12:00:00`).getDay()
  return day === 0 || day === 6
}

function isInBookingWindow(dateValue: string) {
  const today = new Date()
  const minDate = formatLocalDate(today)
  const maxDate = formatLocalDate(addDays(today, 14))
  return dateValue >= minDate && dateValue <= maxDate
}

interface AppointmentSummary {
  id?: number
  date: string
  time: string
  status: string
}

function normalizeTime(value: string) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

export function BookingSection() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [formData, setFormData] = useState({
    firstName: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    barber: 'Any',
    notes: '',
  })
  const [confirmedTimes, setConfirmedTimes] = useState<string[]>([])

  useEffect(() => {
    if (!formData.date) {
      setConfirmedTimes([])
      return
    }

    let cancelled = false

    async function loadConfirmedTimes() {
      try {
        const response = await fetch(`/api/appointments?date=${encodeURIComponent(formData.date)}`)
        if (!response.ok) throw new Error('Failed to load booked times')
        const appointments = (await response.json()) as AppointmentSummary[]
        const takenTimes = appointments
          .filter((appointment) => normalizeTime(appointment.status) === 'confirmed')
          .map((appointment) => normalizeTime(appointment.time))

        if (!cancelled) {
          setConfirmedTimes(takenTimes)
          if (formData.time && takenTimes.includes(normalizeTime(formData.time))) {
            setFormData((current) => ({ ...current, time: '' }))
          }
        }
      } catch {
        if (!cancelled) setConfirmedTimes([])
      }
    }

    loadConfirmedTimes()

    return () => {
      cancelled = true
    }
  }, [formData.date, formData.time])

  const handlePhoneChange = (value: string) => {
    setFormData((current) => ({ ...current, phone: formatPhoneNumber(value) }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    const safeDate = toSafeNoon(date)
    if (isWeekendDate(safeDate) || !isInBookingWindowDate(safeDate)) return

    setSelectedDate(safeDate)
    setFormData({ ...formData, date: formatLocalDate(safeDate), time: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    if (!formData.date) {
      setError('Please choose a weekday appointment date on the calendar.')
      setIsSubmitting(false)
      return
    }

    if (!isInBookingWindow(formData.date)) {
      setError('Appointments can only be booked within the next 14 days.')
      setIsSubmitting(false)
      return
    }

    if (isWeekend(formData.date)) {
      setError('Weekend bookings are not available. Please choose a weekday.')
      setIsSubmitting(false)
      return
    }

    if (confirmedTimes.includes(normalizeTime(formData.time))) {
      setError('That time is already confirmed. Please choose another time.')
      setIsSubmitting(false)
      return
    }

    if (phoneDigits(formData.phone).length !== 10) {
      setError('Please enter a 10-digit phone number.')
      setIsSubmitting(false)
      return
    }
    
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: formData.firstName,
          customer_phone: formData.phone,
          service: formData.service,
          barber: formData.barber,
          date: formData.date,
          time: formData.time,
          notes: formData.notes,
          source: 'Website Form'
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to book appointment')
      }
      
      setSubmitted(true)
      setSelectedDate(undefined)
      setFormData({
        firstName: '',
        phone: '',
        date: '',
        time: '',
        service: '',
        barber: 'Any',
        notes: '',
      })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book appointment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const timeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM',
  ]

  return (
    <section id="book" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1 barber-stripe opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Easy Booking</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Book Your <span className="text-gradient-red">Appointment</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Schedule your visit online or call our AI assistant for a seamless booking experience.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">Booking Submitted!</h3>
                  <p className="text-muted-foreground">
                    We&apos;ll confirm your appointment shortly via phone.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center gap-2 text-foreground">
                        <User className="h-4 w-4 text-muted-foreground" />
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Your first name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="bg-secondary/50 border-border focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2 text-foreground">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(778) 562-8468"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        inputMode="numeric"
                        maxLength={14}
                        className="bg-secondary/50 border-border focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-3 sm:col-span-2">
                      <Label className="flex items-center gap-2 text-foreground">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        Preferred Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start bg-secondary/50 border-border focus:border-primary text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {formData.date ? formatDisplayDate(formData.date) : 'Pick an appointment date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={(date) => isWeekendDate(date) || !isInBookingWindowDate(date)}
                            modifiers={{
                              weekend: isWeekendDate,
                              outsideWindow: (date) => !isInBookingWindowDate(date),
                            }}
                            modifiersClassNames={{
                              weekend: 'text-red-500 opacity-70',
                              outsideWindow: 'opacity-30',
                            }}
                            className="rounded-md border border-border/40"
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-muted-foreground">
                        Weekends are shown in red and cannot be selected. Online booking is limited to weekdays within the next 14 days.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time" className="flex items-center gap-2 text-foreground">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Preferred Time
                      </Label>
                      <Select
                        value={formData.time}
                        onValueChange={(value) => setFormData({ ...formData, time: value })}
                      >
                        <SelectTrigger className="bg-secondary/50 border-border focus:border-primary">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => {
                            const isTaken = confirmedTimes.includes(normalizeTime(slot))
                            return (
                              <SelectItem key={slot} value={slot} disabled={isTaken}>
                                {slot}{isTaken ? ' - Booked' : ''}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-foreground">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Service
                    </Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                    >
                      <SelectTrigger className="bg-secondary/50 border-border focus:border-primary">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.name}>
                            {service.name} - ${service.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="flex items-center gap-2 text-foreground">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requests or preferences..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="bg-secondary/50 border-border focus:border-primary min-h-[100px]"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Book Appointment
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-card rounded-2xl p-6 border-accent/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                  <Mic className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Prefer Calling?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our AI assistant can collect your booking details over the phone. Just call and speak naturally!
                  </p>
                  <div className="text-xl font-bold text-gradient-red">(778) 562-8468</div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-4 text-foreground">Business Hours</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="font-medium text-foreground">10 AM - 5 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Saturday - Sunday</span>
                  <span className="text-primary font-medium">Closed</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm text-emerald-600 font-medium">Walk-ins Welcome</span>
              </div>
              <p className="text-sm text-muted-foreground">
                No appointment? No problem. Walk in during business hours and we&apos;ll get you styled.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
