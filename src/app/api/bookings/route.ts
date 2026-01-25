import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the booking data
    if (!body.name || !body.email || !body.phone || !body.date || !body.time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Add your booking service here (Calendar API, Database, etc.)
    console.log('Booking submission:', body);

    // Example response
    return NextResponse.json(
      { 
        message: 'Consultation booked successfully',
        bookingId: Math.random().toString(36).substring(7)
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Bookings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
