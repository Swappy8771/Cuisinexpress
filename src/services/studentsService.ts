import api from '../lib/api'
import type { Student } from '../types'

export type CreateStudentRequest = Omit<Student, 'id'>

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const mockStudents: Student[] = [
  {
    id: 'mock-default-1',
    firstName: 'Emma',
    lastName: 'Tremblay',
    dob: '2017-03-14',
    cssId: 'css-navigateurs',
    cssName: 'CSS des Navigateurs',
    schoolId: 'school-nav-4',
    schoolName: 'École Primaire Saint-Jean',
    schoolCity: 'Lévis',
    gradeId: '3e',
    grade: '3e année',
    classId: 't-nav4-3e-1',
    className: 'Mme Geneviève Paré',
    manualAssignmentRequired: false,
    classAssignmentStatus: 'assigned',
    colorCode: 'blue',
    allergens: ['a-3'],               // Noix — appears in only 4 meals
    allergenNotes: 'Allergie aux noix de toute sorte.',
  },
  {
    id: 'mock-default-2',
    firstName: 'Lucas',
    lastName: 'Tremblay',
    dob: '2015-09-22',
    cssId: 'css-navigateurs',
    cssName: 'CSS des Navigateurs',
    schoolId: 'school-nav-5',
    schoolName: 'École des Sommets',
    schoolCity: 'Charny',
    gradeId: '5e',
    grade: '5e année',
    classId: 't-nav5-5e-1',
    className: 'Mme Andrée Champagne',
    manualAssignmentRequired: false,
    classAssignmentStatus: 'assigned',
    colorCode: 'green',
    allergens: ['a-4', 'a-5'],        // Œufs + Soja — appears in ~15 meals combined
    allergenNotes: 'Intolérance aux œufs et au soja.',
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
      // If manual assignment required, log notification (mock)
      if (student.manualAssignmentRequired) {
        console.info('[CuisineXpress] Manual class assignment required for:', student.firstName, student.lastName)
      }
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
