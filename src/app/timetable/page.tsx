'use client'

import { useMemo } from 'react'
import SessionCard from '@/components/SessionCard'

// Session price (will come from database/config in production)
const SESSION_PRICE = 15

// Session types
const SESSION_TYPES = {
  POWER_PLAY: {
    id: 'power-play',
    name: 'POWER PLAY',
    description: 'High-intensity strength training designed to build power, explosiveness, and functional strength.',
  },
  LIFT_AND_SHIFT: {
    id: 'lift-and-shift',
    name: 'LIFT AND SHIFT',
    description: 'Functional fitness combining strength work with metabolic conditioning for total body transformation.',
  },
}

// Schedule data (will come from database in production)
const SCHEDULE = [
  {
    dayOfWeek: 1, // Monday
    sessions: [
      { id: 'mon-1', typeId: 'power-play', typeName: 'POWER PLAY', startTime: '6:15am', endTime: '7am' },
      { id: 'mon-2', typeId: 'power-play', typeName: 'POWER PLAY', startTime: '6pm', endTime: '6:45pm' },
    ],
  },
  {
    dayOfWeek: 2, // Tuesday
    sessions: [
      { id: 'tue-1', typeId: 'power-play', typeName: 'POWER PLAY', startTime: '7am', endTime: '7:45am' },
    ],
  },
  {
    dayOfWeek: 3, // Wednesday
    sessions: [
      { id: 'wed-1', typeId: 'lift-and-shift', typeName: 'LIFT AND SHIFT', startTime: '6:15am', endTime: '7am' },
      { id: 'wed-2', typeId: 'lift-and-shift', typeName: 'LIFT AND SHIFT', startTime: '7:15am', endTime: '8am' },
      { id: 'wed-3', typeId: 'lift-and-shift', typeName: 'LIFT AND SHIFT', startTime: '4:30pm', endTime: '5:15pm', isPrivate: true },
      { id: 'wed-4', typeId: 'lift-and-shift', typeName: 'LIFT AND SHIFT', startTime: '5:45pm', endTime: '6:30pm' },
    ],
  },
  {
    dayOfWeek: 4, // Thursday
    sessions: [
      { id: 'thu-1', typeId: 'power-play', typeName: 'POWER PLAY', startTime: '6:15am', endTime: '7am' },
      { id: 'thu-2', typeId: 'power-play', typeName: 'POWER PLAY', startTime: '6pm', endTime: '6:45pm' },
    ],
  },
  {
    dayOfWeek: 5, // Friday
    sessions: [
      { id: 'fri-1', typeId: 'lift-and-shift', typeName: 'LIFT AND SHIFT', startTime: '6:15am', endTime: '7am' },
      { id: 'fri-2', typeId: 'lift-and-shift', typeName: 'LIFT AND SHIFT', startTime: '7:15am', endTime: '8am' },
    ],
  },
  {
    dayOfWeek: 6, // Saturday
    sessions: [
      { id: 'sat-1', typeId: 'power-play', typeName: 'POWER PLAY', startTime: '8am', endTime: '8:45am' },
    ],
  },
  {
    dayOfWeek: 0, // Sunday
    sessions: [],
  },
]

const DAY_NAMES = ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT']
const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
]

function getWeekDates() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

  const dates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    dates.push(date)
  }

  return { monday, dates }
}

function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0]
}

export default function Timetable() {
  const { monday, dates } = useMemo(() => getWeekDates(), [])

  // Map day of week to schedule
  const scheduleByDay = useMemo(() => {
    const map = new Map<number, typeof SCHEDULE[0]>()
    SCHEDULE.forEach((day) => {
      map.set(day.dayOfWeek, day)
    })
    return map
  }, [])

  // Reorder to start from Monday
  const orderedDays = [1, 2, 3, 4, 5, 6, 0] // Mon to Sun

  return (
    <>
      {/* Page Header */}
      <section className="py-16 border-b border-gray-900">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="triple-lines">
                  <span></span>
                </div>
                <h1 className="font-display text-5xl md:text-7xl text-white tracking-wide">
                  SCHEDULE
                </h1>
              </div>
              <p className="font-display text-xl text-lime tracking-widest">
                {MONTH_NAMES[monday.getMonth()]} {monday.getFullYear()}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="font-display text-3xl text-white tracking-wider">HARRY&apos;S</span>
              <span className="text-lime font-display text-xl">PT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section className="py-6 bg-[#111111] border-b border-gray-900">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          <p className="text-gray-400 text-sm text-center">
            Click on a session to add it to your basket. Select multiple sessions and checkout when ready.
          </p>
        </div>
      </section>

      {/* Schedule Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          <div className="space-y-0">
            {orderedDays.map((dayOfWeek, index) => {
              const daySchedule = scheduleByDay.get(dayOfWeek)
              const date = dates[index]
              const dateISO = formatDateISO(date)
              const isRestDay = !daySchedule || daySchedule.sessions.length === 0

              return (
                <div
                  key={dayOfWeek}
                  className={`py-8 ${index < 6 ? 'border-b border-gray-900' : ''}`}
                >
                  <div className="flex gap-8 md:gap-16 items-start">
                    <div className="w-20 md:w-28 flex-shrink-0">
                      <p className="day-name">{DAY_NAMES[dayOfWeek]}</p>
                      <p className="day-number">{date.getDate()}</p>
                    </div>
                    <div className="flex-1">
                      {isRestDay ? (
                        <p className="text-gray-600 text-sm tracking-wide">REST DAY</p>
                      ) : (
                        <div className="space-y-4">
                          {/* Group sessions by type */}
                          {Object.values(
                            daySchedule!.sessions.reduce((acc, session) => {
                              if (!acc[session.typeName]) {
                                acc[session.typeName] = []
                              }
                              acc[session.typeName].push(session)
                              return acc
                            }, {} as Record<string, typeof daySchedule.sessions>)
                          ).map((sessionGroup) => (
                            <div key={sessionGroup[0].typeName}>
                              <h3 className="program-name text-xl md:text-2xl mb-3">
                                {sessionGroup[0].typeName}
                              </h3>
                              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 max-w-2xl">
                                {sessionGroup.map((session) => (
                                  <SessionCard
                                    key={session.id}
                                    sessionId={session.id}
                                    sessionTypeId={session.typeId}
                                    sessionTypeName={session.typeName}
                                    date={dateISO}
                                    dayOfWeek={dayOfWeek}
                                    startTime={session.startTime}
                                    endTime={session.endTime}
                                    price={SESSION_PRICE}
                                    isPrivate={session.isPrivate}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Session Types */}
      <section className="py-16 border-t border-gray-900 bg-[#111111]">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          <div className="flex items-center justify-center mb-12">
            <div className="triple-lines">
              <span></span>
            </div>
            <h2 className="font-display text-3xl text-white tracking-wide">
              SESSION TYPES
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="card-rounded-lg card-glow p-6">
              <h3 className="program-name text-xl mb-3 text-lime">
                {SESSION_TYPES.POWER_PLAY.name}
              </h3>
              <p className="text-gray-400 text-sm">
                {SESSION_TYPES.POWER_PLAY.description}
              </p>
              <p className="text-lime font-semibold mt-4">£{SESSION_PRICE} per session</p>
            </div>

            <div className="card-rounded-lg card-glow p-6">
              <h3 className="program-name text-xl mb-3 text-lime">
                {SESSION_TYPES.LIFT_AND_SHIFT.name}
              </h3>
              <p className="text-gray-400 text-sm">
                {SESSION_TYPES.LIFT_AND_SHIFT.description}
              </p>
              <p className="text-lime font-semibold mt-4">£{SESSION_PRICE} per session</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-gray-900">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="triple-lines">
                <span></span>
              </div>
              <h2 className="font-display text-4xl text-white tracking-wide">
                READY TO TRAIN?
              </h2>
            </div>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Select your sessions above and proceed to checkout. New here? Book a free consultation first.
            </p>
            <a
              href="/book-consultation"
              className="inline-block btn-lime text-sm font-semibold tracking-widest uppercase"
            >
              Book Free Consultation
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
