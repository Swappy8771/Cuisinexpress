import api from '../lib/api'
import type { User } from '../types'

export type UpdateProfileRequest = Omit<User, 'id'>

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let mockProfile: User = {
  id: 'usr-demo',
  firstName: 'Marie',
  lastName: 'Tremblay',
  email: 'demo@cuisinexpress.ca',
  phone: '581-992-9952',
  address: '',
  notifications: true,
}

function delay(ms = 400) { return new Promise<void>((r) => setTimeout(r, ms)) }

export const profileService = {
  async get(): Promise<User> {
    if (USE_MOCK) { await delay(); return { ...mockProfile } }
    const res = await api.get<User>('/user/profile')
    return res.data
  },

  async update(data: Partial<UpdateProfileRequest>): Promise<User> {
    if (USE_MOCK) {
      await delay()
      mockProfile = { ...mockProfile, ...data }
      return { ...mockProfile }
    }
    const res = await api.put<User>('/user/profile', data)
    return res.data
  },
}
