'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Exercise {
  id?: string
  name: string
  sets: number | null
  reps: number | null
  weight: number | null
  duration: number | null
  notes: string | null
}

interface Workout {
  id: string
  date: string
  workoutType: string
  duration: number | null
  notes: string | null
  exercises: Exercise[]
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state
  const [workoutType, setWorkoutType] = useState('')
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0])
  const [workoutDuration, setWorkoutDuration] = useState('')
  const [workoutNotes, setWorkoutNotes] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: null, reps: null, weight: null, duration: null, notes: null },
  ])

  useEffect(() => {
    fetchWorkouts()
  }, [])

  async function fetchWorkouts() {
    try {
      const res = await fetch('/api/workouts?limit=20')
      if (res.status === 401) {
        window.location.href = '/login?redirect=/account/workouts'
        return
      }
      const data = await res.json()
      setWorkouts(data.workouts || [])
    } catch {
      setError('Failed to load workouts')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!workoutType.trim()) {
      setError('Workout type is required')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(false)

    const validExercises = exercises.filter((ex) => ex.name.trim())

    try {
      const url = editingId ? `/api/workouts/${editingId}` : '/api/workouts'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutType,
          date: workoutDate,
          duration: workoutDuration ? parseInt(workoutDuration) : null,
          notes: workoutNotes || null,
          exercises: validExercises,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      await fetchWorkouts()
      setSuccess(true)
      resetForm()
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Failed to save workout')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this workout?')) return

    try {
      const res = await fetch(`/api/workouts/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setWorkouts(workouts.filter((w) => w.id !== id))
    } catch {
      setError('Failed to delete workout')
    }
  }

  function editWorkout(workout: Workout) {
    setEditingId(workout.id)
    setWorkoutType(workout.workoutType)
    setWorkoutDate(workout.date.split('T')[0])
    setWorkoutDuration(workout.duration?.toString() || '')
    setWorkoutNotes(workout.notes || '')
    setExercises(
      workout.exercises.length > 0
        ? workout.exercises
        : [{ name: '', sets: null, reps: null, weight: null, duration: null, notes: null }]
    )
    setShowForm(true)
  }

  function resetForm() {
    setEditingId(null)
    setWorkoutType('')
    setWorkoutDate(new Date().toISOString().split('T')[0])
    setWorkoutDuration('')
    setWorkoutNotes('')
    setExercises([{ name: '', sets: null, reps: null, weight: null, duration: null, notes: null }])
    setShowForm(false)
  }

  function addExercise() {
    setExercises([
      ...exercises,
      { name: '', sets: null, reps: null, weight: null, duration: null, notes: null },
    ])
  }

  function removeExercise(index: number) {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index))
    }
  }

  function updateExercise(index: number, field: keyof Exercise, value: string | number | null) {
    const updated = [...exercises]
    updated[index] = { ...updated[index], [field]: value }
    setExercises(updated)
  }

  function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr))
  }

  if (loading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-800 rounded w-48 mb-8"></div>
            <div className="bg-[#1a1a1a] rounded-lg p-6 h-96"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="text-gray-400 hover:text-lime text-sm mb-4 inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Account
          </Link>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <div className="triple-lines">
                <span></span>
              </div>
              <h1 className="font-display text-4xl text-white tracking-wide">
                WORKOUT LOG
              </h1>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-lime text-sm font-semibold tracking-widest uppercase"
              >
                + New Workout
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-800 text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-900/20 border border-green-800 text-green-400">
            Saved successfully!
          </div>
        )}

        {/* Workout Form */}
        {showForm && (
          <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl text-white tracking-wide">
                {editingId ? 'EDIT WORKOUT' : 'NEW WORKOUT'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Workout Details */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Workout Type *</label>
                  <input
                    type="text"
                    value={workoutType}
                    onChange={(e) => setWorkoutType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                    placeholder="e.g., Upper Body, Cardio"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Date</label>
                  <input
                    type="date"
                    value={workoutDate}
                    onChange={(e) => setWorkoutDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                    placeholder="45"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Notes</label>
                <textarea
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none resize-none"
                  placeholder="How did it go?"
                />
              </div>

              {/* Exercises */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-gray-400 text-sm">Exercises</label>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="text-lime text-sm hover:underline"
                  >
                    + Add Exercise
                  </button>
                </div>

                <div className="space-y-3">
                  {exercises.map((exercise, index) => (
                    <div key={index} className="p-3 rounded-lg bg-[#0a0a0a] border border-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) => updateExercise(index, 'name', e.target.value)}
                          className="flex-1 px-2 py-1 bg-transparent border-b border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                          placeholder="Exercise name"
                        />
                        {exercises.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExercise(index)}
                            className="ml-2 text-gray-500 hover:text-red-400"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div>
                          <label className="block text-gray-500 text-xs mb-1">Sets</label>
                          <input
                            type="number"
                            value={exercise.sets || ''}
                            onChange={(e) => updateExercise(index, 'sets', e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full px-2 py-1 rounded bg-[#1a1a1a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 text-xs mb-1">Reps</label>
                          <input
                            type="number"
                            value={exercise.reps || ''}
                            onChange={(e) => updateExercise(index, 'reps', e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full px-2 py-1 rounded bg-[#1a1a1a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 text-xs mb-1">Weight (kg)</label>
                          <input
                            type="number"
                            step="0.5"
                            value={exercise.weight || ''}
                            onChange={(e) => updateExercise(index, 'weight', e.target.value ? parseFloat(e.target.value) : null)}
                            className="w-full px-2 py-1 rounded bg-[#1a1a1a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 text-xs mb-1">Time (sec)</label>
                          <input
                            type="number"
                            value={exercise.duration || ''}
                            onChange={(e) => updateExercise(index, 'duration', e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full px-2 py-1 rounded bg-[#1a1a1a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-lime w-full text-sm font-semibold tracking-widest uppercase disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Update Workout' : 'Save Workout'}
              </button>
            </form>
          </div>
        )}

        {/* Workout List */}
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h2 className="font-display text-xl text-white tracking-wide mb-4">
            WORKOUT HISTORY
          </h2>
          {workouts.length > 0 ? (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="p-4 rounded-lg bg-[#0a0a0a] border border-gray-800"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-lime font-medium">{workout.workoutType}</p>
                      <p className="text-gray-500 text-sm">{formatDate(workout.date)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {workout.duration && (
                        <span className="text-gray-400 text-sm">{workout.duration} min</span>
                      )}
                      <button
                        onClick={() => editWorkout(workout)}
                        className="text-gray-400 hover:text-lime"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(workout.id)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {workout.exercises.length > 0 && (
                    <div className="border-t border-gray-800 pt-3 mt-3">
                      <p className="text-gray-500 text-xs uppercase mb-2">Exercises</p>
                      <div className="space-y-1">
                        {workout.exercises.map((ex, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-300">{ex.name}</span>
                            <span className="text-gray-500">
                              {ex.sets && ex.reps && `${ex.sets}x${ex.reps}`}
                              {ex.weight && ` @ ${ex.weight}kg`}
                              {ex.duration && ` (${ex.duration}s)`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {workout.notes && (
                    <p className="text-gray-400 text-sm mt-3 pt-3 border-t border-gray-800">
                      {workout.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-700 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <p className="text-gray-500">No workouts logged yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-block mt-4 text-lime text-sm hover:underline"
              >
                Log your first workout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
