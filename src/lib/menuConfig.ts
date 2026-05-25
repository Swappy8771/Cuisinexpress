import { Flame, Leaf, Snowflake, Star, Zap } from 'lucide-react'
import type { MealTag } from '../types'

// ── Currency formatter (fr-CA / CAD) ─────────────────────────────
export const fmt = (n: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(n)

// ── Meal tag display config ───────────────────────────────────────
export const TAG_CONFIG: Record<
  MealTag,
  { icon: React.ElementType; color: string; cardColor: string }
> = {
  hot:           { icon: Flame,     color: 'text-red-500',     cardColor: 'bg-red-100   text-red-700'           },
  cold:          { icon: Snowflake, color: 'text-blue-500',    cardColor: 'bg-blue-100  text-blue-700'          },
  vegetarian:    { icon: Leaf,      color: 'text-green-500',   cardColor: 'bg-green-100 text-green-700'         },
  vegan:         { icon: Leaf,      color: 'text-emerald-500', cardColor: 'bg-emerald-100 text-emerald-700'     },
  halal:         { icon: Star,      color: 'text-amber-500',   cardColor: 'bg-amber-100 text-amber-700'         },
  'gluten-free': { icon: Zap,       color: 'text-violet-500',  cardColor: 'bg-violet-100 text-violet-700'       },
}

// ── Week days (Mon–Fri, French) ───────────────────────────────────
export const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'] as const
export type DayName = (typeof DAYS)[number]

// ── "Semaine du X au Y mois" / "Week of Month X–Y" label ─────────
export function fmtWeekRange(startDate: string, endDate: string, lang = 'fr'): string {
  const locale = lang === 'en' ? 'en-CA' : 'fr-CA'
  const s = new Date(startDate + 'T12:00:00')
  const e = new Date(endDate + 'T12:00:00')
  if (lang === 'en') {
    const month = e.toLocaleDateString(locale, { month: 'long' })
    return `Week of ${month} ${s.getDate()}–${e.getDate()}`
  }
  const month = e.toLocaleDateString(locale, { month: 'long' })
  return `Semaine du ${s.getDate()} au ${e.getDate()} ${month}`
}

// ── Delivery date label ───────────────────────────────────────────
export function fmtDeliveryDate(weekStartDate: string, day: DayName, translatedDay: string, lang = 'fr'): string {
  const locale = lang === 'en' ? 'en-CA' : 'fr-CA'
  const dayIndex = DAYS.indexOf(day)
  const base = new Date(weekStartDate + 'T12:00:00')
  base.setDate(base.getDate() + dayIndex)
  const num   = base.getDate()
  const month = base.toLocaleDateString(locale, { month: 'long' })
  return lang === 'en'
    ? `${translatedDay}, ${month} ${num}`
    : `${translatedDay.toLowerCase()} le ${num} ${month}`
}
