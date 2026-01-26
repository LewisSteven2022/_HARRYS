import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

interface ExerciseInput {
  id?: string
  name: string
  sets?: number
  reps?: number
  weight?: number
  duration?: number
  notes?: string
  orderIndex?: number
}

// GET /api/workouts/[id] - Get single workout with exercises
export const GET = withAuth(
  async (request, { user, params }) => {
    try {
      const { id } = await params

      const workout = await prisma.workoutLog.findFirst({
        where: {
          id,
          userId: user.id,
        },
        include: {
          exercises: {
            orderBy: { orderIndex: 'asc' },
          },
        },
      })

      if (!workout) {
        return NextResponse.json(
          { error: 'Workout not found' },
          { status: 404 }
        )
      }

      // Convert Decimal to number for JSON serialization
      const serializedWorkout = {
        ...workout,
        exercises: workout.exercises.map((ex) => ({
          ...ex,
          weight: ex.weight ? Number(ex.weight) : null,
        })),
      }

      return NextResponse.json(serializedWorkout)
    } catch (error) {
      console.error('Error fetching workout:', error)
      return NextResponse.json(
        { error: 'Failed to fetch workout' },
        { status: 500 }
      )
    }
  },
  { hasParams: true }
)

// PUT /api/workouts/[id] - Update workout and exercises
export const PUT = withAuth(
  async (request, { user, params }) => {
    try {
      const { id } = await params
      const body = await request.json()

      // Verify ownership
      const existing = await prisma.workoutLog.findFirst({
        where: { id, userId: user.id },
      })

      if (!existing) {
        return NextResponse.json(
          { error: 'Workout not found' },
          { status: 404 }
        )
      }

      const exercises: ExerciseInput[] = body.exercises || []

      // Update workout and replace exercises
      const workout = await prisma.$transaction(async (tx) => {
        // Delete existing exercises
        await tx.workoutExercise.deleteMany({
          where: { workoutLogId: id },
        })

        // Update workout and create new exercises
        return tx.workoutLog.update({
          where: { id },
          data: {
            date: body.date ? new Date(body.date) : undefined,
            workoutType: body.workoutType ?? undefined,
            duration: body.duration ?? undefined,
            notes: body.notes ?? undefined,
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
      })

      // Convert Decimal to number for JSON serialization
      const serializedWorkout = {
        ...workout,
        exercises: workout.exercises.map((ex) => ({
          ...ex,
          weight: ex.weight ? Number(ex.weight) : null,
        })),
      }

      return NextResponse.json(serializedWorkout)
    } catch (error) {
      console.error('Error updating workout:', error)
      return NextResponse.json(
        { error: 'Failed to update workout' },
        { status: 500 }
      )
    }
  },
  { hasParams: true }
)

// DELETE /api/workouts/[id] - Delete workout (cascades to exercises)
export const DELETE = withAuth(
  async (request, { user, params }) => {
    try {
      const { id } = await params

      // Verify ownership
      const existing = await prisma.workoutLog.findFirst({
        where: { id, userId: user.id },
      })

      if (!existing) {
        return NextResponse.json(
          { error: 'Workout not found' },
          { status: 404 }
        )
      }

      await prisma.workoutLog.delete({
        where: { id },
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error deleting workout:', error)
      return NextResponse.json(
        { error: 'Failed to delete workout' },
        { status: 500 }
      )
    }
  },
  { hasParams: true }
)
