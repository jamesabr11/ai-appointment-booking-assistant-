"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import useSWR, { mutate } from 'swr'
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Bot,
  Globe,
  X,
  Phone,
  FileText,
  User,
  Trash2,
  Plus,
  Pencil,
} from 'lucide-react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { BookingFormModal, type AdminBookingFormData } from '@/components/admin/booking-form-modal'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { services } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Appointment {
  id: number
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
  created_at: string
}

function displaySource(source?: string) {
  const normalized = String(source || '').toLowerCase()
  if (normalized.includes('website')) return 'Website Booking'
  if (normalized.includes('admin')) return 'Admin Dashboard'
  if (normalized.includes('phone') || normalized.includes('ai')) return 'AI Voice Assistant'
  return source || 'AI Voice Assistant'
}

function isAiSource(source?: string) {
  const normalized = String(source || '').toLowerCase()
  return normalized.includes('ai') || normalized.includes('phone')
}

function statusClass(status: string) {
  if (status === 'confirmed') return 'bg-emerald-500/20 text-emerald-400'
  if (status === 'pending') return 'bg-amber-500/20 text-amber-400'
  if (status === 'completed') return 'bg-accent/20 text-accent'
  return 'bg-red-500/20 text-red-400'
}

export default function AdminBookingsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  
  const { data: appointments, isLoading } = useSWR<Appointment[]>('/api/appointments', fetcher, { refreshInterval: 5000 })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [serviceFilter, setServiceFilter] = useState<string>('all')
  const [selectedBooking, setSelectedBooking] = useState<Appointment | null>(null)
  const [editingBooking, setEditingBooking] = useState<Appointment | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const filteredBookings = (appointments || []).filter(booking => {
    const matchesSearch = 
      booking.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer_phone.includes(searchQuery)
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const matchesService = serviceFilter === 'all' || booking.service === serviceFilter
    return matchesSearch && matchesStatus && matchesService
  })

  const refreshBookings = () => {
    mutate('/api/appointments')
    mutate('/api/activity?limit=8')
    mutate('/api/customers')
    mutate('/api/appointments?stats=true')
  }

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (!response.ok) throw new Error('Failed to update booking')

      refreshBookings()
      toast({
        title: 'Booking Updated',
        description: `Booking marked as ${status}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update booking',
        variant: 'destructive'
      })
    }
  }

  const handleAddBooking = async (data: AdminBookingFormData) => {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, source: 'Admin Dashboard' }),
    })

    if (!response.ok) {
      const result = await response.json().catch(() => ({}))
      throw new Error(result.error || 'Failed to add booking')
    }

    refreshBookings()
    toast({ title: 'Booking Added', description: 'The booking was created from the admin dashboard.' })
  }

  const handleEditBooking = async (data: AdminBookingFormData) => {
    if (!editingBooking) return

    const response = await fetch(`/api/appointments/${editingBooking.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        status: data.status || editingBooking.status || 'pending',
        source: data.source || editingBooking.source || 'Admin Dashboard',
      }),
    })

    if (!response.ok) {
      const result = await response.json().catch(() => ({}))
      throw new Error(result.error || 'Failed to edit booking')
    }

    refreshBookings()
    setSelectedBooking((current) => current?.id === editingBooking.id ? { ...current, ...data, status: data.status || current.status || 'pending' } : current)
    toast({ title: 'Booking Updated', description: 'The booking details were saved.' })
  }

  const handleDeleteBooking = async (booking: Appointment) => {
    if (!confirm(`Delete ${booking.customer_name}'s booking? This cannot be undone.`)) return

    try {
      const response = await fetch(`/api/appointments/${booking.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete booking')

      refreshBookings()
      setSelectedBooking((current) => current?.id === booking.id ? null : current)
      toast({ title: 'Booking Deleted', description: `${booking.customer_name}'s booking was deleted.` })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete booking', variant: 'destructive' })
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL bookings? This cannot be undone.')) {
      return
    }
    
    setIsClearing(true)
    try {
      const response = await fetch('/api/appointments/clear', {
        method: 'DELETE',
      })
      
      if (response.ok) {
        refreshBookings()
        toast({
          title: 'Database Cleared',
          description: 'All appointments have been deleted',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear database',
        variant: 'destructive'
      })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <Toaster />

      <main className="lg:ml-[280px] min-h-screen">
        <div className="glass border-b border-border/30 sticky top-0 z-30">
          <div className="px-6 py-4 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="pl-12 lg:pl-0">
                <h1 className="text-2xl font-bold">Bookings</h1>
                <p className="text-sm text-muted-foreground">Create, edit, confirm, complete, and delete appointments</p>
              </div>
              <div className="flex items-center gap-3">
                <Button size="sm" onClick={() => setIsAddOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Booking
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={isClearing}
                  className="text-red-400 hover:bg-red-500/10 border-red-500/30"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isClearing ? 'Clearing...' : 'Clear All'}
                </Button>
                <div className="hidden sm:block text-sm text-muted-foreground">
                  {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
                </div>
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
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border/50"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[160px] bg-secondary/50 border-border/50">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.name}>{service.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30">
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={7}>
                          <div className="h-12 bg-secondary/50 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredBookings.map((booking, index) => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-border/30 hover:bg-secondary/30 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.customer_name}</div>
                            <div className="text-sm text-muted-foreground">{booking.customer_phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.time}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-1 rounded-full ${statusClass(booking.status || 'pending')}`}>
                            {(booking.status || 'pending').charAt(0).toUpperCase() + (booking.status || 'pending').slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            {isAiSource(booking.source) ? <Bot className="h-4 w-4 text-accent" /> : <Globe className="h-4 w-4 text-accent" />}
                            <span className="hidden sm:inline">{displaySource(booking.source)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedBooking(booking)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditingBooking(booking)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Booking
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, 'confirmed')} disabled={booking.status === 'confirmed'}>
                                <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-400" />
                                Mark Confirmed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, 'completed')} disabled={booking.status === 'completed'}>
                                <Clock className="h-4 w-4 mr-2 text-accent" />
                                Mark Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, 'cancelled')} disabled={booking.status === 'cancelled'} className="text-red-400">
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Booking
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteBooking(booking)} className="text-red-400">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Booking
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {!isLoading && filteredBookings.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No bookings found matching your filters</p>
              </div>
            )}
          </motion.div>
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
                <Button variant="ghost" size="icon" onClick={() => setSelectedBooking(null)}><X className="h-5 w-5" /></Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-xl font-bold">
                    {selectedBooking.customer_name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{selectedBooking.customer_name}</div>
                    <div className="text-sm text-muted-foreground">{displaySource(selectedBooking.source)}</div>
                    <div className={`mt-1 text-xs px-2 py-0.5 rounded-full inline-flex ${statusClass(selectedBooking.status || 'pending')}`}>
                      {selectedBooking.status || 'pending'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-secondary/30">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><Phone className="h-4 w-4" />Phone</div>
                    <div className="font-medium">{selectedBooking.customer_phone}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/30">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><Clock className="h-4 w-4" />Date & Time</div>
                    <div className="font-medium">{selectedBooking.date}</div>
                    <div className="text-sm text-muted-foreground">{selectedBooking.time}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/30">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><FileText className="h-4 w-4" />Service</div>
                    <div className="font-medium">{selectedBooking.service}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/30">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><User className="h-4 w-4" />Barber</div>
                    <div className="font-medium">{selectedBooking.barber}</div>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="p-3 rounded-xl bg-secondary/30">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><FileText className="h-4 w-4" />Notes</div>
                    <div className="text-sm">{selectedBooking.notes}</div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingBooking(selectedBooking)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" className="text-red-400 hover:bg-red-500/10" onClick={() => handleDeleteBooking(selectedBooking)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <Button variant="outline" onClick={() => { handleStatusUpdate(selectedBooking.id, 'confirmed'); setSelectedBooking({ ...selectedBooking, status: 'confirmed' }) }} disabled={selectedBooking.status === 'confirmed'}>
                    Confirm
                  </Button>
                  <Button variant="outline" onClick={() => { handleStatusUpdate(selectedBooking.id, 'completed'); setSelectedBooking({ ...selectedBooking, status: 'completed' }) }} disabled={selectedBooking.status === 'completed'}>
                    Complete
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddOpen && (
          <BookingFormModal mode="create" onClose={() => setIsAddOpen(false)} onSave={handleAddBooking} />
        )}
        {editingBooking && (
          <BookingFormModal mode="edit" booking={editingBooking} onClose={() => setEditingBooking(null)} onSave={handleEditBooking} />
        )}
      </AnimatePresence>
    </div>
  )
}
