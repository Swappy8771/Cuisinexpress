// ─── Auth & User ──────────────────────────────────────────────────────────────

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  notifications: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface Student {
  id: string
  firstName: string
  lastName: string
  school: string
  grade: string
}

export interface Transaction {
  id: string
  date: string
  label: string
  type: 'credit' | 'debit'
  amount: number
}

export interface AccountStatement {
  balance: number
  totalCredits: number
  totalDebits: number
  transactions: Transaction[]
}

export type InvoiceStatus = 'paid' | 'pending' | 'cancelled'

export interface Invoice {
  id: string
  date: string
  period: string
  amount: number
  status: InvoiceStatus
}

// ─── Ordering / Meal Catalog ──────────────────────────────────────────────────

export interface OrderingSchool {
  id: string
  name: string
  city: string
}

export interface MealWeek {
  id: string
  label: string
  startDate: string
  endDate: string
}

export interface MenuCategory {
  id: string
  label: string
  emoji: string
}

export interface Allergy {
  id: string
  label: string
  emoji: string
  colorClass: string
}

export type MealTag = 'vegetarian' | 'vegan' | 'hot' | 'cold' | 'halal' | 'gluten-free'

export interface Meal {
  id: string
  name: string
  description: string
  price: number
  image: string
  categoryId: string
  schoolIds: string[]
  weekIds: string[]
  tags: MealTag[]
  allergyIds: string[]
  available: boolean
  popular: boolean
  isNew: boolean
  calories?: number
  availableDays?: string[]   // DayName[] — which weekdays this meal is served
}

export type SortOption = 'popular' | 'price_asc' | 'price_desc' | 'name'

export interface MealFilters {
  schoolId: string
  weekId: string
  categoryId: string
  tags: MealTag[]
  search: string
  sort: SortOption
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface DeliveryInfo {
  weekId: string
  weekLabel: string
  weekStartDate: string
  day: string          // DayName value, e.g. 'Lundi'
  isoDate: string      // YYYY-MM-DD for sorting
  formattedDate: string // display label, e.g. "lundi le 26 mai"
}

export interface CartItem {
  key: string          // meal.id  OR  `${meal.id}__${weekId}__${day}`
  meal: Meal
  quantity: number
  delivery?: DeliveryInfo
}
