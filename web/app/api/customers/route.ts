import { NextRequest, NextResponse } from 'next/server'
import { getAllCustomers, getCustomerByPhone, getCustomerAppointments } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const phone = searchParams.get('phone')
    const withAppointments = searchParams.get('withAppointments')
    
    if (phone) {
      const customer = getCustomerByPhone(phone)
      
      if (!customer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
      }
      
      if (withAppointments === 'true') {
        const appointments = getCustomerAppointments(phone)
        return NextResponse.json({ ...customer, appointments })
      }
      
      return NextResponse.json(customer)
    }
    
    const customers = getAllCustomers()
    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}
