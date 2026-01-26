'use client'

import { useEffect, useState } from 'react'
import { useCreditsStore } from '@/store/credits'

interface CreditPackage {
  id: string
  name: string
  sessionCount: number
  price: number
  standardPrice: number
  savings: number
  savingsPercent: number
}

interface CreditPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreditPurchaseModal({
  isOpen,
  onClose,
}: CreditPurchaseModalProps) {
  const [packages, setPackages] = useState<CreditPackage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { totalCredits, fetchCredits } = useCreditsStore()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      fetchPackages()
      fetchCredits()
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, fetchCredits])

  async function fetchPackages() {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/credit-packages')
      if (!res.ok) throw new Error('Failed to load packages')
      const data = await res.json()
      setPackages(data.packages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load packages')
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePurchase(packageId: string) {
    setIsPurchasing(packageId)
    setError(null)
    try {
      const res = await fetch('/api/credits/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ packageId }),
      })

      if (!res.ok) {
        const data = await res.json()
        if (res.status === 401) {
          // Redirect to login
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
          return
        }
        throw new Error(data.error || 'Failed to start checkout')
      }

      const data = await res.json()
      // Redirect to SumUp checkout
      window.location.href = data.checkoutUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout')
      setIsPurchasing(null)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div>
              <h2 className="font-display text-2xl text-white tracking-wide">
                BUY CREDITS
              </h2>
              {totalCredits > 0 && (
                <p className="text-gray-400 text-sm mt-1">
                  You have {totalCredits} credit{totalCredits !== 1 ? 's' : ''}{' '}
                  available
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 border-2 border-lime border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-500 mt-4">Loading packages...</p>
              </div>
            ) : packages.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">No packages available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-display text-lg text-white tracking-wide">
                          {pkg.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {pkg.sessionCount} session
                          {pkg.sessionCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {pkg.savingsPercent > 0 && (
                        <span className="bg-lime/20 text-lime text-xs font-semibold px-2 py-1 rounded">
                          Save {pkg.savingsPercent}%
                        </span>
                      )}
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-display text-white">
                          £{pkg.price.toFixed(2)}
                        </span>
                        {pkg.savings > 0 && (
                          <span className="text-gray-500 text-sm ml-2 line-through">
                            £{(pkg.standardPrice * pkg.sessionCount).toFixed(2)}
                          </span>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                          £{(pkg.price / pkg.sessionCount).toFixed(2)} per
                          session
                        </p>
                      </div>
                      <button
                        onClick={() => handlePurchase(pkg.id)}
                        disabled={isPurchasing !== null}
                        className="btn-lime text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPurchasing === pkg.id ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          'Buy Now'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-gray-600 text-xs text-center mt-6">
              Credits are valid for 12 months from purchase date
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
