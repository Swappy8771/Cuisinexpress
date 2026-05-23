import api from '../lib/api'
import type { User } from '../types'

export type UpdateProfileRequest = Omit<User, 'id'>

export const profileService = {
  async get(): Promise<User> {
    const res = await api.get<User>('/user/profile')
    return res.data
  },

  async update(data: Partial<UpdateProfileRequest>): Promise<User> {
    const res = await api.put<User>('/user/profile', data)
    return res.data
  },
}
