import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  accessToken: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,

      setAuth: (user, token) => {
        localStorage.setItem('cx_token', token)
        set({ user, isAuthenticated: true, accessToken: token })
      },

      logout: () => {
        localStorage.removeItem('cx_token')
        set({ user: null, isAuthenticated: false, accessToken: null })
      },

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    { name: 'cx-auth' }
  )
)
