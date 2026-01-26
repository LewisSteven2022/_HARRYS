import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/user/credits - Get user's credit balance and history
export const GET = withAuth(async (request, { user }) => {
  try {
    // Get user from Prisma (need the Prisma user ID)
    const prismaUser = await prisma.user.findUnique({
      where: { email: user.email! },
    })

    if (!prismaUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const now = new Date()

    // Get all credit purchases with remaining credits
    const purchases = await prisma.creditPurchase.findMany({
      where: {
        userId: prismaUser.id,
        creditsRemaining: { gt: 0 },
        expiresAt: { gt: now }, // Not expired
      },
      include: {
        package: {
          select: {
            name: true,
            sessionCount: true,
          },
        },
      },
      orderBy: { expiresAt: 'asc' }, // Oldest expiring first (FIFO)
    })

    // Calculate total available credits
    const totalCredits = purchases.reduce(
      (sum, p) => sum + p.creditsRemaining,
      0
    )

    // Find credits expiring within 30 days
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const expiringPurchases = purchases.filter(
      (p) => p.expiresAt <= thirtyDaysFromNow
    )
    const expiringCredits = expiringPurchases.reduce(
      (sum, p) => sum + p.creditsRemaining,
      0
    )
    const earliestExpiration = expiringPurchases[0]?.expiresAt || null

    // Get recent credit usage history (last 10)
    const recentUsage = await prisma.creditUsage.findMany({
      where: {
        creditPurchase: {
          userId: prismaUser.id,
        },
      },
      include: {
        booking: {
          include: {
            session: {
              include: {
                sessionType: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return NextResponse.json({
      totalCredits,
      purchases: purchases.map((p) => ({
        id: p.id,
        packageName: p.package.name,
        creditsReceived: p.creditsReceived,
        creditsRemaining: p.creditsRemaining,
        expiresAt: p.expiresAt.toISOString(),
        purchasedAt: p.createdAt.toISOString(),
      })),
      expiringCredits: expiringCredits > 0
        ? {
            count: expiringCredits,
            date: earliestExpiration?.toISOString(),
          }
        : null,
      recentUsage: recentUsage.map((u) => ({
        id: u.id,
        creditsUsed: u.creditsUsed,
        usedAt: u.createdAt.toISOString(),
        sessionType: u.booking.session.sessionType.name,
        sessionDate: u.booking.date.toISOString(),
      })),
    })
  } catch (error) {
    console.error('User credits API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credits' },
      { status: 500 }
    )
  }
})
