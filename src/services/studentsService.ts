import api from '../lib/api'
import type { Student } from '../types'

export type CreateStudentRequest = Omit<Student, 'id'>

export const studentsService = {
  async list(): Promise<Student[]> {
    const res = await api.get<Student[]>('/user/students')
    return res.data
  },

  async add(data: CreateStudentRequest): Promise<Student> {
    const res = await api.post<Student>('/user/students', data)
    return res.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/user/students/${id}`)
  },
}
