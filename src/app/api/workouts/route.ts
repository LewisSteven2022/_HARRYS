import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

interface ExerciseInput {
  name: string
  sets?: number
  reps?: number
  weight?: number
  duration?: number
  notes?: string
  orderIndex?: number
}

// GET /api/workouts - List workouts with pagination
export const GET = withAuth(async (request, { user }) => {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
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

    const [workouts, total] = await Promise.all([
      prisma.workoutLog.findMany({
        where,
        orderBy: { date: 'desc' },
        take: limit,
        skip: offset,
        include: {
          exercises: {
            orderBy: { orderIndex: 'asc' },
          },
        },
      }),
      prisma.workoutLog.count({ where }),
    ])

    // Convert Decimal to number for JSON serialization
    const serializedWorkouts = workouts.map((workout) => ({
      ...workout,
      exercises: workout.exercises.map((ex) => ({
        ...ex,
        weight: ex.weight ? Number(ex.weight) : null,
      })),
    }))

    return NextResponse.json({
      workouts: serializedWorkouts,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching workouts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    )
  }
})

// POST /api/workouts - Create workout with exercises
export const POST = withAuth(async (request, { user }) => {
  try {
    const body = await request.json()

    if (!body.workoutType) {
      return NextResponse.json(
        { error: 'Workout type is required' },
        { status: 400 }
      )
    }

    const exercises: ExerciseInput[] = body.exercises || []

    const workout = await prisma.workoutLog.create({
      data: {
        userId: user.id,
        date: body.date ? new Date(body.date) : new Date(),
        workoutType: body.workoutType,
        duration: body.duration || null,
        notes: body.notes || null,
        exercises: {
          create: exercises.map((ex, index) => ({
            name: ex.name,
            sets: ex.sets || null,
            reps: ex.reps || null,
            weight: ex.weight || null,
            duration: ex.duration || null,
            notes: ex.notes || null,
            orderIndex: ex.orderIndex ?? index,
          })),
        },
      },
      include: {
        exercises: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    })

    // Convert Decimal to number for JSON serialization
    const serializedWorkout = {
      ...workout,
      exercises: workout.exercises.map((ex) => ({
        ...ex,
        weight: ex.weight ? Number(ex.weight) : null,
      })),
    }

    return NextResponse.json(serializedWorkout, { status: 201 })
  } catch (error) {
    console.error('Error creating workout:', error)
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    )
  }
})
