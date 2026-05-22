import { NextRequest, NextResponse } from 'next/server'
import { getAppointmentById, updateAppointment, updateAppointmentStatus, deleteAppointment, hasConfirmedAppointmentConflict } from '@/lib/db'

export const runtime = 'nodejs'

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10)

  if (digits.length <= 3) return digits ? `(${digits}` : ''
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function validatePhoneNumber(value: string) {
  return value.replace(/\D/g, '').length === 10
}


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
    
    const appointmentId = parseInt(id)
    const existing = getAppointmentById(appointmentId)
    if (!existing) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    const cleanedBody = { ...body }

    for (const field of ['customer_name', 'customer_phone', 'service', 'barber', 'date', 'time'] as const) {
      if (!String(cleanedBody[field] || '').trim()) {
        cleanedBody[field] = existing[field] || ''
      }
    }

    if (!String(cleanedBody.status || '').trim()) {
      cleanedBody.status = existing.status || 'pending'
    }
    if (!String(cleanedBody.source || '').trim()) {
      cleanedBody.source = existing.source || 'Admin Dashboard'
    }

    const source = String(cleanedBody.source || existing.source || '')
    if (source.toLowerCase().includes('website') && hasConfirmedAppointmentConflict(String(cleanedBody.date), String(cleanedBody.time), appointmentId)) {
      return NextResponse.json({ error: 'That time is already confirmed. Please choose another time.' }, { status: 409 })
    }

    if (cleanedBody.customer_phone !== undefined) {
      if (!validatePhoneNumber(String(cleanedBody.customer_phone))) {
        return NextResponse.json({ error: 'Phone number must be exactly 10 digits.' }, { status: 400 })
      }
      cleanedBody.customer_phone = formatPhoneNumber(String(cleanedBody.customer_phone))
    }

    const success = updateAppointment(appointmentId, cleanedBody)
    if (!success) {
      return NextResponse.json({ error: 'No changes made' }, { status: 400 })
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
