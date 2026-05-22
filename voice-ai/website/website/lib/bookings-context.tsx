"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { type Booking, sampleBookings } from './types'

interface BookingsContextType {
  bookings: Booking[]
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void
  updateBookingStatus: (id: string, status: Booking['status']) => void
  getBookingsByDate: (date: string) => Booking[]
  getTodaysBookings: () => Booking[]
  getStats: () => {
    todaysBookings: number
    confirmed: number
    pending: number
    completed: number
  }
}

const BookingsContext = createContext<BookingsContextType | null>(null)

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings)

  const addBooking = useCallback((booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setBookings(prev => [...prev, newBooking])
  }, [])

  const updateBookingStatus = useCallback((id: string, status: Booking['status']) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === id ? { ...booking, status } : booking
      )
    )
  }, [])

  const getBookingsByDate = useCallback((date: string) => {
    return bookings.filter(booking => booking.date === date)
  }, [bookings])

  const getTodaysBookings = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return bookings.filter(booking => booking.date === today)
  }, [bookings])

  const getStats = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const todaysBookings = bookings.filter(b => b.date === today)
    
    return {
      todaysBookings: todaysBookings.length,
      confirmed: todaysBookings.filter(b => b.status === 'confirmed').length,
      pending: todaysBookings.filter(b => b.status === 'pending').length,
      completed: todaysBookings.filter(b => b.status === 'completed').length,
    }
  }, [bookings])

  return (
    <BookingsContext.Provider value={{
      bookings,
      addBooking,
      updateBookingStatus,
      getBookingsByDate,
      getTodaysBookings,
      getStats,
    }}>
      {children}
    </BookingsContext.Provider>
  )
}

export function useBookings() {
  const context = useContext(BookingsContext)
  if (!context) {
    throw new Error('useBookings must be used within a BookingsProvider')
  }
  return context
}
