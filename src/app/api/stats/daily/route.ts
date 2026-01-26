import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// GET /api/stats/daily - Get daily logs with optional date range
export const GET = withAuth(async (request, { user }) => {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '30')
    const offset = parseInt(searchParams.get('offset') || '0')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: { userId: string; date?: { gte?: Date; lte?: Date } } = {
      userId: user.id,
    }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    const [logs, total] = await Promise.all([
      prisma.dailyLog.findMany({
        where,
        orderBy: { date: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.dailyLog.count({ where }),
    ])

    return NextResponse.json({
      logs,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching daily logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily logs' },
      { status: 500 }
    )
  }
})

// POST /api/stats/daily - Create or update daily log (upsert by date)
export const POST = withAuth(async (request, { user }) => {
  try {
    const body = await request.json()

    if (!body.date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      )
    }

    const date = new Date(body.date)
    // Normalize to start of day for consistent matching
    date.setHours(0, 0, 0, 0)

    const log = await prisma.dailyLog.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date,
        },
      },
      update: {
        steps: body.steps ?? undefined,
        calories: body.calories ?? undefined,
        notes: body.notes ?? undefined,
      },
      create: {
        userId: user.id,
        date,
        steps: body.steps || null,
        calories: body.calories || null,
        notes: body.notes || null,
      },
    })

    return NextResponse.json(log)
  } catch (error) {
    console.error('Error creating/updating daily log:', error)
    return NextResponse.json(
      { error: 'Failed to save daily log' },
      { status: 500 }
    )
  }
})

// PUT /api/stats/daily - Update existing daily log by date
export const PUT = withAuth(async (request, { user }) => {
  try {
    const body = await request.json()

    if (!body.date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      )
    }

    const date = new Date(body.date)
    date.setHours(0, 0, 0, 0)

    const log = await prisma.dailyLog.update({
      where: {
        userId_date: {
          userId: user.id,
          date,
        },
      },
      data: {
        steps: body.steps ?? undefined,
        calories: body.calories ?? undefined,
        notes: body.notes ?? undefined,
      },
    })

    return NextResponse.json(log)
  } catch (error) {
    console.error('Error updating daily log:', error)
    return NextResponse.json(
      { error: 'Failed to update daily log' },
      { status: 500 }
    )
  }
})
