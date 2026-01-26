import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// GET /api/stats/body - Get body stat history
export const GET = withAuth(async (request, { user }) => {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const [stats, total] = await Promise.all([
      prisma.bodyStat.findMany({
        where: { userId: user.id },
        orderBy: { recordedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.bodyStat.count({
        where: { userId: user.id },
      }),
    ])

    // Convert Decimal to number for JSON serialization
    const serializedStats = stats.map((stat) => ({
      ...stat,
      weight: stat.weight ? Number(stat.weight) : null,
      height: stat.height ? Number(stat.height) : null,
      chest: stat.chest ? Number(stat.chest) : null,
      waist: stat.waist ? Number(stat.waist) : null,
      hips: stat.hips ? Number(stat.hips) : null,
      leftArm: stat.leftArm ? Number(stat.leftArm) : null,
      rightArm: stat.rightArm ? Number(stat.rightArm) : null,
      leftLeg: stat.leftLeg ? Number(stat.leftLeg) : null,
      rightLeg: stat.rightLeg ? Number(stat.rightLeg) : null,
      bodyFatPct: stat.bodyFatPct ? Number(stat.bodyFatPct) : null,
    }))

    return NextResponse.json({
      stats: serializedStats,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching body stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch body stats' },
      { status: 500 }
    )
  }
})

// POST /api/stats/body - Log new body stats
export const POST = withAuth(async (request, { user }) => {
  try {
    const body = await request.json()

    const stat = await prisma.bodyStat.create({
      data: {
        userId: user.id,
        weight: body.weight || null,
        height: body.height || null,
        age: body.age || null,
        gender: body.gender || null,
        chest: body.chest || null,
        waist: body.waist || null,
        hips: body.hips || null,
        leftArm: body.leftArm || null,
        rightArm: body.rightArm || null,
        leftLeg: body.leftLeg || null,
        rightLeg: body.rightLeg || null,
        bodyFatPct: body.bodyFatPct || null,
        recordedAt: body.recordedAt ? new Date(body.recordedAt) : new Date(),
      },
    })

    return NextResponse.json({
      ...stat,
      weight: stat.weight ? Number(stat.weight) : null,
      height: stat.height ? Number(stat.height) : null,
      chest: stat.chest ? Number(stat.chest) : null,
      waist: stat.waist ? Number(stat.waist) : null,
      hips: stat.hips ? Number(stat.hips) : null,
      leftArm: stat.leftArm ? Number(stat.leftArm) : null,
      rightArm: stat.rightArm ? Number(stat.rightArm) : null,
      leftLeg: stat.leftLeg ? Number(stat.leftLeg) : null,
      rightLeg: stat.rightLeg ? Number(stat.rightLeg) : null,
      bodyFatPct: stat.bodyFatPct ? Number(stat.bodyFatPct) : null,
    })
  } catch (error) {
    console.error('Error creating body stat:', error)
    return NextResponse.json(
      { error: 'Failed to create body stat' },
      { status: 500 }
    )
  }
})
