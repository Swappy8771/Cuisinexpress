import { X, RotateCcw } from 'lucide-react'
import { useLang } from '../../contexts/LangContext'
import type { MealFilters, MealTag, MenuCategory } from '../../types'

interface Props {
  filters: MealFilters
  categories: MenuCategory[]
  activeCount: number
  onFiltersChange: (patch: Partial<MealFilters>) => void
  onClear: () => void
  onClose?: () => void
}

const ALL_TAGS = ['vegetarian', 'vegan', 'hot', 'cold', 'halal', 'gluten-free'] as MealTag[]

const sectionTitle = 'text-[12px] font-extrabold tracking-[0.1em] uppercase text-cx-soft mb-2.5'
const checkRow = 'flex items-center gap-2.5 py-2 cursor-pointer group select-none'
const checkBox = (active: boolean) =>
  `w-4 h-4 rounded flex-shrink-0 border-2 transition-all duration-150 flex items-center justify-center
  ${active
    ? 'bg-[#C41E3A] border-[#C41E3A]'
    : 'border-cx-edge bg-cx-fill group-hover:border-[#C41E3A]/50'
  }`

export default function FilterSidebar({
  filters,
  categories,
  activeCount,
  onFiltersChange,
  onClear,
  onClose,
}: Props) {
  const { t } = useLang()

  const tagLabels: Record<MealTag, string> = {
    vegetarian:    t.filter.tags.vegetarian,
    vegan:         t.filter.tags.vegan,
    hot:           t.filter.tags.hot,
    cold:          t.filter.tags.cold,
    halal:         t.filter.tags.halal,
    'gluten-free': t.filter.tags.glutenFree,
  }

  const toggleTag = (tag: MealTag) => {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((tg) => tg !== tag)
      : [...filters.tags, tag]
    onFiltersChange({ tags: next })
  }

  const toggleCategory = (id: string) => {
    onFiltersChange({ categoryId: filters.categoryId === id ? '' : id })
  }

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
                  <span className="text-[14px] leading-none flex items-center gap-1.5 text-cx-sub group-hover:text-cx-base transition-colors">
                    <span>{cat.emoji}</span>
                    <span className={active ? 'font-semibold text-cx-base' : ''}>{cat.label}</span>
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
                  <span className={`text-[14px] text-cx-sub group-hover:text-cx-base transition-colors ${active ? 'font-semibold text-cx-base' : ''}`}>
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
