import { NextRequest, NextResponse } from 'next/server'
import { getAppointmentById, updateAppointment, updateAppointmentStatus, deleteAppointment } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const appointment = getAppointmentById(parseInt(id))
    
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }
    
    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // If only status is being updated, use the optimized function
    if (Object.keys(body).length === 1 && body.status) {
      const success = updateAppointmentStatus(parseInt(id), body.status)
      if (!success) {
        return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true })
    }
    
    const success = updateAppointment(parseInt(id), body)
    if (!success) {
      return NextResponse.json({ error: 'Appointment not found or no changes made' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = deleteAppointment(parseInt(id))
    
    if (!success) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 })
  }
}
