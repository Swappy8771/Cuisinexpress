import { create } from 'zustand'

interface User {
  name: string
  email: string
  phone: string
  address: string
  notifications: boolean
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string) => void
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email) =>
    set({
      isAuthenticated: true,
      user: {
        name: 'David Charles',
        email,
        phone: '123456789',
        address: '',
        notifications: false,
      },
    }),
  logout: () => set({ isAuthenticated: false, user: null }),
  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}))
