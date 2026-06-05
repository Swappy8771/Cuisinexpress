import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  SlidersHorizontal, Search, ChevronDown, ShoppingCart,
  X, School, Calendar,
} from 'lucide-react'
import { mealsService } from '../../services/mealsService'
import { studentsService } from '../../services/studentsService'
import { useCartStore, selectCartTotal, selectCartCount } from '../../store/cartStore'
import FilterSidebar from '../../components/orders/FilterSidebar'
import DayOrderModal from '../../components/orders/DayOrderModal'
import MenuCalendar from '../../components/orders/MenuCalendar'
import { useLang } from '../../contexts/LangContext'
import type { DayName } from '../../lib/menuConfig'
import type { MealFilters, SortOption } from '../../types'

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
  const [dayModal, setDayModal] = useState<{ day: DayName; weekId: string } | null>(null)

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

  // Set defaults once reference data loads; guards prevent re-running after user changes selection
  useEffect(() => {
    if (schools.length && !filters.schoolId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilters((f) => ({ ...f, schoolId: schools[0].id }))
    }
  }, [schools]) // eslint-disable-line react-hooks/exhaustive-deps

  // weekId stays '' by default → "All weeks" view

  // All meals across all weeks (for calendar — shows every week row)
  const { data: allMeals = [] } = useQuery({
    queryKey: ['meals-calendar', filters.schoolId],
    queryFn: () => mealsService.getMeals({ schoolId: filters.schoolId, sort: 'popular' }),
    enabled: !!filters.schoolId,
  })

  // Meals for the modal — no school filter so each child sees their own school's meals
  const { data: modalMeals = [] } = useQuery({
    queryKey: ['meals-modal', dayModal?.weekId],
    queryFn: () => mealsService.getMeals({ weekId: dayModal!.weekId }),
    enabled: !!dayModal,
  })

  // Registered students — used to drive the per-child wizard
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: studentsService.list,
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
        <div className="max-w-[1380px] mx-auto px-3 sm:px-4 lg:px-6">
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
                className="w-full pl-8 pr-4 py-2 text-[15px] bg-cx-fill border border-cx-edge
                  rounded-xl outline-none transition-all
                  focus:border-[#C41E3A] focus:bg-cx-card focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]
                  placeholder:text-cx-soft"
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
      <div className="max-w-[1380px] mx-auto px-3 sm:px-4 lg:px-6 py-4">

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

        <div className="flex gap-4">

          {/* ── Desktop sidebar ─────────────────────────────────────── */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-[132px]">
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

            {/* ── Meal Calendar ──────────────────────────────────────── */}
            {weeks.length > 0 && (
              <div className="mb-3">
                {/* Section header */}
                <div className="mb-3">
                  <span className="inline-block px-2.5 py-1 bg-[#C41E3A]/10 text-[#C41E3A]
                    text-[10px] font-extrabold uppercase tracking-[0.12em] rounded-full mb-2">
                    {t.dayOrder.tabsTitle}
                  </span>
                  <h2 className="text-[22px] font-extrabold text-cx-base leading-none">
                    {lang === 'en' ? 'Calendar' : 'Calendrier'}
                  </h2>
                  <p className="text-[13px] text-cx-soft mt-1">
                    {lang === 'en'
                      ? 'Click a day to order your meal'
                      : 'Cliquez sur un jour pour commander votre repas'}
                  </p>
                </div>

                <MenuCalendar
                  allMeals={allMeals}
                  weeks={filters.weekId ? [selectedWeek!] : weeks}
                  onDayClick={(day, weekId) => setDayModal({ day, weekId })}
                />
              </div>
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

      {/* ── Day order modal — calendar click ── */}
      <AnimatePresence>
        {dayModal !== null && (
          <DayOrderModal
            day={dayModal.day}
            weekId={dayModal.weekId}
            meals={modalMeals}
            categories={categories}
            students={students}
            schools={schools}
            onClose={() => setDayModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

