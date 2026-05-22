"use client"

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { services } from '@/lib/types'

export interface AdminBookingFormData {
  customer_name: string
  customer_phone: string
  customer_email?: string
  service: string
  barber: string
  date: string
  time: string
  notes?: string
  status: string
  source: string
}

export interface AdminBooking extends AdminBookingFormData {
  id: number
  created_at?: string
}

interface BookingFormModalProps {
  mode: 'create' | 'edit'
  booking?: AdminBooking | null
  onClose: () => void
  onSave: (data: AdminBookingFormData) => Promise<void>
}

const emptyForm: AdminBookingFormData = {
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  service: '',
  barber: 'Team12',
  date: '',
  time: '',
  notes: '',
  status: 'pending',
  source: 'Admin Dashboard',
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

const timeSlots = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM',
]

const allowedStatuses = new Set(['pending', 'confirmed', 'completed', 'cancelled'])

function normalizeStatus(status?: string) {
  const normalized = String(status || '').trim().toLowerCase()
  return allowedStatuses.has(normalized) ? normalized : 'pending'
}

export function BookingFormModal({ mode, booking, onClose, onSave }: BookingFormModalProps) {
  const [form, setForm] = useState<AdminBookingFormData>(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (mode === 'edit' && booking) {
      setForm({
        customer_name: booking.customer_name || '',
        customer_phone: formatPhoneNumber(booking.customer_phone || ''),
        customer_email: booking.customer_email || '',
        service: booking.service || '',
        barber: booking.barber || 'Team12',
        date: booking.date || '',
        time: booking.time || '',
        notes: booking.notes || '',
        status: normalizeStatus(booking.status),
        source: booking.source || 'Admin Dashboard',
      })
    } else {
      setForm(emptyForm)
    }
    setError('')
  }, [mode, booking])

  const updateField = (field: keyof AdminBookingFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')

    if (phoneDigits(form.customer_phone).length !== 10) {
      setError('Please enter a 10-digit phone number.')
      setIsSaving(false)
      return
    }

    try {
      await onSave({ ...form, customer_phone: formatPhoneNumber(form.customer_phone), status: normalizeStatus(form.status) })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save booking')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl p-6 z-50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">{mode === 'create' ? 'Add Booking' : 'Edit Booking'}</h3>
            <p className="text-sm text-muted-foreground">
              {mode === 'create' ? 'Create a new appointment from the admin dashboard.' : 'Update this appointment details.'}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admin-customer-name">Name</Label>
              <Input
                id="admin-customer-name"
                value={form.customer_name}
                onChange={(event) => updateField('customer_name', event.target.value)}
                placeholder="Customer name"
                className="bg-secondary/50 border-border/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-phone">Phone</Label>
              <Input
                id="admin-phone"
                value={form.customer_phone}
                onChange={(event) => updateField('customer_phone', formatPhoneNumber(event.target.value))}
                placeholder="(778) 562-8468"
                inputMode="numeric"
                maxLength={14}
                className="bg-secondary/50 border-border/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-email">Email optional</Label>
              <Input
                id="admin-email"
                type="email"
                value={form.customer_email || ''}
                onChange={(event) => updateField('customer_email', event.target.value)}
                placeholder="customer@email.com"
                className="bg-secondary/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={normalizeStatus(form.status)} onValueChange={(value) => updateField('status', value)}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Service</Label>
              <Select value={form.service} onValueChange={(value) => updateField('service', value)}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Select service" />
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
              <Label htmlFor="admin-barber">Barber</Label>
              <Input
                id="admin-barber"
                value={form.barber}
                onChange={(event) => updateField('barber', event.target.value)}
                placeholder="Team12"
                className="bg-secondary/50 border-border/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-date">Date</Label>
              <Input
                id="admin-date"
                type="date"
                value={form.date}
                onChange={(event) => updateField('date', event.target.value)}
                className="bg-secondary/50 border-border/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <Select value={form.time} onValueChange={(value) => updateField('time', value)}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-notes">Notes</Label>
            <Textarea
              id="admin-notes"
              value={form.notes || ''}
              onChange={(event) => updateField('notes', event.target.value)}
              placeholder="Extra notes"
              className="bg-secondary/50 border-border/50 min-h-[100px]"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : mode === 'create' ? 'Add Booking' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
