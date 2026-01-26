'use client'

import { create } from 'zustand'

export interface CreditPurchase {
  id: string
  packageName: string
  creditsReceived: number
  creditsRemaining: number
  expiresAt: string
  purchasedAt: string
}

export interface CreditUsage {
  id: string
  creditsUsed: number
  usedAt: string
  sessionType: string
  sessionDate: string
}

interface CreditsStore {
  totalCredits: number
  purchases: CreditPurchase[]
  expiringCredits: { count: number; date: string } | null
  recentUsage: CreditUsage[]
  isLoading: boolean
  error: string | null
  lastFetched: number | null
  fetchCredits: () => Promise<void>
  setCredits: (data: {
    totalCredits: number
    purchases: CreditPurchase[]
    expiringCredits: { count: number; date: string } | null
    recentUsage: CreditUsage[]
  }) => void
  decrementCredits: (count: number) => void
  reset: () => void
}

export const useCreditsStore = create<CreditsStore>((set, get) => ({
  totalCredits: 0,
  purchases: [],
  expiringCredits: null,
  recentUsage: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchCredits: async () => {
    // Don't refetch if we fetched within the last 30 seconds
    const { lastFetched, isLoading } = get()
    if (isLoading) return
    if (lastFetched && Date.now() - lastFetched < 30000) return

    set({ isLoading: true, error: null })

    try {
      const res = await fetch('/api/user/credits', {
        headers: { Accept: 'application/json' },
      })

      if (!res.ok) {
        if (res.status === 401) {
          // User not logged in - not an error, just no credits
          set({
            totalCredits: 0,
            purchases: [],
            expiringCredits: null,
            recentUsage: [],
            isLoading: false,
            lastFetched: Date.now(),
          })
          return
        }
        throw new Error('Failed to fetch credits')
      }

      const data = await res.json()
      set({
        totalCredits: data.totalCredits,
        purchases: data.purchases,
        expiringCredits: data.expiringCredits,
        recentUsage: data.recentUsage,
        isLoading: false,
        lastFetched: Date.now(),
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      })
    }
  },

  setCredits: (data) => {
    set({
      totalCredits: data.totalCredits,
      purchases: data.purchases,
      expiringCredits: data.expiringCredits,
      recentUsage: data.recentUsage,
      lastFetched: Date.now(),
    })
  },

  decrementCredits: (count) => {
    const { totalCredits } = get()
    set({ totalCredits: Math.max(0, totalCredits - count) })
  },

  reset: () => {
    set({
      totalCredits: 0,
      purchases: [],
      expiringCredits: null,
      recentUsage: [],
      isLoading: false,
      error: null,
      lastFetched: null,
    })
  },
}))
