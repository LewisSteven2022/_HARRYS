import { NextResponse } from 'next/server'
import { createSumUpCheckout, generateCheckoutReference } from '@/lib/sumup'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

interface CheckoutRequest {
  packageId: string
}

// POST /api/credits/checkout - Create checkout for credit package purchase
export const POST = withAuth(async (request, { user }) => {
  try {
    const body: CheckoutRequest = await request.json()
    const { packageId } = body

    if (!packageId) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      )
    }

    // Get the credit package
    const creditPackage = await prisma.creditPackage.findUnique({
      where: { id: packageId, isActive: true },
    })

    if (!creditPackage) {
      return NextResponse.json(
        { error: 'Package not found or inactive' },
        { status: 404 }
      )
    }

    // Get or create Prisma user
    let prismaUser = await prisma.user.findUnique({
      where: { email: user.email! },
    })

    if (!prismaUser) {
      prismaUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          firstName: user.user_metadata?.firstName || null,
          lastName: user.user_metadata?.lastName || null,
        },
      })
    }

    // Calculate amount (use £1 minimum for testing in development)
    const calculatedTotal = Number(creditPackage.price)
    const isDev = process.env.NODE_ENV === 'development'
    const totalAmount = isDev ? 1 : calculatedTotal

    // Generate unique reference with CREDIT prefix
    const checkoutReference = `CREDIT-${generateCheckoutReference()}`

    // Get app URL for redirect
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const redirectUrl = `${appUrl}/checkout/success?ref=${checkoutReference}`

    // Create description
    const description = `Harry's PT - ${creditPackage.name}`

    // Create SumUp checkout
    const checkout = await createSumUpCheckout({
      amount: totalAmount,
      currency: 'GBP',
      checkoutReference,
      description,
      redirectUrl,
    })

    // Save order to database with credit package reference
    await prisma.order.create({
      data: {
        userId: prismaUser.id,
        totalAmount,
        sumupCheckoutId: checkout.id,
        sumupReference: checkoutReference,
        creditPackageId: packageId,
        status: 'PENDING',
      },
    })

    // Return checkout URL for redirect
    return NextResponse.json({
      checkoutUrl: checkout.hosted_checkout_url,
      reference: checkoutReference,
    })
  } catch (error) {
    console.error('Credit checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    )
  }
})
