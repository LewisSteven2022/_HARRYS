'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useBasketStore } from '@/store/basket'

interface OrderStatus {
  reference: string
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED'
  email?: string
  name?: string
  amount?: number
  paidAt?: string
}

function LoadingState() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-2xl text-center">
        <div className="w-24 h-24 mx-auto mb-8 bg-gray-800 rounded-full flex items-center justify-center animate-pulse">
          <svg className="w-12 h-12 text-gray-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <h1 className="font-display text-4xl text-white tracking-wide mb-4">
          LOADING...
        </h1>
      </div>
    </div>
  )
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('ref')
  const { clearBasket } = useBasketStore()

  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [basketCleared, setBasketCleared] = useState(false)

  const verifyOrder = useCallback(async () => {
    if (!reference) {
      setError('No booking reference provided')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/orders/${reference}`)

      if (!res.ok) {
        if (res.status === 404) {
          setError('Booking not found')
        } else {
          setError('Failed to verify booking')
        }
        setLoading(false)
        return
      }

      const data: OrderStatus = await res.json()
      setOrder(data)

      // Clear basket only when payment is confirmed
      if (data.status === 'PAID' && !basketCleared) {
        clearBasket()
        setBasketCleared(true)
      }

      // Stop loading unless we need to keep polling
      if (data.status !== 'PENDING') {
        setLoading(false)
      }
    } catch {
      setError('Failed to verify booking')
      setLoading(false)
    }
  }, [reference, basketCleared, clearBasket])

  useEffect(() => {
    verifyOrder()

    // Poll every 2 seconds while pending (max 30 seconds)
    let pollCount = 0
    const maxPolls = 15

    const interval = setInterval(() => {
      if (order?.status === 'PENDING' && pollCount < maxPolls) {
        pollCount++
        verifyOrder()
      } else {
        clearInterval(interval)
        setLoading(false)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [verifyOrder, order?.status])

  // Loading state
  if (loading && !order) {
    return (
      <div className="py-24">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-2xl text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-gray-800 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-12 h-12 text-gray-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h1 className="font-display text-4xl text-white tracking-wide mb-4">
            VERIFYING PAYMENT...
          </h1>
          <p className="text-gray-400">Please wait while we confirm your booking.</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="py-24">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-2xl text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-display text-4xl text-white tracking-wide mb-4">
            SOMETHING WENT WRONG
          </h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link href="/timetable" className="btn-lime text-sm font-semibold tracking-widest uppercase">
            Try Again
          </Link>
        </div>
      </div>
    )
  }

  // Failed payment
  if (order?.status === 'FAILED') {
    return (
      <div className="py-24">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-2xl text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-display text-4xl text-white tracking-wide mb-4">
            PAYMENT FAILED
          </h1>
          <p className="text-gray-400 mb-8">
            Your payment could not be processed. Please try again.
          </p>
          <Link href="/timetable" className="btn-lime text-sm font-semibold tracking-widest uppercase">
            Try Again
          </Link>
        </div>
      </div>
    )
  }

  // Pending (still processing)
  if (order?.status === 'PENDING') {
    return (
      <div className="py-24">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-2xl text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-display text-4xl text-white tracking-wide mb-4">
            PAYMENT PROCESSING
          </h1>
          <p className="text-gray-400 mb-4">
            Your payment is being processed. This page will update automatically.
          </p>
          {reference && (
            <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
              <p className="text-gray-500 text-sm mb-2">Booking Reference</p>
              <p className="font-mono text-yellow-500 text-xl tracking-wider">{reference}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Success (PAID)
  return (
    <div className="py-24">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-2xl text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto mb-8 bg-lime/20 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-lime"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="font-display text-5xl text-white tracking-wide mb-4">
          BOOKING CONFIRMED
        </h1>

        <p className="text-gray-400 text-lg mb-8">
          Thank you for your booking, {order?.name}! A confirmation email will be sent to {order?.email}.
        </p>

        {reference && (
          <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
            <p className="text-gray-500 text-sm mb-2">Booking Reference</p>
            <p className="font-mono text-lime text-xl tracking-wider">{reference}</p>
          </div>
        )}

        <div className="bg-[#111111] rounded-lg p-6 mb-8 text-left">
          <h2 className="font-display text-xl text-white tracking-wide mb-4">
            WHAT'S NEXT?
          </h2>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Check your email for booking confirmation and session details</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Arrive 5-10 minutes before your session starts</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Bring water and wear comfortable workout clothes</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/timetable"
            className="btn-lime text-sm font-semibold tracking-widest uppercase"
          >
            Book More Sessions
          </Link>
          <Link
            href="/"
            className="btn-secondary text-sm font-semibold tracking-widest uppercase"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
