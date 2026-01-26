import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSumUpCheckout } from '@/lib/sumup'
import { getUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const { reference } = await params
    const user = await getUser()

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference is required' },
        { status: 400 }
      )
    }

    // Find order by reference
    const order = await prisma.order.findUnique({
      where: { sumupReference: reference },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Security: If order belongs to a user, only that user can view it
    if (order.userId && order.userId !== user?.id) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // If order is still pending, check SumUp for latest status
    if (order.status === 'PENDING' && order.sumupCheckoutId) {
      try {
        const checkout = await getSumUpCheckout(order.sumupCheckoutId)

        // Update order if payment completed
        if (checkout.status === 'PAID') {
          // Check if bookings already exist (webhook may have created them)
          const existingBookings = await prisma.booking.count({
            where: { orderId: order.id },
          })

          // Create bookings if they don't exist (fallback for missed webhook)
          if (existingBookings === 0) {
            const orderWithItems = await prisma.order.findUnique({
              where: { id: order.id },
              include: { orderItems: true },
            })

            if (orderWithItems?.orderItems.length) {
              await prisma.booking.createMany({
                data: orderWithItems.orderItems.map((item) => ({
                  orderId: order.id,
                  sessionId: item.sessionId,
                  date: item.sessionDate,
                })),
                skipDuplicates: true,
              })
            }
          }

          const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'PAID',
              paidAt: new Date(),
            },
          })

          return NextResponse.json({
            reference: updatedOrder.sumupReference,
            status: updatedOrder.status,
            email: user?.email || updatedOrder.guestEmail,
            name: user?.user_metadata?.name || updatedOrder.guestName,
            amount: Number(updatedOrder.totalAmount),
            paidAt: updatedOrder.paidAt,
          })
        } else if (checkout.status === 'FAILED') {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'FAILED' },
          })

          return NextResponse.json({
            reference: order.sumupReference,
            status: 'FAILED',
          })
        }
      } catch (sumupError) {
        console.error('Error checking SumUp status:', sumupError)
        // Continue with current order status if SumUp check fails
      }
    }

    return NextResponse.json({
      reference: order.sumupReference,
      status: order.status,
      email: user?.email || order.guestEmail,
      name: user?.user_metadata?.name || order.guestName,
      amount: Number(order.totalAmount),
      paidAt: order.paidAt,
    })
  } catch (error) {
    console.error('Order verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify order' },
      { status: 500 }
    )
  }
}
