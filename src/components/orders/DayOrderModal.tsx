import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Check, ChevronLeft, ChevronRight,
  Calendar, User, Users, Minus, Plus, Zap,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { Meal, MenuCategory, MealTag, DeliveryInfo, Student, OrderingSchool } from '../../types'
import { fmt, TAG_CONFIG, DAYS, fmtDeliveryDate } from '../../lib/menuConfig'
import type { DayName } from '../../lib/menuConfig'
import { weeks as allWeeks, allergies as ALLERGIES } from '../../lib/mockData'
import { getColorById } from '../../lib/mockSchoolData'
import { useCartStore } from '../../store/cartStore'
import { useLang } from '../../contexts/LangContext'

// ─── Types ──────────────────────────────────────────────────────────────────

interface ChildOrder {
  mainMeal: Meal | null
  addonQtys: Map<string, number>
}

type Phase = 'meal' | 'addons' | 'review'

interface Props {
  day: DayName
  weekId: string
  meals: Meal[]
  categories: MenuCategory[]
  students: Student[]
  schools: OrderingSchool[]
  onClose: () => void
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function DayOrderModal({
  day, weekId, meals, categories, students, schools, onClose,
}: Props) {
  const { t, lang } = useLang()
  const { addItem } = useCartStore()
  const navigate = useNavigate()

  const selectedWeek = allWeeks.find((w) => w.id === weekId)

  const [childOrders, setChildOrders] = useState<ChildOrder[]>(() =>
    students.map(() => ({ mainMeal: null, addonQtys: new Map() }))
  )
  const [phase, setPhase] = useState<Phase>('meal')
  const [addonTab, setAddonTab] = useState(0)

  // Scroll lock + ESC
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const tagLabels: Record<MealTag, string> = {
    hot: t.menu.tagLabels.hot, cold: t.menu.tagLabels.cold,
    vegetarian: t.menu.tagLabels.vegetarian, vegan: t.menu.tagLabels.vegan,
    halal: t.menu.tagLabels.halal, 'gluten-free': t.menu.tagLabels['gluten-free'],
  }

  const delivery = useMemo((): DeliveryInfo => {
    const dayIndex = DAYS.indexOf(day)
    const isoDate = (() => {
      if (!selectedWeek) return ''
      const d = new Date(selectedWeek.startDate + 'T12:00:00')
      d.setDate(d.getDate() + dayIndex)
      return d.toISOString().slice(0, 10)
    })()
    return {
      weekId, weekLabel: selectedWeek?.label ?? '',
      weekStartDate: selectedWeek?.startDate ?? '',
      day, isoDate,
      formattedDate: selectedWeek
        ? fmtDeliveryDate(selectedWeek.startDate, day, t.menu.dayLabels[day], lang)
        : t.menu.dayLabels[day],
    }
  }, [weekId, day, selectedWeek, t, lang])

  const addonGroups = useMemo(() =>
    categories
      .filter((c) => c.id !== '' && c.id !== 'cat-1')
      .map((c) => ({ ...c, items: meals.filter((m) => m.categoryId === c.id && m.available) }))
      .filter((g) => g.items.length > 0),
    [categories, meals]
  )

  const getMealsForStudent = (student: Student) => {
    const schoolId = schools.find((s) => s.name === student.schoolName)?.id ?? ''
    return meals.filter(
      (m) =>
        m.categoryId === 'cat-1' && m.available &&
        m.availableDays?.includes(day) &&
        (!schoolId || m.schoolIds.includes(schoolId))
    )
  }

  const patchOrder = (idx: number, patch: Partial<ChildOrder>) =>
    setChildOrders((prev) => {
      const next = [...prev]; next[idx] = { ...next[idx], ...patch }; return next
    })

  const toggleAddon = (ci: number, mealId: string) => {
    const m = new Map(childOrders[ci].addonQtys)
    m.has(mealId) ? m.delete(mealId) : m.set(mealId, 1)
    patchOrder(ci, { addonQtys: m })
  }

  const changeAddonQty = (ci: number, mealId: string, delta: number) => {
    const m = new Map(childOrders[ci].addonQtys)
    const v = (m.get(mealId) ?? 0) + delta
    v <= 0 ? m.delete(mealId) : m.set(mealId, v)
    patchOrder(ci, { addonQtys: m })
  }

  const removeAddon = (ci: number, mealId: string) => {
    const m = new Map(childOrders[ci].addonQtys); m.delete(mealId)
    patchOrder(ci, { addonQtys: m })
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  const advance = () => {
    if (phase === 'meal') {
      if (addonGroups.length > 0) { setAddonTab(0); setPhase('addons') }
      else setPhase('review')
    } else if (phase === 'addons') {
      if (addonTab < addonGroups.length - 1) setAddonTab((i) => i + 1)
      else setPhase('review')
    }
  }

  const retreat = () => {
    if (phase === 'meal') onClose()
    else if (phase === 'addons') {
      if (addonTab > 0) setAddonTab((i) => i - 1)
      else setPhase('meal')
    }
    else setPhase('meal')
  }

  // ── Totals ────────────────────────────────────────────────────────────────
  const childSubtotal = (order: ChildOrder) => {
    if (!order.mainMeal) return 0
    const addons = Array.from(order.addonQtys.entries()).reduce(
      (s, [id, q]) => s + (meals.find((x) => x.id === id)?.price ?? 0) * q, 0
    )
    return order.mainMeal.price + addons
  }
  const grandTotal = childOrders.reduce((s, o) => s + childSubtotal(o), 0)

  const confirm = () => {
    students.forEach((student, i) => {
      const order = childOrders[i]
      if (!order.mainMeal) return
      const si = { id: student.id, firstName: student.firstName, lastName: student.lastName, schoolName: student.schoolName, grade: student.grade }
      addItem(order.mainMeal, delivery, si, false)
      order.addonQtys.forEach((qty, id) => {
        const m = meals.find((x) => x.id === id)
        if (m) for (let q = 0; q < qty; q++) addItem(m, delivery, si, true)
      })
    })
    onClose()
    navigate('/panier')
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const phaseIdx = phase === 'meal' ? 0 : phase === 'addons' ? 1 : 2
  const anyMealSelected = childOrders.some((o) => !!o.mainMeal)

  // Total addon selections in a group across all children (for tab badge)
  const groupTotalSelections = (groupIdx: number) => {
    const group = addonGroups[groupIdx]
    if (!group) return 0
    return childOrders.reduce(
      (total, o) => total + group.items.filter((m) => o.addonQtys.has(m.id)).length, 0
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-4 top-[3%] bottom-[3%]
          sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2
          sm:w-full sm:max-w-2xl z-50
          bg-cx-card rounded-3xl overflow-hidden flex flex-col
          ring-1 ring-[#C41E3A]/25
          shadow-[0_0_0_1px_rgba(196,30,58,0.15),0_24px_80px_rgba(0,0,0,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <div className="absolute top-4 right-5 z-10">
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-cx-fill border-2 border-cx-edge flex items-center
              justify-center text-cx-soft hover:text-[#C41E3A] hover:border-[#C41E3A]/50 transition-all">
            <X size={14} />
          </button>
        </div>

        {/* ── No students ── */}
        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 p-10 text-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-cx-fill flex items-center justify-center">
              <Users size={28} className="text-cx-faint" />
            </div>
            <div>
              <p className="font-extrabold text-cx-base text-[17px]">Aucun élève inscrit</p>
              <p className="text-cx-soft text-[13px] mt-1.5 max-w-xs mx-auto">
                Ajoutez un élève dans votre profil pour passer une commande.
              </p>
            </div>
            <Link to="/user/students" onClick={onClose}
              className="inline-flex items-center gap-2 bg-[#7B2535] hover:bg-[#9B3045] text-white
                font-semibold text-[13.5px] px-5 py-2.5 rounded-xl transition-all duration-200">
              <User size={14} /> Gérer mes élèves
            </Link>
          </div>
        ) : (
          <>
            {/* ════════ PROGRESS HEADER ════════ */}
            <div className="px-6 pt-5 pb-4 border-b border-cx-line flex-shrink-0">

              {/* Delivery date */}
              <div className="flex items-center gap-1.5 mb-4">
                <Calendar size={12} className="text-[#C41E3A]" />
                <span className="text-[12px] font-bold text-[#C41E3A] capitalize">
                  {delivery.formattedDate}
                </span>
              </div>

              {/* 3-step stepper */}
              <div className="flex items-center">
                {[
                  { label: lang === 'en' ? 'Main meal' : 'Repas principal', short: lang === 'en' ? 'Meal' : 'Repas' },
                  { label: 'Extras', short: 'Extras' },
                  { label: lang === 'en' ? 'Review' : 'Révision', short: lang === 'en' ? 'Review' : 'Révision' },
                ].map((step, idx) => {
                  const isDone   = idx < phaseIdx
                  const isActive = idx === phaseIdx
                  return (
                    <div key={idx} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1.5 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-extrabold transition-all duration-300 ${
                          isDone   ? 'bg-[#C41E3A] text-white' :
                          isActive ? 'bg-[#C41E3A] text-white ring-4 ring-[#C41E3A]/20' :
                                     'bg-cx-fill border-2 border-cx-edge text-cx-faint'
                        }`}>
                          {isDone ? <Check size={13} strokeWidth={3} /> : idx + 1}
                        </div>
                        <span className={`text-[10.5px] font-bold text-center leading-tight hidden sm:block transition-colors ${
                          isActive ? 'text-[#C41E3A]' : isDone ? 'text-cx-soft' : 'text-cx-faint'
                        }`}>{step.label}</span>
                        <span className={`text-[10px] font-bold text-center sm:hidden transition-colors ${
                          isActive ? 'text-[#C41E3A]' : isDone ? 'text-cx-soft' : 'text-cx-faint'
                        }`}>{step.short}</span>
                      </div>
                      {idx < 2 && (
                        <div className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-300 ${
                          idx < phaseIdx ? 'bg-[#C41E3A]' : 'bg-cx-muted'
                        }`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ════════ ANIMATED STEP CONTENT ════════ */}
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col flex-1 min-h-0"
              >

                {/* ════ STEP 1 — ALL CHILDREN MAIN MEAL ════ */}
                {phase === 'meal' && (
                  <>
                    <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6">
                      {students.map((child, ci) => {
                        const order = childOrders[ci]
                        const childMeals = getMealsForStudent(child)
                        const hex = getColorById(child.colorCode)?.hex ?? '#C41E3A'

                        return (
                          <div key={child.id}>
                            {/* Child section header */}
                            <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-cx-line">
                              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: hex + '20' }}>
                                <User size={15} style={{ color: hex }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-extrabold text-cx-base leading-tight">
                                  {child.firstName} {child.lastName}
                                </p>
                                <p className="text-[11px] text-cx-soft truncate">{child.schoolName}</p>
                              </div>
                              {/* Selected meal badge */}
                              <AnimatePresence>
                                {order.mainMeal && (
                                  <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    style={{ backgroundColor: hex + '18', color: hex, borderColor: hex + '35' }}
                                    className="flex-shrink-0 flex items-center gap-1 text-[10.5px] font-bold
                                      px-2.5 py-1 rounded-full border max-w-[120px]"
                                  >
                                    <Check size={9} strokeWidth={3} />
                                    <span className="truncate">{order.mainMeal.name}</span>
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Allergen notice for this child */}
                            {child.allergens.length > 0 && (
                              <div className="flex items-center gap-2 mb-2.5 px-3 py-2 rounded-xl bg-orange-50 border border-orange-200">
                                <span className="text-sm flex-shrink-0">⚠️</span>
                                <p className="text-[11px] font-semibold text-orange-700 leading-tight">
                                  {lang === 'en' ? 'Allergens:' : 'Allergènes :'}
                                  {' '}
                                  {child.allergens
                                    .map(id => ALLERGIES.find(a => a.id === id))
                                    .filter(Boolean)
                                    .map(a => `${a!.emoji} ${a!.label}`)
                                    .join(', ')
                                  }
                                </p>
                              </div>
                            )}

                            {/* Meal grid */}
                            {childMeals.length === 0 ? (
                              <p className="text-cx-soft text-[13px] py-4 text-center">{t.dayOrder.noMeals}</p>
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                {childMeals.map((meal) => {
                                  const isSelected = order.mainMeal?.id === meal.id
                                  const triggered = meal.allergyIds
                                    .filter(id => child.allergens.includes(id))
                                    .map(id => ALLERGIES.find(a => a.id === id))
                                    .filter(Boolean) as typeof ALLERGIES
                                  const isBlocked = triggered.length > 0

                                  return (
                                    <motion.div key={meal.id}
                                      whileHover={isBlocked ? {} : { y: -2 }}
                                      transition={{ duration: 0.18 }}
                                      onClick={() => !isBlocked && patchOrder(ci, { mainMeal: meal })}
                                      className={`relative flex flex-col rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-cx-card ${
                                        isBlocked
                                          ? 'border-orange-200 opacity-60 cursor-not-allowed'
                                          : isSelected
                                            ? 'cursor-pointer border-[#C41E3A] shadow-[0_0_0_3px_rgba(196,30,58,0.12)]'
                                            : 'cursor-pointer border-cx-line hover:border-[#C41E3A]/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
                                      }`}
                                    >
                                      <div className="relative aspect-[4/3] overflow-hidden bg-cx-muted">
                                        <img src={meal.image} alt={meal.name}
                                          className="w-full h-full object-cover"
                                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                        <AnimatePresence>
                                          {isSelected && !isBlocked && (
                                            <motion.div
                                              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#C41E3A] flex items-center justify-center shadow-[0_2px_8px_rgba(196,30,58,0.5)]">
                                              <Check size={11} className="text-white" strokeWidth={3} />
                                            </motion.div>
                                          )}
                                          {isBlocked && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                              className="absolute inset-0 bg-orange-50/85 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1 p-2">
                                              <span className="text-lg">⚠️</span>
                                              <p className="text-[9.5px] font-extrabold text-orange-700 uppercase tracking-wide text-center">
                                                {lang === 'en' ? 'Allergen' : 'Allergène'}
                                              </p>
                                              <div className="flex flex-wrap justify-center gap-0.5 mt-0.5">
                                                {triggered.map(a => (
                                                  <span key={a.id} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8.5px] font-bold bg-orange-100 text-orange-700 border border-orange-200">
                                                    {a.emoji} {a.label}
                                                  </span>
                                                ))}
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                      <div className="p-2.5 flex flex-col gap-1">
                                        <p className="text-[11.5px] font-bold text-cx-base line-clamp-2 leading-snug">{meal.name}</p>
                                        <p className="text-[13px] font-extrabold text-[#C41E3A]">{fmt(meal.price)}</p>
                                        {meal.tags.length > 0 && (
                                          <div className="flex flex-wrap gap-1">
                                            {meal.tags.slice(0, 2).map((tag) => {
                                              const cfg = TAG_CONFIG[tag]; const Icon = cfg.icon
                                              return (
                                                <span key={tag} className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded-full text-[9px] font-semibold bg-cx-fill border border-cx-edge ${cfg.color}`}>
                                                  <Icon size={7} /> {tagLabels[tag]}
                                                </span>
                                              )
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 border-t border-cx-line px-5 py-4">
                      {addonGroups.length > 0 && (
                        <button
                          onClick={() => setPhase('review')}
                          disabled={!anyMealSelected}
                          className="w-full flex items-center justify-center gap-2 py-2 mb-2 rounded-xl
                            border-2 border-[#C41E3A]/40 text-[#C41E3A] font-bold text-[13px]
                            hover:bg-[#C41E3A]/8 hover:border-[#C41E3A] transition-all duration-200
                            disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Zap size={14} />
                          <span>{lang === 'en' ? 'Confirm — no extras' : 'Confirmer sans extras'}</span>
                        </button>
                      )}
                      <div className="flex gap-3">
                        <button onClick={retreat}
                          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 border-cx-edge
                            text-[13px] font-bold text-cx-sub hover:border-cx-muted transition-colors flex-shrink-0">
                          <ChevronLeft size={15} />
                          <span className="hidden sm:inline">{t.mealModal.back}</span>
                        </button>
                        <button onClick={advance} disabled={!anyMealSelected}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                            bg-[#C41E3A] hover:bg-[#a01830] text-white font-extrabold text-[14px]
                            uppercase tracking-wide transition-all duration-200
                            hover:shadow-[0_6px_24px_rgba(196,30,58,0.45)] hover:-translate-y-0.5
                            disabled:bg-cx-muted disabled:text-cx-soft disabled:cursor-not-allowed disabled:translate-y-0">
                          {addonGroups.length > 0
                            ? <><span>{lang === 'en' ? 'Extras' : 'Extras'}</span><ChevronRight size={15} /></>
                            : <><Calendar size={14} /><span>{t.dayOrder.confirmDay} {delivery.formattedDate}</span></>
                          }
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* ════ STEP 2 — ALL CHILDREN EXTRAS ════ */}
                {phase === 'addons' && (
                  <>
                    {/* Shared category tabs — sticky inside scroll */}
                    <div className="flex-shrink-0 px-5 pt-3 pb-2.5 border-b border-cx-line bg-cx-card">
                      <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] -mx-1 px-1">
                        {addonGroups.map((g, i) => {
                          const count = groupTotalSelections(i)
                          return (
                            <button key={g.id} type="button" onClick={() => setAddonTab(i)}
                              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl
                                text-[12px] font-bold border-2 transition-all duration-200
                                ${i === addonTab
                                  ? 'bg-[#C41E3A] border-[#C41E3A] text-white shadow-[0_4px_14px_rgba(196,30,58,0.3)]'
                                  : 'bg-cx-fill border-cx-edge text-cx-sub hover:border-[#C41E3A]/40'
                                }`}>
                              <span>{g.emoji}</span>
                              <span>{g.label}</span>
                              {count > 0 && (
                                <span className={`w-4 h-4 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                                  i === addonTab ? 'bg-white text-[#C41E3A]' : 'bg-[#C41E3A] text-white'
                                }`}>{count}</span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Per-child addon sections */}
                    <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6">
                      {students.map((child, ci) => {
                        const order = childOrders[ci]
                        if (!order.mainMeal) return null
                        const hex = getColorById(child.colorCode)?.hex ?? '#C41E3A'
                        const groupItems = addonGroups[addonTab]?.items ?? []

                        return (
                          <div key={child.id}>
                            {/* Child + meal context header */}
                            <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-cx-line">
                              <span
                                style={{ backgroundColor: hex, color: '#fff' }}
                                className="flex-shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold"
                              >
                                {child.firstName}
                              </span>
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <div className="w-6 h-6 rounded-md overflow-hidden bg-cx-muted flex-shrink-0">
                                  <img src={order.mainMeal.image} alt="" className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                </div>
                                <span className="text-[11.5px] text-cx-soft truncate">{order.mainMeal.name}</span>
                              </div>
                              {/* Count of addons selected in this category for this child */}
                              {groupItems.filter(m => order.addonQtys.has(m.id)).length > 0 && (
                                <span style={{ backgroundColor: hex + '18', color: hex, borderColor: hex + '35' }}
                                  className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border">
                                  {groupItems.filter(m => order.addonQtys.has(m.id)).length} sélectionné{groupItems.filter(m => order.addonQtys.has(m.id)).length > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>

                            {/* Addon cards grid */}
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={`${ci}-tab-${addonTab}`}
                                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
                              >
                                {groupItems.map((m) => {
                                  const sel = order.addonQtys.has(m.id)
                                  const qty = order.addonQtys.get(m.id) ?? 1
                                  return (
                                    <motion.div key={m.id}
                                      whileHover={{ y: -2 }} transition={{ duration: 0.18 }}
                                      onClick={() => toggleAddon(ci, m.id)}
                                      className={`relative flex flex-col rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 bg-cx-card ${
                                        sel
                                          ? 'border-[#C41E3A] shadow-[0_0_0_3px_rgba(196,30,58,0.12)]'
                                          : 'border-cx-line hover:border-[#C41E3A]/40'
                                      }`}
                                    >
                                      <div className="relative aspect-[4/3] overflow-hidden bg-cx-muted">
                                        <img src={m.image} alt={m.name} className="w-full h-full object-cover"
                                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                        <AnimatePresence>
                                          {sel && (
                                            <motion.div
                                              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#C41E3A] flex items-center justify-center shadow-[0_2px_8px_rgba(196,30,58,0.5)]">
                                              <Check size={11} className="text-white" strokeWidth={3} />
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                      <div className="p-2.5 flex flex-col gap-1.5">
                                        <p className="text-[11.5px] font-bold text-cx-base line-clamp-2 leading-snug">{m.name}</p>
                                        <p className="text-[13px] font-extrabold text-[#C41E3A]">{fmt(m.price)}</p>
                                        <AnimatePresence>
                                          {sel && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                              className="overflow-hidden" onClick={(e) => e.stopPropagation()}
                                            >
                                              <div className="flex items-center justify-between pt-2 border-t border-cx-line mt-1">
                                                <span className="text-[10px] text-cx-soft">{t.mealModal.qty}</span>
                                                <div className="flex items-center rounded-lg overflow-hidden border border-cx-edge bg-cx-fill">
                                                  <button type="button" onClick={() => changeAddonQty(ci, m.id, -1)}
                                                    className="w-6 h-6 flex items-center justify-center text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-colors">
                                                    <Minus size={10} />
                                                  </button>
                                                  <span className="w-5 text-center text-[11px] font-bold text-cx-base">{qty}</span>
                                                  <button type="button" onClick={() => changeAddonQty(ci, m.id, 1)}
                                                    className="w-6 h-6 flex items-center justify-center text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-colors">
                                                    <Plus size={10} />
                                                  </button>
                                                </div>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    </motion.div>
                                  )
                                })}
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 border-t border-cx-line px-5 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[12px] text-cx-soft">{t.mealModal.subtotal}</span>
                        <span className="text-[18px] font-extrabold text-cx-base">{fmt(grandTotal)}</span>
                      </div>
                      {/* Skip to review shortcut */}
                      <button
                        onClick={() => setPhase('review')}
                        className="w-full flex items-center justify-center gap-2 py-2 mb-2 rounded-xl
                          border-2 border-[#C41E3A]/40 text-[#C41E3A] font-bold text-[13px]
                          hover:bg-[#C41E3A]/8 hover:border-[#C41E3A] transition-all duration-200"
                      >
                        <Zap size={13} />
                        <span>{lang === 'en' ? 'Go to checkout' : 'Aller au panier'}</span>
                      </button>
                      <div className="flex gap-3">
                        <button onClick={retreat}
                          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 border-cx-edge
                            text-[13px] font-bold text-cx-sub hover:border-cx-muted transition-colors flex-shrink-0">
                          <ChevronLeft size={15} />
                          <span className="hidden sm:inline">{t.mealModal.back}</span>
                        </button>
                        <button onClick={advance}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                            bg-[#C41E3A] hover:bg-[#a01830] text-white font-extrabold text-[14px]
                            uppercase tracking-wide transition-all duration-200
                            hover:shadow-[0_6px_24px_rgba(196,30,58,0.45)] hover:-translate-y-0.5">
                          {addonTab < addonGroups.length - 1 ? (
                            <>
                              <span>{addonGroups[addonTab + 1].emoji} {addonGroups[addonTab + 1].label}</span>
                              <ChevronRight size={15} />
                            </>
                          ) : (
                            <>
                              <span>{lang === 'en' ? 'Review' : 'Révision'}</span>
                              <ChevronRight size={15} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* ════ STEP 3 — REVIEW ════ */}
                {phase === 'review' && (
                  <>
                    {/* Warning banner — shown when any child has no meal */}
                    {childOrders.some((o) => !o.mainMeal) && (
                      <div className="mx-5 mt-4 flex items-start gap-3 px-4 py-3 rounded-2xl
                        bg-amber-50 border border-amber-200">
                        <span className="text-base flex-shrink-0 mt-0.5">⚠️</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12.5px] font-extrabold text-amber-800 leading-tight">
                            {lang === 'en'
                              ? `${childOrders.filter(o => !o.mainMeal).length} child${childOrders.filter(o => !o.mainMeal).length > 1 ? 'ren have' : ' has'} no meal selected`
                              : `${childOrders.filter(o => !o.mainMeal).length} enfant${childOrders.filter(o => !o.mainMeal).length > 1 ? 's n\'ont' : ' n\'a'} pas de repas sélectionné`
                            }
                          </p>
                          <p className="text-[11px] text-amber-700 mt-0.5">
                            {lang === 'en'
                              ? 'They will not be included in the order.'
                              : 'Ils ne seront pas inclus dans la commande.'
                            }
                          </p>
                        </div>
                        <button
                          onClick={() => setPhase('meal')}
                          className="flex-shrink-0 text-[11.5px] font-extrabold text-amber-800
                            underline underline-offset-2 hover:text-amber-900">
                          {lang === 'en' ? 'Select' : 'Choisir'}
                        </button>
                      </div>
                    )}

                    <div className="flex-1 overflow-y-auto px-5 py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {students.map((student, i) => {
                          const order = childOrders[i]
                          const addonItems = Array.from(order.addonQtys.entries())
                            .map(([id, qty]) => ({ meal: meals.find((x) => x.id === id)!, qty }))
                            .filter((x) => x.meal)
                          const hex = getColorById(student.colorCode)?.hex ?? '#C41E3A'
                          const missingMeal = !order.mainMeal
                          return (
                            <div key={student.id}
                              className={`rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                                missingMeal
                                  ? 'bg-amber-50 border-amber-300'
                                  : 'bg-cx-fill border-cx-line'
                              }`}>
                              <div className="px-4 py-3 border-b flex items-center justify-between gap-2"
                                style={{
                                  backgroundColor: missingMeal ? 'rgba(251,191,36,0.15)' : hex + '12',
                                  borderColor: missingMeal ? 'rgba(251,191,36,0.4)' : 'var(--cx-line)',
                                }}>
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: missingMeal ? 'rgba(251,191,36,0.25)' : hex + '25' }}>
                                    <User size={12} style={{ color: missingMeal ? '#92400e' : hex }} />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[13.5px] font-extrabold text-cx-base truncate">
                                      {student.firstName} {student.lastName}
                                    </p>
                                    <p className="text-[11px] text-cx-soft truncate">{student.schoolName}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setPhase('meal')}
                                  className="text-[11.5px] font-bold hover:underline flex-shrink-0"
                                  style={{ color: missingMeal ? '#b45309' : hex }}>
                                  Modifier
                                </button>
                              </div>

                              <div className="px-4 py-3 flex flex-col gap-2.5">
                                {!order.mainMeal ? (
                                  <button
                                    onClick={() => setPhase('meal')}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                                      border-2 border-dashed border-amber-300 bg-amber-50/60
                                      text-[12.5px] font-bold text-amber-700
                                      hover:bg-amber-100 hover:border-amber-400 transition-all duration-200"
                                  >
                                    <span>⚠️</span>
                                    <span>{lang === 'en' ? 'No meal selected — tap to choose' : 'Aucun repas — cliquer pour choisir'}</span>
                                  </button>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-cx-muted flex-shrink-0">
                                        <img src={order.mainMeal.image} alt={order.mainMeal.name}
                                          className="w-full h-full object-cover"
                                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[12.5px] font-semibold text-cx-base truncate">{order.mainMeal.name}</p>
                                        <p className="text-[11.5px] font-bold text-[#C41E3A]">{fmt(order.mainMeal.price)}</p>
                                      </div>
                                      <span className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-[#C41E3A]/10
                                        text-[11px] font-bold text-[#C41E3A] border border-[#C41E3A]/20">
                                        × 1
                                      </span>
                                    </div>
                                    {addonItems.map(({ meal: m, qty }) => (
                                      <div key={m.id} className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-md overflow-hidden bg-cx-muted flex-shrink-0 opacity-80">
                                          <img src={m.image} alt={m.name} className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-[11px] text-cx-soft truncate">+ {m.name}</p>
                                        </div>
                                        <div className="flex items-center rounded-md overflow-hidden border border-cx-edge bg-cx-card flex-shrink-0">
                                          <button type="button" onClick={() => changeAddonQty(i, m.id, -1)}
                                            className="w-5 h-5 flex items-center justify-center text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-colors">
                                            <Minus size={9} />
                                          </button>
                                          <span className="w-4 text-center text-[10.5px] font-bold text-cx-base">{qty}</span>
                                          <button type="button" onClick={() => changeAddonQty(i, m.id, 1)}
                                            className="w-5 h-5 flex items-center justify-center text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-colors">
                                            <Plus size={9} />
                                          </button>
                                        </div>
                                        <button type="button" onClick={() => removeAddon(i, m.id)}
                                          className="w-5 h-5 flex items-center justify-center rounded-md text-cx-faint hover:text-red-500 hover:bg-red-500/10 transition-colors flex-shrink-0">
                                          <X size={10} />
                                        </button>
                                      </div>
                                    ))}
                                  </>
                                )}
                              </div>

                              <div className="px-4 py-2.5 border-t border-cx-line flex justify-between items-center">
                                <span className="text-[11.5px] text-cx-soft">Sous-total</span>
                                <span className="text-[13px] font-extrabold" style={{ color: hex }}>{fmt(childSubtotal(order))}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex-shrink-0 border-t border-cx-line px-5 py-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-[11.5px] text-cx-soft">Total combiné</p>
                          <p className="text-[22px] font-extrabold text-cx-base tracking-tight">{fmt(grandTotal)}</p>
                        </div>
                        <button onClick={() => setPhase('meal')}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-cx-edge
                            text-[12.5px] font-bold text-cx-sub hover:border-cx-muted transition-colors">
                          <ChevronLeft size={13} /> Modifier
                        </button>
                      </div>
                      <button onClick={confirm}
                        disabled={childOrders.every((o) => !o.mainMeal)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                          bg-[#C41E3A] hover:bg-[#a01830] text-white font-extrabold text-[14px]
                          uppercase tracking-wide transition-all duration-200
                          hover:shadow-[0_6px_24px_rgba(196,30,58,0.45)] hover:-translate-y-0.5
                          disabled:bg-cx-muted disabled:text-cx-soft disabled:cursor-not-allowed">
                        <Calendar size={15} />
                        <span>{t.dayOrder.confirmDay} {delivery.formattedDate}</span>
                      </button>
                    </div>
                  </>
                )}

              </motion.div>
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </>
  )
}
