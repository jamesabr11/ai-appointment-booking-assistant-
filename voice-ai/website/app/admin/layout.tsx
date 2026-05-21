"use client"

import { AuthProvider } from '@/lib/auth-context'
import { BookingsProvider } from '@/lib/bookings-context'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <BookingsProvider>
        {children}
      </BookingsProvider>
    </AuthProvider>
  )
}
