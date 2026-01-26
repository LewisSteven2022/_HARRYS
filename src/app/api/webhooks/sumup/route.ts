import { NextRequest, NextResponse } from 'next/server'
import { getSumUpCheckout } from '@/lib/sumup'
import { prisma } from '@/lib/prisma'
import { createGuestAccount, linkOrderToUser } from '@/lib/userService'

// Credit expiration period (12 months)
const CREDIT_EXPIRATION_MONTHS = 12

// SumUp webhook payload structure
interface SumUpWebhookPayload {
  id: string
  event_type: string
  timestamp: string
  payload: {
    checkout_reference: string
    transaction_id?: string
    status: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SumUpWebhookPayload = await request.json()

    console.log('SumUp webhook received:', JSON.stringify(body, null, 2))

    const { payload } = body
    const checkoutReference = payload.checkout_reference

    if (!checkoutReference) {
      return NextResponse.json(
        { error: 'Missing checkout reference' },
        { status: 400 }
      )
    }

    // Find the order by reference, including credit package info
    const order = await prisma.order.findUnique({
      where: { sumupReference: checkoutReference },
      include: { creditPackage: true },
    })

    if (!order) {
      console.error('Order not found for reference:', checkoutReference)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Verify checkout status with SumUp API
    if (order.sumupCheckoutId) {
      const checkout = await getSumUpCheckout(order.sumupCheckoutId)

      // Update order based on SumUp checkout status
      if (checkout.status === 'PAID') {
        // Check if this is a credit package purchase
        if (order.creditPackage && order.userId) {
          // Create credit purchase record
          const expiresAt = new Date()
          expiresAt.setMonth(expiresAt.getMonth() + CREDIT_EXPIRATION_MONTHS)

          await prisma.creditPurchase.create({
            data: {
              userId: order.userId,
              packageId: order.creditPackage.id,
              orderId: order.id,
              creditsReceived: order.creditPackage.sessionCount,
              creditsRemaining: order.creditPackage.sessionCount,
              expiresAt,
            },
          })
          console.log(`Created credit purchase: ${order.creditPackage.sessionCount} credits for user ${order.userId}`)
        } else {
          // Regular session booking - fetch order with items to create bookings
          const orderWithItems = await prisma.order.findUnique({
            where: { id: order.id },
            include: { orderItems: true },
          })

          // Create booking records from order items
          if (orderWithItems?.orderItems.length) {
            await prisma.booking.createMany({
              data: orderWithItems.orderItems.map((item) => ({
                orderId: order.id,
                sessionId: item.sessionId,
                date: item.sessionDate,
              })),
              skipDuplicates: true,
            })
            console.log(`Created ${orderWithItems.orderItems.length} bookings for order:`, checkoutReference)
          }

          // If this is a guest order, create an account for them
          if (!order.userId && order.guestEmail && order.guestName) {
            try {
              const result = await createGuestAccount(
                order.guestEmail,
                order.guestName
              )

              if (result?.userId) {
                // Link the order to the new/existing user
                await linkOrderToUser(order.id, result.userId)
                console.log(`Linked order to user: ${result.userId} (new: ${result.isNew})`)
              }
            } catch (err) {
              console.error('Failed to create guest account:', err)
              // Continue with order update even if account creation fails
            }
          }
        }

        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'PAID',
            paidAt: new Date(),
          },
        })
        console.log('Order marked as PAID:', checkoutReference)
      } else if (checkout.status === 'FAILED') {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'FAILED' },
        })
        console.log('Order marked as FAILED:', checkoutReference)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
