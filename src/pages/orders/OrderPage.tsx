import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  SlidersHorizontal, Search, ChevronDown, ShoppingCart,
  AlertCircle, Inbox, X, School, Calendar,
} from 'lucide-react'
import { mealsService } from '../../services/mealsService'
import { useCartStore, selectCartTotal, selectCartCount } from '../../store/cartStore'
import FilterSidebar from '../../components/orders/FilterSidebar'
import MealCard from '../../components/orders/MealCard'
import MealCardSkeleton from '../../components/orders/MealCardSkeleton'
import DayOrderModal from '../../components/orders/DayOrderModal'
import { useLang } from '../../contexts/LangContext'
import { DAYS } from '../../lib/menuConfig'
import type { DayName } from '../../lib/menuConfig'
import type { Meal, MealFilters, SortOption } from '../../types'

const DEFAULT_FILTERS: MealFilters = {
  schoolId: '',
  weekId: '',
  categoryId: '',
  tags: [],
  days: [],
  search: '',
  sort: 'popular',
}

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(n)

export default function OrderPage() {
  const { t, lang } = useLang()
  const [filters, setFilters] = useState<MealFilters>(DEFAULT_FILTERS)

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'popular',    label: t.order.sortOptions.popular },
    { value: 'name',       label: t.order.sortOptions.name },
    { value: 'price_asc',  label: t.order.sortOptions.price_asc },
    { value: 'price_desc', label: t.order.sortOptions.price_desc },
  ]
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [cardMeal, setCardMeal] = useState<Meal | null>(null)
  const [dayModal, setDayModal] = useState<DayName | null>(null)

  const cartCount = useCartStore(selectCartCount)
  const cartTotal = useCartStore(selectCartTotal)

  // Load reference data
  const { data: schools = [] } = useQuery({
    queryKey: ['ordering-schools'],
    queryFn: mealsService.getSchools,
  })
  const { data: weeks = [] } = useQuery({
    queryKey: ['ordering-weeks'],
    queryFn: mealsService.getWeeks,
  })
  const { data: categories = [] } = useQuery({
    queryKey: ['ordering-categories'],
    queryFn: mealsService.getCategories,
  })
  const { data: allergies = [] } = useQuery({
    queryKey: ['ordering-allergies'],
    queryFn: mealsService.getAllergies,
  })

  // Set defaults once reference data loads; guards prevent re-running after user changes selection
  useEffect(() => {
    if (schools.length && !filters.schoolId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilters((f) => ({ ...f, schoolId: schools[0].id }))
    }
  }, [schools]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (weeks.length && !filters.weekId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilters((f) => ({ ...f, weekId: weeks[0].id }))
    }
  }, [weeks]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch meals (server-side when real API; client-side filter for mock)
  const { data: meals = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['meals', filters],
    queryFn: () => mealsService.getMeals(filters),
    enabled: !!filters.schoolId && !!filters.weekId,
  })

  const patchFilters = (patch: Partial<MealFilters>) =>
    setFilters((f) => ({ ...f, ...patch }))

  const clearFilters = () =>
    setFilters((f) => ({
      ...DEFAULT_FILTERS,
      schoolId: f.schoolId,
      weekId: f.weekId,
    }))

  const activeFilterCount = useMemo(() =>
    [
      filters.categoryId !== '',
      filters.tags.length > 0,
      filters.days.length > 0,
      filters.search !== '',
    ].filter(Boolean).length,
    [filters]
  )

  const selectedSchool = schools.find((s) => s.id === filters.schoolId)
  const selectedWeek = weeks.find((w) => w.id === filters.weekId)
  const fmtWeekRange = (w: typeof selectedWeek) =>
    w ? new Date(w.startDate + 'T12:00:00').toLocaleDateString('fr-CA', { day: 'numeric', month: 'long' })
      + ' – ' + new Date(w.endDate + 'T12:00:00').toLocaleDateString('fr-CA', { day: 'numeric', month: 'long' })
      : ''
  const selectedSort = SORT_OPTIONS.find((o) => o.value === filters.sort)

  return (
    <div className="min-h-screen bg-cx-page transition-colors duration-300">

      {/* ── Sticky top toolbar ────────────────────────────────────────── */}
      <div className="sticky top-[80px] z-30 bg-cx-card border-b border-cx-line
        shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-14">

            {/* Left: title + meta */}
            <div className="hidden lg:flex flex-col justify-center min-w-0 mr-2">
              <span className="text-[14px] font-extrabold text-cx-base leading-none">
                {t.order.title}
              </span>
              {selectedSchool && selectedWeek && (
                <span className="text-[11.5px] text-cx-soft mt-0.5 truncate">
                  {selectedSchool.name} · {fmtWeekRange(selectedWeek)}
                </span>
              )}
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cx-soft pointer-events-none" />
              <input
                type="search"
                placeholder={t.order.searchPlaceholder}
                value={filters.search}
                onChange={(e) => patchFilters({ search: e.target.value })}
                className="w-full pl-8 pr-4 py-2 text-[13.5px] bg-cx-fill border border-cx-edge
                  rounded-xl outline-none transition-all
                  focus:border-[#C41E3A] focus:bg-cx-card focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]
                  placeholder:text-cx-faint"
              />
              {filters.search && (
                <button
                  onClick={() => patchFilters({ search: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cx-soft
                    hover:text-[#C41E3A] transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Result count */}
            {!isLoading && (
              <span className="hidden sm:block text-[12.5px] text-cx-soft whitespace-nowrap">
                {meals.length} {meals.length !== 1 ? t.order.results_plural : t.order.results}
              </span>
            )}

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-cx-fill border border-cx-edge
                  rounded-xl text-[13px] font-medium text-cx-sub hover:border-cx-muted
                  transition-colors whitespace-nowrap"
              >
                <span className="hidden sm:inline">{selectedSort?.label}</span>
                <span className="sm:hidden">{t.order.sort}</span>
                <ChevronDown
                  size={13}
                  className={`text-cx-soft transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1.5 w-44 bg-cx-card rounded-xl
                      border border-cx-line shadow-[0_8px_24px_rgba(0,0,0,0.1)] overflow-hidden z-50"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { patchFilters({ sort: opt.value }); setSortOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${
                          filters.sort === opt.value
                            ? 'bg-[#C41E3A]/10 text-[#C41E3A] font-semibold'
                            : 'text-cx-sub hover:bg-cx-fill'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile: filter button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden relative flex items-center gap-2 px-3 py-2 bg-cx-fill
                border border-cx-edge rounded-xl text-[13px] font-medium text-cx-sub
                hover:border-[#C41E3A] hover:text-[#C41E3A] transition-colors"
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">{t.order.filters}</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 flex items-center
                  justify-center bg-[#C41E3A] text-white text-[9px] font-bold rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main layout ───────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Context bar (mobile) */}
        {selectedSchool && selectedWeek && (
          <div className="lg:hidden flex items-center gap-4 mb-4 text-[13px] text-cx-soft">
            <span className="flex items-center gap-1.5">
              <School size={13} className="text-[#C41E3A]" />
              {selectedSchool.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[#C41E3A]" />
              {fmtWeekRange(selectedWeek)}
            </span>
          </div>
        )}

        <div className="flex gap-6">

          {/* ── Desktop sidebar ─────────────────────────────────────── */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-[148px]">
              <FilterSidebar
                filters={filters}
                schools={schools}
                weeks={weeks}
                categories={categories}
                activeCount={activeFilterCount}
                onFiltersChange={patchFilters}
                onClear={clearFilters}
              />
            </div>
          </aside>

          {/* ── Product grid ────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">

            {/* Weekly calendar */}
            {selectedWeek && (
              <div className="mb-5">
                {/* Calendar header */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-extrabold text-cx-soft uppercase tracking-widest">
                    {t.dayOrder.tabsTitle}
                  </p>
                  <p className="text-[11.5px] font-semibold text-cx-soft">
                    {new Date(selectedWeek.startDate + 'T12:00:00').toLocaleDateString(
                      lang === 'en' ? 'en-CA' : 'fr-CA',
                      { day: 'numeric', month: 'long', year: 'numeric' }
                    )}
                    {' – '}
                    {new Date(selectedWeek.endDate + 'T12:00:00').toLocaleDateString(
                      lang === 'en' ? 'en-CA' : 'fr-CA',
                      { day: 'numeric', month: 'long' }
                    )}
                  </p>
                </div>

                {/* Day cells grid */}
                <div className="grid grid-cols-5 gap-2">
                  {DAYS.map((day, di) => {
                    const cellDate = new Date(selectedWeek.startDate + 'T12:00:00')
                    cellDate.setDate(cellDate.getDate() + di)
                    const dateNum = cellDate.getDate()
                    const monthShort = cellDate.toLocaleDateString(
                      lang === 'en' ? 'en-CA' : 'fr-CA',
                      { month: 'short' }
                    )
                    const count = meals.filter(
                      (m) => m.categoryId === 'cat-1' && m.available && m.availableDays?.includes(day)
                    ).length
                    const hasItems = count > 0

                    return (
                      <motion.button
                        key={day}
                        whileHover={hasItems ? { y: -3 } : {}}
                        transition={{ duration: 0.15 }}
                        onClick={() => hasItems && setDayModal(day)}
                        disabled={!hasItems}
                        className={`flex flex-col items-center gap-1 py-3 rounded-2xl border-2
                          transition-all duration-200
                          ${hasItems
                            ? 'bg-cx-card border-cx-edge hover:border-[#C41E3A] hover:shadow-[0_4px_16px_rgba(196,30,58,0.12)] cursor-pointer'
                            : 'bg-cx-fill border-cx-edge opacity-40 cursor-not-allowed'
                          }`}
                      >
                        {/* Day abbreviation */}
                        <span className={`text-[10.5px] font-bold uppercase tracking-wider
                          ${hasItems ? 'text-cx-soft' : 'text-cx-faint'}`}>
                          {t.menu.dayLabels[day].slice(0, 3)}
                        </span>

                        {/* Date number */}
                        <span className={`text-[22px] font-extrabold leading-none
                          ${hasItems ? 'text-cx-base' : 'text-cx-faint'}`}>
                          {dateNum}
                        </span>

                        {/* Month */}
                        <span className={`text-[10px] font-medium capitalize
                          ${hasItems ? 'text-cx-soft' : 'text-cx-faint'}`}>
                          {monthShort}
                        </span>

                        {/* Meal count badge */}
                        {hasItems && (
                          <span className="mt-0.5 inline-flex items-center justify-center
                            min-w-[20px] h-5 px-1.5 rounded-full bg-[#C41E3A]
                            text-white text-[10px] font-bold">
                            {count}
                          </span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Active filters chips */}
            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 mb-4"
                >
                  {filters.categoryId && categories.find((c) => c.id === filters.categoryId) && (
                    <ActiveChip
                      label={categories.find((c) => c.id === filters.categoryId)!.label}
                      onRemove={() => patchFilters({ categoryId: '' })}
                    />
                  )}
                  {filters.tags.map((tag) => (
                    <ActiveChip
                      key={tag}
                      label={tag}
                      onRemove={() => patchFilters({ tags: filters.tags.filter((t) => t !== tag) })}
                    />
                  ))}
                  {filters.search && (
                    <ActiveChip
                      label={`"${filters.search}"`}
                      onRemove={() => patchFilters({ search: '' })}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <MealCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error */}
            {isError && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
                  <AlertCircle size={28} className="text-red-400" />
                </div>
                <p className="text-cx-base font-semibold text-[16px] mb-1">
                  {t.order.errorTitle}
                </p>
                <p className="text-cx-soft text-[13.5px] mb-5">
                  {t.order.errorHint}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="px-5 py-2.5 bg-[#7B2535] text-white text-[13.5px] font-semibold
                    rounded-xl hover:bg-[#9B3045] transition-colors"
                >
                  {t.order.retry}
                </button>
              </motion.div>
            )}

            {/* Empty */}
            {!isLoading && !isError && meals.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-cx-fill flex items-center justify-center mb-4">
                  <Inbox size={28} className="text-cx-faint" />
                </div>
                <p className="text-cx-base font-semibold text-[16px] mb-1">
                  {t.order.noResults}
                </p>
                <p className="text-cx-soft text-[13.5px] mb-5">
                  {t.order.noResultsHint}
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-5 py-2.5 bg-cx-muted text-cx-sub text-[13.5px] font-semibold
                    rounded-xl hover:bg-cx-fill transition-colors"
                >
                  {t.order.clearFilters}
                </button>
              </motion.div>
            )}

            {/* Meal grid */}
            {!isLoading && !isError && meals.length > 0 && (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                <AnimatePresence>
                  {meals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      allergies={allergies}
                      categories={categories}
                      onOpen={() => setCardMeal(meal)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile: filter drawer ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[90vw] z-50 overflow-y-auto
                bg-cx-page lg:hidden"
            >
              <div className="p-4">
                <FilterSidebar
                  filters={filters}
                  schools={schools}
                  weeks={weeks}
                  categories={categories}
                  activeCount={activeFilterCount}
                  onFiltersChange={patchFilters}
                  onClear={clearFilters}
                  onClose={() => setMobileFiltersOpen(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile: floating cart bar ─────────────────────────────────── */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="fixed bottom-6 inset-x-4 z-50 lg:hidden"
          >
            <div className="flex items-center justify-between gap-4 bg-[#0A0A0A] text-white
              px-5 py-3.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart size={20} />
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center
                    justify-center bg-[#C41E3A] text-white text-[9px] font-bold rounded-full">
                    {cartCount}
                  </span>
                </div>
                <span className="text-[13px] font-semibold">
                  {cartCount} {cartCount > 1 ? t.order.cartLabel_plural : t.order.cartLabel}
                </span>
              </div>
              <span className="text-[16px] font-extrabold text-[#F59E0B]">
                {fmt(cartTotal)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close sort dropdown on outside click */}
      {sortOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />
      )}

      {/* ── Day order modal — card click (pre-selected meal, skip step 1) ── */}
      <AnimatePresence>
        {cardMeal && (
          <DayOrderModal
            day={(cardMeal.availableDays?.[0] as DayName) ?? 'Lundi'}
            defaultWeekId={filters.weekId}
            meals={meals}
            categories={categories}
            preSelectedMeal={cardMeal}
            onClose={() => setCardMeal(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Day order modal — day tab click ── */}
      <AnimatePresence>
        {dayModal !== null && (
          <DayOrderModal
            day={dayModal}
            defaultWeekId={filters.weekId}
            meals={meals}
            categories={categories}
            onClose={() => setDayModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-[#C41E3A]/10
        text-[#C41E3A] text-[12px] font-semibold rounded-full border border-[#C41E3A]/20"
    >
      {label}
      <button
        onClick={onRemove}
        className="w-4 h-4 flex items-center justify-center rounded-full
          bg-[#C41E3A]/15 hover:bg-[#C41E3A]/30 transition-colors"
      >
        <X size={9} />
      </button>
    </motion.span>
  )
}
