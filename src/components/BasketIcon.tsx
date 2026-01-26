'use client'

import { useBasketStore } from '@/store/basket'
import { useEffect, useState } from 'react'

interface BasketIconProps {
  onClick: () => void
}

export default function BasketIcon({ onClick }: BasketIconProps) {
  const [mounted, setMounted] = useState(false)
  const itemCount = useBasketStore((state) => state.getItemCount())

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-400 hover:text-white transition-colors"
      aria-label="Shopping basket"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      {mounted && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-lime text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  )
}
