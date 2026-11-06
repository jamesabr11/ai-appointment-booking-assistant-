import { NextRequest, NextResponse } from 'next/server'
import { getRecentActivity } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get('limit')
    const limit = Math.min(Math.max(Number(limitParam) || 8, 1), 25)
    return NextResponse.json(getRecentActivity(limit))
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return NextResponse.json({ error: 'Failed to fetch recent activity' }, { status: 500 })
  }
}
