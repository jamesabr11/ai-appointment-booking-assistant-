import { NextResponse } from 'next/server'
import { clearAllAppointments, clearAllCustomers } from '@/lib/db'

export const runtime = 'nodejs'

export async function DELETE() {
  try {
    clearAllAppointments()
    clearAllCustomers()
    
    return NextResponse.json({ success: true, message: 'All appointments and customers cleared' })
  } catch (error) {
    console.error('Error clearing database:', error)
    return NextResponse.json(
      { error: 'Failed to clear database' },
      { status: 500 }
    )
  }
}
