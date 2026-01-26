'use client'

import { useEffect, useState } from 'react'
import { useCreditsStore } from '@/store/credits'
import CreditPurchaseModal from './CreditPurchaseModal'

export default function CreditIndicator() {
  const [mounted, setMounted] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const { totalCredits, fetchCredits, isLoading } = useCreditsStore()

  useEffect(() => {
    setMounted(true)
    fetchCredits()
  }, [fetchCredits])

  // Don't render until mounted (avoid hydration mismatch)
  if (!mounted) return null

  // Don't show if no credits and not loading (user probably not logged in)
  if (totalCredits === 0 && !isLoading) return null

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lime/10 border border-lime/30 hover:bg-lime/20 transition-colors"
        title="Session Credits"
      >
        <svg
          className="w-4 h-4 text-lime"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-lime text-xs font-semibold">{totalCredits}</span>
      </button>

      <CreditPurchaseModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
