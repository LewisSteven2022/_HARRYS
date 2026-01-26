'use client'

import { useBasketStore } from '@/store/basket'

interface SessionCardProps {
  sessionId: string
  sessionTypeId: string
  sessionTypeName: string
  date: string // ISO date (YYYY-MM-DD)
  dayOfWeek: number
  startTime: string
  endTime: string
  price: number
  isPrivate?: boolean
}

export default function SessionCard({
  sessionId,
  sessionTypeId,
  sessionTypeName,
  date,
  dayOfWeek,
  startTime,
  endTime,
  price,
  isPrivate = false,
}: SessionCardProps) {
  const { addItem, removeItem, isInBasket } = useBasketStore()
  const inBasket = isInBasket(sessionId, date)

  const handleToggle = () => {
    if (inBasket) {
      removeItem(sessionId, date)
    } else {
      addItem({
        sessionId,
        sessionTypeId,
        sessionTypeName,
        date,
        dayOfWeek,
        startTime,
        endTime,
        price,
      })
    }
  }

  if (isPrivate) {
    return (
      <div className="bg-[#1a1a1a]/50 border border-gray-800 rounded-lg p-3 opacity-60">
        <p className="text-gray-500 text-sm">
          {startTime} - Private Group
        </p>
      </div>
    )
  }

  return (
    <button
      onClick={handleToggle}
      className={`w-full text-left rounded-lg p-3 transition-all ${
        inBasket
          ? 'bg-lime/20 border-2 border-lime'
          : 'bg-[#1a1a1a] border border-gray-800 hover:border-gray-700'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${inBasket ? 'text-lime' : 'text-white'}`}>
            {startTime} - {endTime}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-gray-400 text-sm">£{price}</span>
          <span
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              inBasket
                ? 'bg-lime border-lime'
                : 'border-gray-600'
            }`}
          >
            {inBasket && (
              <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
        </div>
      </div>
    </button>
  )
}
