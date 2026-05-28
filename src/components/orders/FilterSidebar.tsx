import { useState } from 'react'
import { X, RotateCcw, ChevronDown, Check } from 'lucide-react'
import { useLang } from '../../contexts/LangContext'
import type { MealFilters, MealTag, OrderingSchool, MealWeek, MenuCategory } from '../../types'
import { DAYS } from '../../lib/menuConfig'

interface Props {
  filters: MealFilters
  schools: OrderingSchool[]
  weeks: MealWeek[]
  categories: MenuCategory[]
  activeCount: number
  onFiltersChange: (patch: Partial<MealFilters>) => void
  onClear: () => void
  onClose?: () => void
}

const ALL_TAGS = ['vegetarian', 'vegan', 'hot', 'cold', 'halal', 'gluten-free'] as MealTag[]

function fmtDateRange(startDate: string, endDate: string, lang: string): string {
  const locale = lang === 'en' ? 'en-CA' : 'fr-CA'
  const fmt = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString(locale, { day: 'numeric', month: 'long' })
  return `${fmt(startDate)} – ${fmt(endDate)}`
}

function weekNum(label: string): string {
  // "Sem. 1" → "1", "Sem. 12" → "12"
  return label.replace(/[^\d]/g, '').trim()
}

const sectionTitle = 'text-[10.5px] font-extrabold tracking-[0.1em] uppercase text-cx-soft mb-2.5'
const checkRow = 'flex items-center gap-2.5 py-1.5 cursor-pointer group select-none'
const checkBox = (active: boolean) =>
  `w-4 h-4 rounded flex-shrink-0 border-2 transition-all duration-150 flex items-center justify-center
  ${active
    ? 'bg-[#C41E3A] border-[#C41E3A]'
    : 'border-cx-edge bg-cx-fill group-hover:border-[#C41E3A]/50'
  }`

export default function FilterSidebar({
  filters,
  schools,
  weeks,
  categories,
  activeCount,
  onFiltersChange,
  onClear,
  onClose,
}: Props) {
  const { t, lang } = useLang()

  const tagLabels: Record<MealTag, string> = {
    vegetarian:    t.filter.tags.vegetarian,
    vegan:         t.filter.tags.vegan,
    hot:           t.filter.tags.hot,
    cold:          t.filter.tags.cold,
    halal:         t.filter.tags.halal,
    'gluten-free': t.filter.tags.glutenFree,
  }

  const [weekOpen, setWeekOpen] = useState(false)

  const toggleTag = (tag: MealTag) => {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((tg) => tg !== tag)
      : [...filters.tags, tag]
    onFiltersChange({ tags: next })
  }

  const toggleDay = (day: string) => {
    const next = filters.days.includes(day)
      ? filters.days.filter((d) => d !== day)
      : [...filters.days, day]
    onFiltersChange({ days: next })
  }

  const toggleCategory = (id: string) => {
    onFiltersChange({ categoryId: filters.categoryId === id ? '' : id })
  }

  const selectedWeek = weeks.find((w) => w.id === filters.weekId)

  return (
    <div className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_20px_rgba(0,0,0,0.06)] overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cx-line">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-cx-base">{t.filter.title}</span>
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full
              bg-[#C41E3A] text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 text-[12px] text-cx-soft hover:text-[#C41E3A]
                transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
            >
              <RotateCcw size={11} />
              <span>{t.filter.clear}</span>
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-cx-soft hover:text-cx-base
                hover:bg-cx-muted transition-colors lg:hidden"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-3 flex flex-col gap-4">

        {/* École */}
        <div>
          <p className={sectionTitle}>{t.filter.schoolLabel}</p>
          <div className="relative">
            <select
              value={filters.schoolId}
              onChange={(e) => onFiltersChange({ schoolId: e.target.value })}
              className="w-full appearance-none px-3 pr-8 py-2.5 text-[13px] font-medium
                bg-cx-fill border border-cx-edge rounded-xl outline-none transition-all text-cx-base
                focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)] cursor-pointer"
            >
              {schools.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-cx-soft pointer-events-none" />
          </div>
        </div>

        {/* Semaine — custom dropdown */}
        <div>
          <p className={sectionTitle}>{t.filter.weekLabel}</p>
          <div className="relative">
            {/* Trigger */}
            <button
              type="button"
              onClick={() => setWeekOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5
                bg-cx-fill border border-cx-edge rounded-xl text-[13px] font-medium
                text-cx-base hover:border-[#C41E3A]/50 transition-all duration-200
                focus:outline-none focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]"
            >
              <span className="truncate">
                {selectedWeek
                  ? `${t.filter.weekPrefix} ${weekNum(selectedWeek.label)} · ${fmtDateRange(selectedWeek.startDate, selectedWeek.endDate, lang)}`
                  : (lang === 'en' ? 'All weeks' : 'Toutes les semaines')}
              </span>
              <ChevronDown
                size={14}
                className={`flex-shrink-0 text-cx-soft transition-transform duration-200 ${weekOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Options list */}
            {weekOpen && (
              <>
                {/* Backdrop to close */}
                <div className="fixed inset-0 z-10" onClick={() => setWeekOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-1.5 z-20
                  bg-cx-card border border-cx-line rounded-xl
                  shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden">
                  {/* All weeks option */}
                  <button
                    type="button"
                    onClick={() => { onFiltersChange({ weekId: '' }); setWeekOpen(false) }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3
                      text-left text-[13px] transition-colors duration-150
                      ${filters.weekId === ''
                        ? 'bg-[#C41E3A]/8 text-[#C41E3A] font-semibold'
                        : 'text-cx-sub hover:bg-cx-fill hover:text-cx-base'
                      }`}
                  >
                    <span className="font-bold text-[12.5px]">
                      {lang === 'en' ? 'All weeks' : 'Toutes les semaines'}
                    </span>
                    {filters.weekId === '' && <Check size={14} className="flex-shrink-0 text-[#C41E3A]" />}
                  </button>
                  {weeks.map((w) => {
                    const active = filters.weekId === w.id
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => { onFiltersChange({ weekId: w.id }); setWeekOpen(false) }}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3
                          text-left text-[13px] transition-colors duration-150
                          ${active
                            ? 'bg-[#C41E3A]/8 text-[#C41E3A] font-semibold'
                            : 'text-cx-sub hover:bg-cx-fill hover:text-cx-base'
                          }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-[12.5px]">
                            {t.filter.weekPrefix} {weekNum(w.label)}
                          </span>
                          <span className={`text-[11px] ${active ? 'text-[#C41E3A]/70' : 'text-cx-faint'}`}>
                            {fmtDateRange(w.startDate, w.endDate, lang)}
                          </span>
                        </div>
                        {active && <Check size={14} className="flex-shrink-0 text-[#C41E3A]" />}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Menu — checkboxes */}
        <div>
          <p className={sectionTitle}>{t.filter.categoryLabel}</p>
          <div className="flex flex-col gap-0.5">
            {categories.filter((c) => c.id !== '').map((cat) => {
              const active = filters.categoryId === cat.id
              return (
                <label key={cat.id} className={checkRow} onClick={() => toggleCategory(cat.id)}>
                  <span className={checkBox(active)}>
                    {active && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <span className="text-[13px] leading-none flex items-center gap-1.5 text-cx-sub group-hover:text-cx-base transition-colors">
                    <span>{cat.emoji}</span>
                    <span className={active ? 'font-semibold text-cx-base' : ''}>{cat.label}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Jour — checkboxes */}
        <div>
          <p className={sectionTitle}>{t.filter.daysLabel}</p>
          <div className="flex flex-col gap-0.5">
            {DAYS.map((day) => {
              const active = filters.days.includes(day)
              return (
                <label key={day} className={checkRow} onClick={() => toggleDay(day)}>
                  <span className={checkBox(active)}>
                    {active && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <span className={`text-[13px] text-cx-sub group-hover:text-cx-base transition-colors ${active ? 'font-semibold text-cx-base' : ''}`}>
                    {t.menu.dayLabels[day]}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Régimes & Température */}
        <div>
          <p className={sectionTitle}>{t.filter.tagsLabel}</p>
          <div className="flex flex-col gap-0.5">
            {ALL_TAGS.map((tag) => {
              const active = filters.tags.includes(tag)
              return (
                <label key={tag} className={checkRow} onClick={() => toggleTag(tag)}>
                  <span className={checkBox(active)}>
                    {active && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <span className={`text-[13px] text-cx-sub group-hover:text-cx-base transition-colors ${active ? 'font-semibold text-cx-base' : ''}`}>
                    {tagLabels[tag]}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
