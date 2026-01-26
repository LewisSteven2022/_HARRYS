import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/credit-packages - List all active credit packages
export async function GET() {
  try {
    const packages = await prisma.creditPackage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        sessionCount: true,
        price: true,
      },
    })

    // Get the standard session price for comparison
    const config = await prisma.siteConfig.findFirst()
    const sessionPrice = config?.sessionPrice ?? 15

    // Add savings calculation to each package
    const packagesWithSavings = packages.map((pkg) => {
      const standardTotal = Number(sessionPrice) * pkg.sessionCount
      const savings = standardTotal - Number(pkg.price)
      const savingsPercent = Math.round((savings / standardTotal) * 100)

      return {
        ...pkg,
        price: Number(pkg.price),
        standardPrice: Number(sessionPrice),
        savings: savings > 0 ? savings : 0,
        savingsPercent: savingsPercent > 0 ? savingsPercent : 0,
      }
    })

    return NextResponse.json({ packages: packagesWithSavings })
  } catch (error) {
    console.error('Credit packages API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credit packages' },
      { status: 500 }
    )
  }
}
