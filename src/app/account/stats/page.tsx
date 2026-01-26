'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface BodyStat {
  id: string
  weight: number | null
  height: number | null
  chest: number | null
  waist: number | null
  hips: number | null
  leftArm: number | null
  rightArm: number | null
  leftLeg: number | null
  rightLeg: number | null
  bodyFatPct: number | null
  recordedAt: string
}

interface DailyLog {
  id: string
  date: string
  steps: number | null
  calories: number | null
  notes: string | null
}

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState<'body' | 'daily'>('body')
  const [bodyStats, setBodyStats] = useState<BodyStat[]>([])
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Body stats form
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [chest, setChest] = useState('')
  const [waist, setWaist] = useState('')
  const [hips, setHips] = useState('')
  const [leftArm, setLeftArm] = useState('')
  const [rightArm, setRightArm] = useState('')
  const [leftLeg, setLeftLeg] = useState('')
  const [rightLeg, setRightLeg] = useState('')
  const [bodyFatPct, setBodyFatPct] = useState('')

  // Daily log form
  const [dailyDate, setDailyDate] = useState(new Date().toISOString().split('T')[0])
  const [steps, setSteps] = useState('')
  const [calories, setCalories] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [bodyRes, dailyRes] = await Promise.all([
        fetch('/api/stats/body?limit=10'),
        fetch('/api/stats/daily?limit=30'),
      ])

      if (bodyRes.status === 401 || dailyRes.status === 401) {
        window.location.href = '/login?redirect=/account/stats'
        return
      }

      const bodyData = await bodyRes.json()
      const dailyData = await dailyRes.json()

      setBodyStats(bodyData.stats || [])
      setDailyLogs(dailyData.logs || [])
    } catch {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  async function handleBodySubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/stats/body', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: weight ? parseFloat(weight) : null,
          height: height ? parseFloat(height) : null,
          chest: chest ? parseFloat(chest) : null,
          waist: waist ? parseFloat(waist) : null,
          hips: hips ? parseFloat(hips) : null,
          leftArm: leftArm ? parseFloat(leftArm) : null,
          rightArm: rightArm ? parseFloat(rightArm) : null,
          leftLeg: leftLeg ? parseFloat(leftLeg) : null,
          rightLeg: rightLeg ? parseFloat(rightLeg) : null,
          bodyFatPct: bodyFatPct ? parseFloat(bodyFatPct) : null,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      const data = await res.json()
      setBodyStats([data, ...bodyStats])
      setSuccess(true)
      clearBodyForm()
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Failed to save body stats')
    } finally {
      setSaving(false)
    }
  }

  async function handleDailySubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/stats/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dailyDate,
          steps: steps ? parseInt(steps) : null,
          calories: calories ? parseInt(calories) : null,
          notes: notes || null,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      await fetchData() // Refresh to get updated list
      setSuccess(true)
      clearDailyForm()
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Failed to save daily log')
    } finally {
      setSaving(false)
    }
  }

  function clearBodyForm() {
    setWeight('')
    setHeight('')
    setChest('')
    setWaist('')
    setHips('')
    setLeftArm('')
    setRightArm('')
    setLeftLeg('')
    setRightLeg('')
    setBodyFatPct('')
  }

  function clearDailyForm() {
    setSteps('')
    setCalories('')
    setNotes('')
  }

  function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat('en-GB', {
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
          <div className="flex items-center mt-4">
            <div className="triple-lines">
              <span></span>
            </div>
            <h1 className="font-display text-4xl text-white tracking-wide">
              FITNESS STATS
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('body')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'body'
                ? 'bg-lime text-black'
                : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
            }`}
          >
            Body Stats
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'daily'
                ? 'bg-lime text-black'
                : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
            }`}
          >
            Daily Activity
          </button>
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

        {/* Body Stats Tab */}
        {activeTab === 'body' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h2 className="font-display text-xl text-white tracking-wide mb-4">
                LOG MEASUREMENTS
              </h2>
              <form onSubmit={handleBodySubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                      placeholder="75.5"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Height (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                      placeholder="175"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Chest (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={chest}
                      onChange={(e) => setChest(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Waist (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Hips (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={hips}
                      onChange={(e) => setHips(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Left Arm (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={leftArm}
                      onChange={(e) => setLeftArm(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Right Arm (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={rightArm}
                      onChange={(e) => setRightArm(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Left Leg (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={leftLeg}
                      onChange={(e) => setLeftLeg(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Right Leg (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={rightLeg}
                      onChange={(e) => setRightLeg(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Body Fat %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyFatPct}
                    onChange={(e) => setBodyFatPct(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                    placeholder="15.5"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-lime w-full text-sm font-semibold tracking-widest uppercase disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Log Measurements'}
                </button>
              </form>
            </div>

            {/* History */}
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h2 className="font-display text-xl text-white tracking-wide mb-4">
                HISTORY
              </h2>
              {bodyStats.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {bodyStats.map((stat) => (
                    <div
                      key={stat.id}
                      className="p-3 rounded-lg bg-[#0a0a0a] border border-gray-800"
                    >
                      <p className="text-lime text-sm font-medium mb-2">
                        {formatDate(stat.recordedAt)}
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        {stat.weight && (
                          <div>
                            <span className="text-gray-500">Weight:</span>{' '}
                            <span className="text-white">{stat.weight}kg</span>
                          </div>
                        )}
                        {stat.chest && (
                          <div>
                            <span className="text-gray-500">Chest:</span>{' '}
                            <span className="text-white">{stat.chest}cm</span>
                          </div>
                        )}
                        {stat.waist && (
                          <div>
                            <span className="text-gray-500">Waist:</span>{' '}
                            <span className="text-white">{stat.waist}cm</span>
                          </div>
                        )}
                        {stat.bodyFatPct && (
                          <div>
                            <span className="text-gray-500">Body Fat:</span>{' '}
                            <span className="text-white">{stat.bodyFatPct}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No measurements recorded yet
                </div>
              )}
            </div>
          </div>
        )}

        {/* Daily Activity Tab */}
        {activeTab === 'daily' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h2 className="font-display text-xl text-white tracking-wide mb-4">
                LOG ACTIVITY
              </h2>
              <form onSubmit={handleDailySubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Date</label>
                  <input
                    type="date"
                    value={dailyDate}
                    onChange={(e) => setDailyDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Steps</label>
                    <input
                      type="number"
                      value={steps}
                      onChange={(e) => setSteps(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Calories Burned</label>
                    <input
                      type="number"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
                      placeholder="500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm focus:border-lime focus:outline-none resize-none"
                    placeholder="How was your day?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-lime w-full text-sm font-semibold tracking-widest uppercase disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Log Activity'}
                </button>
              </form>
            </div>

            {/* History */}
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h2 className="font-display text-xl text-white tracking-wide mb-4">
                RECENT ACTIVITY
              </h2>
              {dailyLogs.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {dailyLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-lg bg-[#0a0a0a] border border-gray-800"
                    >
                      <p className="text-lime text-sm font-medium mb-2">
                        {formatDate(log.date)}
                      </p>
                      <div className="flex gap-4 text-sm">
                        {log.steps && (
                          <div>
                            <span className="text-gray-500">Steps:</span>{' '}
                            <span className="text-white">{log.steps.toLocaleString()}</span>
                          </div>
                        )}
                        {log.calories && (
                          <div>
                            <span className="text-gray-500">Calories:</span>{' '}
                            <span className="text-white">{log.calories}</span>
                          </div>
                        )}
                      </div>
                      {log.notes && (
                        <p className="text-gray-400 text-sm mt-2">{log.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No activity logged yet
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
