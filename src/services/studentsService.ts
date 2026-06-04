import api from '../lib/api'
import type { Student } from '../types'

export type CreateStudentRequest = Omit<Student, 'id'>

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const mockStudents: Student[] = [
  {
    id: 'mock-default-1',
    firstName: 'Emma',
    lastName: 'Tremblay',
    school: 'École Primaire Saint-Jean',
    grade: '3e année',
  },
  {
    id: 'mock-default-2',
    firstName: 'Lucas',
    lastName: 'Tremblay',
    school: 'École des Sommets',
    grade: '5e année',
  },
]
let nextId = 1

function delay(ms = 300) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

export const studentsService = {
  async list(): Promise<Student[]> {
    if (USE_MOCK) {
      await delay()
      return [...mockStudents]
    }
    const res = await api.get<Student[]>('/user/students')
    return res.data
  },

  async add(data: CreateStudentRequest): Promise<Student> {
    if (USE_MOCK) {
      await delay()
      const student: Student = { ...data, id: `mock-${nextId++}` }
      mockStudents.push(student)
      return student
    }
    const res = await api.post<Student>('/user/students', data)
    return res.data
  },

  async remove(id: string): Promise<void> {
    if (USE_MOCK) {
      await delay()
      const idx = mockStudents.findIndex((s) => s.id === id)
      if (idx !== -1) mockStudents.splice(idx, 1)
      return
    }
    await api.delete(`/user/students/${id}`)
  },
}
