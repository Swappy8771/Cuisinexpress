import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Meal, CartItem, DeliveryInfo } from '../types'

const makeKey = (meal: Meal, delivery?: DeliveryInfo) =>
  delivery ? `${meal.id}__${delivery.weekId}__${delivery.day}` : meal.id

interface CartStore {
  items: CartItem[]
  schoolId: string | null
  weekId: string | null
  addItem: (meal: Meal, delivery?: DeliveryInfo) => void
  removeItem: (key: string) => void
  updateQty: (key: string, delta: number) => void
  clearCart: () => void
  getQty: (mealId: string) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      schoolId: null,
      weekId: null,

      addItem: (meal, delivery) =>
        set((state) => {
          const key = makeKey(meal, delivery)
          const existing = state.items.find((i) => (i.key ?? i.meal.id) === key)
          if (existing) {
            return {
              items: state.items.map((i) =>
                (i.key ?? i.meal.id) === key ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { key, meal, quantity: 1, delivery }] }
        }),

      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((i) => (i.key ?? i.meal.id) !== key),
        })),

      updateQty: (key, delta) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              (i.key ?? i.meal.id) === key ? { ...i, quantity: i.quantity + delta } : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),

      // Sums across all delivery variations for the same meal
      getQty: (mealId) =>
        get().items
          .filter((i) => i.meal.id === mealId)
          .reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'cx-cart' }
  )
)

export const selectCartTotal = (s: CartStore) =>
  s.items.reduce((sum, i) => sum + i.meal.price * i.quantity, 0)

export const selectCartCount = (s: CartStore) =>
  s.items.reduce((sum, i) => sum + i.quantity, 0)
