import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Meal, CartItem } from '../types'

interface CartStore {
  items: CartItem[]
  schoolId: string | null
  weekId: string | null
  addItem: (meal: Meal) => void
  removeItem: (mealId: string) => void
  updateQty: (mealId: string, delta: number) => void
  clearCart: () => void
  getQty: (mealId: string) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      schoolId: null,
      weekId: null,

      addItem: (meal) =>
        set((state) => {
          const existing = state.items.find((i) => i.meal.id === meal.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.meal.id === meal.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { meal, quantity: 1 }] }
        }),

      removeItem: (mealId) =>
        set((state) => ({
          items: state.items.filter((i) => i.meal.id !== mealId),
        })),

      updateQty: (mealId, delta) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.meal.id === mealId ? { ...i, quantity: i.quantity + delta } : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),

      getQty: (mealId) =>
        get().items.find((i) => i.meal.id === mealId)?.quantity ?? 0,
    }),
    { name: 'cx-cart' }
  )
)

export const selectCartTotal = (s: CartStore) =>
  s.items.reduce((sum, i) => sum + i.meal.price * i.quantity, 0)

export const selectCartCount = (s: CartStore) =>
  s.items.reduce((sum, i) => sum + i.quantity, 0)
