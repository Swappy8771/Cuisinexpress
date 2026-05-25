import { X, RotateCcw, Search } from 'lucide-react'
import { useLang } from '../../contexts/LangContext'
import type { MealFilters, MealTag, OrderingSchool, MealWeek, MenuCategory } from '../../types'

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

const TAG_META: Record<MealTag, { emoji: string; active: string; inactive: string }> = {
  vegetarian:   { emoji: '🌿', active: 'bg-green-100   text-green-700   ring-1 ring-green-300',  inactive: 'bg-cx-fill text-cx-soft hover:bg-green-500/10  hover:text-green-700' },
  vegan:        { emoji: '🌱', active: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300', inactive: 'bg-cx-fill text-cx-soft hover:bg-emerald-500/10 hover:text-emerald-700' },
  hot:          { emoji: '🔥', active: 'bg-red-100     text-red-700     ring-1 ring-red-300',     inactive: 'bg-cx-fill text-cx-soft hover:bg-red-500/10    hover:text-red-700' },
  cold:         { emoji: '❄️', active: 'bg-blue-100    text-blue-700    ring-1 ring-blue-300',    inactive: 'bg-cx-fill text-cx-soft hover:bg-blue-500/10   hover:text-blue-700' },
  halal:        { emoji: '☪️', active: 'bg-amber-100   text-amber-700   ring-1 ring-amber-300',   inactive: 'bg-cx-fill text-cx-soft hover:bg-amber-500/10  hover:text-amber-700' },
  'gluten-free':{ emoji: '✅', active: 'bg-violet-100  text-violet-700  ring-1 ring-violet-300',  inactive: 'bg-cx-fill text-cx-soft hover:bg-violet-500/10 hover:text-violet-700' },
}

const ALL_TAGS = Object.keys(TAG_META) as MealTag[]

function fmtWeekRange(startDate: string, endDate: string): string {
  const fmt = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' })
  const s = fmt(startDate)
  const e = fmt(endDate)
  const sMonth = s.split(' ')[1]
  const eMonth = e.split(' ')[1]
  return sMonth === eMonth ? `${s.split(' ')[0]}–${e}` : `${s} – ${e}`
}

const sectionTitle = "text-[11px] font-bold tracking-[0.08em] uppercase text-cx-soft mb-2.5"

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
  const { t } = useLang()

  const tagLabels: Record<MealTag, string> = {
    vegetarian:   t.filter.tags.vegetarian,
    vegan:        t.filter.tags.vegan,
    hot:          t.filter.tags.hot,
    cold:         t.filter.tags.cold,
    halal:        t.filter.tags.halal,
    'gluten-free': t.filter.tags.glutenFree,
  }

  const toggleTag = (tag: MealTag) => {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((tg) => tg !== tag)
      : [...filters.tags, tag]
    onFiltersChange({ tags: next })
  }

  return (
    <div className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_20px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-cx-line">
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

      <div className="px-5 py-4 flex flex-col gap-6">

        {/* Search */}
        <div>
          <p className={sectionTitle}>{t.filter.searchLabel}</p>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cx-soft pointer-events-none" />
            <input
              type="search"
              placeholder={t.filter.searchPlaceholder}
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="w-full pl-8 pr-3 py-2.5 text-[13.5px] bg-cx-fill border border-cx-edge
                rounded-xl outline-none transition-all
                focus:border-[#C41E3A] focus:bg-cx-card focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]
                placeholder:text-cx-faint"
            />
          </div>
        </div>

        {/* School */}
        <div>
          <p className={sectionTitle}>{t.filter.schoolLabel}</p>
          <select
            value={filters.schoolId}
            onChange={(e) => onFiltersChange({ schoolId: e.target.value })}
            className="w-full px-3 py-2.5 text-[13.5px] bg-cx-fill border border-cx-edge
              rounded-xl outline-none transition-all text-cx-sub
              focus:border-[#C41E3A] focus:bg-cx-card focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]
              cursor-pointer"
          >
            {schools.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Week */}
        <div>
          <p className={sectionTitle}>{t.filter.weekLabel}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {weeks.map((w) => {
              const active = filters.weekId === w.id
              return (
                <button
                  type="button"
                  key={w.id}
                  onClick={() => onFiltersChange({ weekId: w.id })}
                  className={`flex flex-col items-center py-2.5 px-2 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-[#7B2535] text-white shadow-[0_2px_8px_rgba(123,37,53,0.3)]'
                      : 'bg-cx-fill text-cx-soft hover:bg-cx-muted'
                  }`}
                >
                  <span className={`text-[11px] font-bold tracking-wide uppercase ${active ? 'text-white/70' : 'text-cx-soft'}`}>
                    {w.label}
                  </span>
                  <span className={`text-[12px] font-semibold mt-0.5 leading-tight text-center ${active ? 'text-white' : 'text-cx-body'}`}>
                    {fmtWeekRange(w.startDate, w.endDate)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Category */}
        <div>
          <p className={sectionTitle}>{t.filter.categoryLabel}</p>
          <div className="flex flex-col gap-1">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => onFiltersChange({ categoryId: cat.id })}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px]
                  font-medium transition-all duration-200 text-left ${
                  filters.categoryId === cat.id
                    ? 'bg-[#C41E3A]/10 text-[#C41E3A] font-semibold'
                    : 'text-cx-soft hover:bg-cx-fill hover:text-cx-base'
                }`}
              >
                <span className="text-[16px] leading-none">{cat.emoji}</span>
                <span>{cat.label}</span>
                {filters.categoryId === cat.id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C41E3A]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <p className={sectionTitle}>{t.filter.tagsLabel}</p>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => {
              const meta = TAG_META[tag]
              const active = filters.tags.includes(tag)
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                    text-[12px] font-semibold transition-all duration-200 ${
                    active ? meta.active : meta.inactive
                  }`}
                >
                  <span>{meta.emoji}</span>
                  <span>{tagLabels[tag]}</span>
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
