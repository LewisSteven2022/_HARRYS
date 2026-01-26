'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBasketStore } from '@/store/basket'
import { useCreditsStore } from '@/store/credits'
import Link from 'next/link'
import CreditPurchaseModal from '@/components/CreditPurchaseModal'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearBasket } = useBasketStore()
  const { totalCredits, fetchCredits, decrementCredits } = useCreditsStore()
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [useCredits, setUseCredits] = useState(false)
  const [showCreditModal, setShowCreditModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if user is logged in and fetch credits
    fetchCredits().then(() => {
      // If we have credits, user is logged in
      const credits = useCreditsStore.getState()
      if (credits.totalCredits > 0 || credits.lastFetched) {
        setIsLoggedIn(true)
      }
    })
  }, [fetchCredits])

  // Auto-select use credits if user has enough
  useEffect(() => {
    if (totalCredits >= items.length && items.length > 0) {
      setUseCredits(true)
    }
  }, [totalCredits, items.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          email,
          name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout')
      }

      // Redirect to SumUp hosted checkout
      if (data.checkoutUrl) {
        // Store reference in session storage for verification
        sessionStorage.setItem('checkoutRef', data.reference)
        window.location.href = data.checkoutUrl
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const handleUseCredits = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/bookings/use-credit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sessions: items.map((item) => ({
            sessionId: item.sessionId,
            date: item.date,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login
          router.push(`/login?redirect=/checkout`)
          return
        }
        throw new Error(data.error || 'Failed to book with credits')
      }

      // Success - update credits and clear basket
      decrementCredits(data.creditsUsed)
      clearBasket()

      // Redirect to success page
      router.push('/checkout/success?credits=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="py-24">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-2xl text-center">
          <svg
            className="w-20 h-20 mx-auto text-gray-700 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h1 className="font-display text-4xl text-white tracking-wide mb-4">
            YOUR BASKET IS EMPTY
          </h1>
          <p className="text-gray-400 mb-8">
            Add some sessions to your basket before checking out.
          </p>
          <Link
            href="/timetable"
            className="inline-block btn-lime text-sm font-semibold tracking-widest uppercase"
          >
            View Schedule
          </Link>
        </div>
      </div>
    )
  }

  const total = getTotal()
  const creditsToUse = Math.min(totalCredits, items.length)
  const remainingItems = items.length - creditsToUse
  const remainingTotal = remainingItems * (items[0]?.price || 15)

  return (
    <div className="py-16">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center mb-2">
            <div className="triple-lines">
              <span></span>
            </div>
            <h1 className="font-display text-5xl text-white tracking-wide">
              CHECKOUT
            </h1>
          </div>
          <p className="text-gray-400">
            Complete your booking by entering your details below.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div>
            <h2 className="font-display text-2xl text-white tracking-wide mb-6">
              ORDER SUMMARY
            </h2>
            <div className="bg-[#1a1a1a] rounded-lg divide-y divide-gray-800">
              {items.map((item) => (
                <div
                  key={`${item.sessionId}-${item.date}`}
                  className="p-4 flex justify-between items-start"
                >
                  <div>
                    <p className="text-lime font-display text-lg">
                      {item.sessionTypeName}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {formatDate(item.date)} &middot; {item.startTime} - {item.endTime}
                    </p>
                  </div>
                  <span className="text-white">£{item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="p-4 flex justify-between items-center">
                <span className="text-gray-400 font-medium">Total</span>
                <span className="font-display text-3xl text-white">
                  £{total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Credit Balance Info */}
            {totalCredits > 0 && (
              <div className="mt-6 bg-lime/10 border border-lime/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lime font-medium">
                      You have {totalCredits} credit{totalCredits !== 1 ? 's' : ''} available
                    </p>
                    <p className="text-gray-400 text-sm">
                      {creditsToUse >= items.length
                        ? 'Enough to cover your entire order!'
                        : `Can cover ${creditsToUse} of ${items.length} sessions`}
                    </p>
                  </div>
                  <svg
                    className="w-8 h-8 text-lime"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Checkout Options */}
          <div>
            {/* Credit Option (if user has credits) */}
            {totalCredits > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-2xl text-white tracking-wide mb-6">
                  PAYMENT METHOD
                </h2>
                <div className="space-y-4">
                  {/* Use Credits Option */}
                  <button
                    onClick={() => setUseCredits(true)}
                    className={`w-full p-4 rounded-lg border text-left transition-colors ${
                      useCredits
                        ? 'bg-lime/10 border-lime'
                        : 'bg-[#1a1a1a] border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">
                          Use Credits ({creditsToUse} credit{creditsToUse !== 1 ? 's' : ''})
                        </p>
                        {remainingItems > 0 ? (
                          <p className="text-gray-400 text-sm">
                            + £{remainingTotal.toFixed(2)} for remaining {remainingItems} session{remainingItems !== 1 ? 's' : ''}
                          </p>
                        ) : (
                          <p className="text-lime text-sm">Instant booking - no payment needed</p>
                        )}
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          useCredits ? 'border-lime bg-lime' : 'border-gray-600'
                        }`}
                      >
                        {useCredits && (
                          <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Pay Option */}
                  <button
                    onClick={() => setUseCredits(false)}
                    className={`w-full p-4 rounded-lg border text-left transition-colors ${
                      !useCredits
                        ? 'bg-lime/10 border-lime'
                        : 'bg-[#1a1a1a] border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Pay with Card</p>
                        <p className="text-gray-400 text-sm">
                          £{total.toFixed(2)} via SumUp
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          !useCredits ? 'border-lime bg-lime' : 'border-gray-600'
                        }`}
                      >
                        {!useCredits && (
                          <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                </div>

                {error && (
                  <div className="mt-4 bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Action Button */}
                <div className="mt-6">
                  {useCredits && creditsToUse >= items.length ? (
                    <button
                      onClick={handleUseCredits}
                      disabled={loading}
                      className="w-full btn-lime text-sm font-semibold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Booking...' : `Book with ${creditsToUse} Credit${creditsToUse !== 1 ? 's' : ''}`}
                    </button>
                  ) : useCredits ? (
                    // Mixed checkout - credits + payment (future feature)
                    <p className="text-gray-400 text-sm text-center">
                      Mixed checkout coming soon. Please use card payment for now.
                    </p>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full btn-lime text-sm font-semibold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : `Pay £${total.toFixed(2)} with SumUp`}
                    </button>
                  )}
                </div>

                <p className="text-gray-600 text-xs text-center mt-4">
                  {useCredits && creditsToUse >= items.length
                    ? 'Your booking will be confirmed instantly.'
                    : 'You will be redirected to SumUp\'s secure payment page.'}
                </p>
              </div>
            )}

            {/* Guest Checkout Form (only if no credits or not using credits) */}
            {(totalCredits === 0 || !useCredits) && (
              <>
                <h2 className="font-display text-2xl text-white tracking-wide mb-6">
                  YOUR DETAILS
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-lime focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-lime focus:outline-none transition-colors"
                      placeholder="Enter your email"
                    />
                    <p className="text-gray-600 text-sm mt-2">
                      Booking confirmation will be sent to this email.
                    </p>
                  </div>

                  {error && totalCredits === 0 && (
                    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-lime text-sm font-semibold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : `Pay £${total.toFixed(2)} with SumUp`}
                    </button>
                  </div>

                  <p className="text-gray-600 text-xs text-center">
                    You will be redirected to SumUp's secure payment page to complete your purchase.
                  </p>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-800">
                  <p className="text-gray-500 text-sm mb-4">Already have an account?</p>
                  <Link
                    href="/login?redirect=/checkout"
                    className="inline-block btn-secondary text-sm font-semibold tracking-widest uppercase"
                  >
                    Sign In
                  </Link>
                </div>
              </>
            )}

            {/* Buy Credits Prompt */}
            {totalCredits === 0 && (
              <div className="mt-8 pt-8 border-t border-gray-800">
                <p className="text-gray-400 text-sm mb-4">
                  Save money by buying session credits in bulk!
                </p>
                <button
                  onClick={() => setShowCreditModal(true)}
                  className="inline-block text-lime text-sm hover:underline"
                >
                  View Credit Packages &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Credit Purchase Modal */}
      <CreditPurchaseModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
      />
    </div>
  )
}
