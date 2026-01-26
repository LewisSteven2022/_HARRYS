import { NextRequest, NextResponse } from 'next/server'
import { createSumUpCheckout, generateCheckoutReference } from '@/lib/sumup'
import { prisma } from '@/lib/prisma'
import { withOptionalAuth } from '@/lib/auth'

interface BasketItem {
  sessionId: string
  sessionTypeId: string
  sessionTypeName: string
  date: string
  dayOfWeek: number
  startTime: string
  endTime: string
  price: number
}

interface CheckoutRequest {
  items: BasketItem[]
  email?: string
  name?: string
}

export const POST = withOptionalAuth(async (request, { user }) => {
  try {
    const body: CheckoutRequest = await request.json()
    const { items } = body

    // Use authenticated user's info or fall back to guest details
    const email = user?.email || body.email
    const firstName = user?.user_metadata?.firstName || ''
    const lastName = user?.user_metadata?.lastName || ''
    const name = user ? `${firstName} ${lastName}`.trim() || user.email : body.name

    // Validate request
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in basket' },
        { status: 400 }
      )
    }

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Calculate total (use £1 minimum for testing in development)
    const calculatedTotal = items.reduce((sum, item) => sum + item.price, 0)
    const isDev = process.env.NODE_ENV === 'development'
    const totalAmount = isDev ? 1 : calculatedTotal // £1 test amount in dev

    // Generate unique reference
    const checkoutReference = generateCheckoutReference()

    // Get app URL for redirect
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const redirectUrl = `${appUrl}/checkout/success?ref=${checkoutReference}`

    // Create description from items
    const sessionCount = items.length
    const description = `Harry's PT - ${sessionCount} session${sessionCount > 1 ? 's' : ''}`

    // Create SumUp checkout
    const checkout = await createSumUpCheckout({
      amount: totalAmount,
      currency: 'GBP',
      checkoutReference,
      description,
      redirectUrl,
    })

    // Save order to database with order items
    await prisma.order.create({
      data: {
        userId: user?.id,
        guestEmail: user ? null : email,
        guestName: user ? null : name,
        totalAmount,
        sumupCheckoutId: checkout.id,
        sumupReference: checkoutReference,
        status: 'PENDING',
        orderItems: {
          create: items.map((item) => ({
            sessionId: item.sessionId,
            sessionDate: new Date(item.date),
            price: item.price,
          })),
        },
      },
    })

    // Return checkout URL for redirect
    return NextResponse.json({
      checkoutUrl: checkout.hosted_checkout_url,
      reference: checkoutReference,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    )
  }
})
