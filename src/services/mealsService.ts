import api from '../lib/api'
import * as mock from '../lib/mockData'
import type { Meal, MealFilters, OrderingSchool, MealWeek, MenuCategory, Allergy } from '../types'

// Mock is ON by default (no backend yet). Set VITE_USE_MOCK=false to hit the real API.
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

function delay(ms = 400) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

function applyFilters(meals: Meal[], f: Partial<MealFilters>): Meal[] {
  let result = [...meals]
  if (f.schoolId)  result = result.filter((m) => m.schoolIds.includes(f.schoolId!))
  if (f.weekId)    result = result.filter((m) => m.weekIds.includes(f.weekId!))
  if (f.categoryId) result = result.filter((m) => m.categoryId === f.categoryId)
  if (f.tags?.length) result = result.filter((m) => f.tags!.every((t) => m.tags.includes(t)))
  if (f.search) {
    const q = f.search.toLowerCase()
    result = result.filter(
      (m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    )
  }
  switch (f.sort) {
    case 'price_asc':  result.sort((a, b) => a.price - b.price);  break
    case 'price_desc': result.sort((a, b) => b.price - a.price);  break
    case 'popular':    result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0)); break
    case 'name':       result.sort((a, b) => a.name.localeCompare(b.name, 'fr')); break
  }
  return result
}

export const mealsService = {
  async getMeals(filters: Partial<MealFilters> = {}): Promise<Meal[]> {
    if (USE_MOCK) {
      await delay(500)
      return applyFilters(mock.meals, filters)
    }
    const res = await api.get<Meal[]>('/meals', { params: filters })
    return res.data
  },

  async getSchools(): Promise<OrderingSchool[]> {
    if (USE_MOCK) {
      await delay(200)
      return mock.schools
    }
    const res = await api.get<OrderingSchool[]>('/ordering/schools')
    return res.data
  },

  async getWeeks(): Promise<MealWeek[]> {
    if (USE_MOCK) {
      await delay(200)
      return mock.weeks
    }
    const res = await api.get<MealWeek[]>('/ordering/weeks')
    return res.data
  },

  async getCategories(): Promise<MenuCategory[]> {
    if (USE_MOCK) {
      await delay(100)
      return mock.categories
    }
    const res = await api.get<MenuCategory[]>('/ordering/categories')
    return res.data
  },

  async getAllergies(): Promise<Allergy[]> {
    if (USE_MOCK) {
      await delay(100)
      return mock.allergies
    }
    const res = await api.get<Allergy[]>('/ordering/allergies')
    return res.data
  },
}
