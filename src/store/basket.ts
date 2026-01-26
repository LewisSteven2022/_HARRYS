'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BasketItem {
  sessionId: string
  sessionTypeId: string
  sessionTypeName: string
  date: string // ISO date string (YYYY-MM-DD)
  dayOfWeek: number
  startTime: string
  endTime: string
  price: number
}

interface BasketStore {
  items: BasketItem[]
  addItem: (item: BasketItem) => void
  removeItem: (sessionId: string, date: string) => void
  clearBasket: () => void
  isInBasket: (sessionId: string, date: string) => boolean
  getTotal: () => number
  getItemCount: () => number
}

export const useBasketStore = create<BasketStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get()
        // Check if already in basket
        const exists = items.some(
          (i) => i.sessionId === item.sessionId && i.date === item.date
        )
        if (!exists) {
          set({ items: [...items, item] })
        }
      },

      removeItem: (sessionId, date) => {
        const { items } = get()
        set({
          items: items.filter(
            (i) => !(i.sessionId === sessionId && i.date === date)
          ),
        })
      },

      clearBasket: () => {
        set({ items: [] })
      },

      isInBasket: (sessionId, date) => {
        const { items } = get()
        return items.some(
          (i) => i.sessionId === sessionId && i.date === date
        )
      },

      getTotal: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.price, 0)
      },

      getItemCount: () => {
        const { items } = get()
        return items.length
      },
    }),
    {
      name: 'harrys-basket',
    }
  )
)
