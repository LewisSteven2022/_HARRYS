import { NextRequest, NextResponse } from 'next/server'
import { withOptionalAuth } from '@/lib/auth'

export const POST = withOptionalAuth(async (request, { user }) => {
  try {
    const body = await request.json()

    // Use authenticated user's info or fall back to form data
    const name = user?.user_metadata?.name || body.name
    const email = user?.email || body.email
    const phone = body.phone
    const date = body.date
    const time = body.time

    // Validate the booking data
    if (!name || !email || !phone || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // TODO: Add your booking service here (Calendar API, Database, etc.)
    console.log('Booking submission:', { name, email, phone, date, time, userId: user?.id })

    // Example response
    return NextResponse.json(
      {
        message: 'Consultation booked successfully',
        bookingId: Math.random().toString(36).substring(7)
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Bookings API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
