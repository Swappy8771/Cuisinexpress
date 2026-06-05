import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Meal, CartItem, DeliveryInfo } from '../types'

type StudentInfo = { id: string; firstName: string; lastName: string; school: string; grade: string }

const makeKey = (meal: Meal, delivery?: DeliveryInfo, student?: StudentInfo) => {
  const base = delivery ? `${meal.id}__${delivery.weekId}__${delivery.day}` : meal.id
  return student ? `${base}__${student.id}` : base
}

interface CartStore {
  items: CartItem[]
  schoolId: string | null
  weekId: string | null
  addItem: (meal: Meal, delivery?: DeliveryInfo, student?: StudentInfo, isAddon?: boolean) => void
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

      addItem: (meal, delivery, student, isAddon = false) =>
        set((state) => {
          const key = makeKey(meal, delivery, student)
          const existing = state.items.find((i) => i.key === key)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === key ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { key, meal, quantity: 1, isAddon, delivery, student }] }
        }),

      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((i) => i.key !== key),
        })),

      updateQty: (key, delta) =>
        set((state) => ({
          items: state.items
            .map((i) => i.key === key ? { ...i, quantity: i.quantity + delta } : i)
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),

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
