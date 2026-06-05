import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Check, ChevronLeft, ChevronRight, ShoppingCart,
  Calendar, User, Users, Minus, Plus, Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Meal, MenuCategory, MealTag, DeliveryInfo, Student, OrderingSchool } from '../../types'
import { fmt, TAG_CONFIG, DAYS, fmtDeliveryDate } from '../../lib/menuConfig'
import type { DayName } from '../../lib/menuConfig'
import { weeks as allWeeks } from '../../lib/mockData'
import { useCartStore } from '../../store/cartStore'
import { useLang } from '../../contexts/LangContext'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ChildOrder {
  mainMeal: Meal | null
  addonQtys: Map<string, number>
}

// Flow: meal(0) → meal(1) → … → addons(0) → addons(1) → … → review
type WizardPos =
  | { phase: 'meal';   childIdx: number }
  | { phase: 'addons'; childIdx: number }
  | { phase: 'review' }

interface Props {
  day: DayName
  weekId: string
  meals: Meal[]
  categories: MenuCategory[]
  students: Student[]
  schools: OrderingSchool[]
  onClose: () => void
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function DayOrderModal({
  day, weekId, meals, categories, students, schools, onClose,
}: Props) {
  const { t, lang } = useLang()
  const { addItem } = useCartStore()

  const selectedWeek = allWeeks.find((w) => w.id === weekId)

  const [childOrders, setChildOrders] = useState<ChildOrder[]>(() =>
    students.map(() => ({ mainMeal: null, addonQtys: new Map() }))
  )
  const [pos, setPos] = useState<WizardPos>({ phase: 'meal', childIdx: 0 })
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
    const schoolId = schools.find((s) => s.name === student.school)?.id ?? ''
    return meals.filter(
      (m) =>
        m.categoryId === 'cat-1' && m.available &&
        m.availableDays?.includes(day) &&
        (!schoolId || m.schoolIds.includes(schoolId))
    )
  }

  const childIdx = pos.phase !== 'review' ? pos.childIdx : 0
  const currentChild = students[childIdx]
  const currentOrder = childOrders[childIdx]

  const patchOrder = (idx: number, patch: Partial<ChildOrder>) =>
    setChildOrders((prev) => {
      const next = [...prev]; next[idx] = { ...next[idx], ...patch }; return next
    })

  const toggleAddon = (mealId: string) => {
    const m = new Map(currentOrder.addonQtys)
    m.has(mealId) ? m.delete(mealId) : m.set(mealId, 1)
    patchOrder(childIdx, { addonQtys: m })
  }

  const changeAddonQty = (mealId: string, delta: number) => {
    const m = new Map(currentOrder.addonQtys)
    const v = (m.get(mealId) ?? 0) + delta
    v <= 0 ? m.delete(mealId) : m.set(mealId, v)
    patchOrder(childIdx, { addonQtys: m })
  }

  // ── Review-screen inline editing ──────────────────────────────────────────
  const removeAddonForChild = (ci: number, mealId: string) => {
    const m = new Map(childOrders[ci].addonQtys); m.delete(mealId)
    patchOrder(ci, { addonQtys: m })
  }
  const changeAddonQtyForChild = (ci: number, mealId: string, delta: number) => {
    const m = new Map(childOrders[ci].addonQtys)
    const v = (m.get(mealId) ?? 0) + delta
    v <= 0 ? m.delete(mealId) : m.set(mealId, v)
    patchOrder(ci, { addonQtys: m })
  }
  // ── Navigation ────────────────────────────────────────────────────────────
  // Flow: meal(0)→meal(1)→…→addons(0,tab0)→addons(0,tab1)→…→addons(1,tab0)→…→review
  const lastTab = addonGroups.length - 1

  const advance = () => {
    if (pos.phase === 'meal') {
      const next = pos.childIdx + 1
      if (next < students.length) {
        setPos({ phase: 'meal', childIdx: next })
      } else {
        setAddonTab(0)
        setPos({ phase: 'addons', childIdx: 0 })
      }
    } else if (pos.phase === 'addons') {
      if (addonTab < lastTab) {
        setAddonTab((t) => t + 1)
      } else {
        const next = pos.childIdx + 1
        if (next < students.length) {
          setAddonTab(0)
          setPos({ phase: 'addons', childIdx: next })
        } else {
          setPos({ phase: 'review' })
        }
      }
    }
  }

  const retreat = () => {
    if (pos.phase === 'meal') {
      if (pos.childIdx === 0) onClose()
      else setPos({ phase: 'meal', childIdx: pos.childIdx - 1 })
    } else if (pos.phase === 'addons') {
      if (addonTab > 0) {
        setAddonTab((t) => t - 1)
      } else if (pos.childIdx > 0) {
        setAddonTab(Math.max(0, lastTab))
        setPos({ phase: 'addons', childIdx: pos.childIdx - 1 })
      } else {
        // First addon tab of first child → back to last child's meal
        setPos({ phase: 'meal', childIdx: students.length - 1 })
      }
    } else {
      setAddonTab(Math.max(0, lastTab))
      setPos({ phase: 'addons', childIdx: students.length - 1 })
    }
  }

  // Skip all remaining addon tabs for the current child → jump to next child or review
  const skipExtras = () => {
    if (pos.phase !== 'addons') return
    const next = pos.childIdx + 1
    if (next < students.length) {
      setAddonTab(0)
      setPos({ phase: 'addons', childIdx: next })
    } else {
      setPos({ phase: 'review' })
    }
  }

  // Next button label in addons step
  const nextLabel = () => {
    if (pos.phase !== 'addons') return ''
    if (addonTab < lastTab) return addonGroups[addonTab + 1]?.label ?? ''
    if (pos.childIdx < students.length - 1) return students[pos.childIdx + 1].firstName
    return 'Révision'
  }

  // Subtotals
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
      const si = { id: student.id, firstName: student.firstName, lastName: student.lastName, school: student.school, grade: student.grade }
      addItem(order.mainMeal, delivery, si, false)           // main meal — qty locked
      order.addonQtys.forEach((qty, id) => {
        const m = meals.find((x) => x.id === id)
        if (m) for (let q = 0; q < qty; q++) addItem(m, delivery, si, true)  // add-on — qty editable
      })
    })
    onClose()
  }

  // Progress stepper: 0=Repas, 1=Extras, 2=Révision
  const phaseIdx = pos.phase === 'meal' ? 0 : pos.phase === 'addons' ? 1 : 2

  const animKey = pos.phase === 'review'
    ? 'review'
    : `${pos.phase}-${pos.childIdx}-${pos.phase === 'addons' ? addonTab : ''}`

  // ── Render ──────────────────────────────────────────────────────────────────

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
              <div className="flex items-center mb-4">
                {[
                  { label: 'Repas principal', short: 'Repas' },
                  { label: 'Extras', short: 'Extras' },
                  { label: 'Révision', short: 'Révision' },
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
                        }`}>
                          {step.label}
                        </span>
                        <span className={`text-[10px] font-bold text-center sm:hidden transition-colors ${
                          isActive ? 'text-[#C41E3A]' : isDone ? 'text-cx-soft' : 'text-cx-faint'
                        }`}>
                          {step.short}
                        </span>
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

              {/* Child indicator dots — visible in meal + addons phases */}
              {pos.phase !== 'review' && students.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-cx-soft font-medium">Enfant :</span>
                  <div className="flex gap-1.5">
                    {students.map((s, i) => {
                      const isDoneChild = pos.phase === 'addons'
                        ? i < pos.childIdx
                        : i < pos.childIdx
                      const isActiveChild = i === pos.childIdx
                      return (
                        <span key={s.id} className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all duration-200 ${
                          isActiveChild ? 'bg-[#C41E3A] text-white' :
                          isDoneChild   ? 'bg-[#C41E3A]/20 text-[#C41E3A]' :
                                          'bg-cx-fill text-cx-faint border border-cx-edge'
                        }`}>
                          {s.firstName}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ════════ ANIMATED STEP CONTENT ════════ */}
            <AnimatePresence mode="wait">
              <motion.div
                key={animKey}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col flex-1 min-h-0"
              >

                {/* ════ MEAL STEP ════ */}
                {pos.phase === 'meal' && currentChild && (
                  <>
                    <div className="px-6 pt-4 pb-3 flex-shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#C41E3A]/10 flex items-center justify-center flex-shrink-0">
                          <User size={16} className="text-[#C41E3A]" />
                        </div>
                        <div>
                          <h2 className="text-[17px] font-extrabold text-cx-base leading-tight">
                            {currentChild.firstName} {currentChild.lastName}
                          </h2>
                          <p className="text-[12px] text-cx-soft">{currentChild.school}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 pb-4">
                      {getMealsForStudent(currentChild).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <p className="text-cx-soft text-[14px]">{t.dayOrder.noMeals}</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {getMealsForStudent(currentChild).map((meal) => {
                            const isSelected = currentOrder.mainMeal?.id === meal.id
                            return (
                              <motion.div key={meal.id}
                                whileHover={{ y: -3 }} transition={{ duration: 0.18 }}
                                onClick={() => patchOrder(childIdx, { mainMeal: meal })}
                                className={`relative flex flex-col rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 bg-cx-card ${
                                  isSelected
                                    ? 'border-[#C41E3A] shadow-[0_0_0_3px_rgba(196,30,58,0.12)]'
                                    : 'border-cx-line hover:border-[#C41E3A]/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
                                }`}
                              >
                                <div className="relative aspect-[4/3] overflow-hidden bg-cx-muted">
                                  <img src={meal.image} alt={meal.name} className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                  <AnimatePresence>
                                    {isSelected && (
                                      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#C41E3A] flex items-center justify-center shadow-[0_2px_8px_rgba(196,30,58,0.5)]">
                                        <Check size={13} className="text-white" strokeWidth={3} />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                                <div className="p-3 flex flex-col gap-1">
                                  <p className="text-[12.5px] font-bold text-cx-base line-clamp-2 leading-snug">{meal.name}</p>
                                  <p className="text-[14px] font-extrabold text-[#C41E3A]">{fmt(meal.price)}</p>
                                  {meal.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                      {meal.tags.slice(0, 2).map((tag) => {
                                        const cfg = TAG_CONFIG[tag]; const Icon = cfg.icon
                                        return (
                                          <span key={tag} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9.5px] font-semibold bg-cx-fill border border-cx-edge ${cfg.color}`}>
                                            <Icon size={8} /> {tagLabels[tag]}
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

                    <div className="flex-shrink-0 border-t border-cx-line px-5 py-4 flex gap-3">
                      <button onClick={retreat}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 border-cx-edge
                          text-[13px] font-bold text-cx-sub hover:border-cx-muted transition-colors flex-shrink-0">
                        <ChevronLeft size={15} />
                        <span className="hidden sm:inline">{t.mealModal.back}</span>
                      </button>
                      <button onClick={advance} disabled={!currentOrder.mainMeal}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                          bg-[#C41E3A] hover:bg-[#a01830] text-white font-extrabold text-[14px]
                          uppercase tracking-wide transition-all duration-200
                          hover:shadow-[0_6px_24px_rgba(196,30,58,0.45)] hover:-translate-y-0.5
                          disabled:bg-cx-muted disabled:text-cx-soft disabled:cursor-not-allowed disabled:translate-y-0">
                        {pos.childIdx < students.length - 1
                          ? <><span>{students[pos.childIdx + 1].firstName}</span><ChevronRight size={15} /></>
                          : <><span>Extras</span><ChevronRight size={15} /></>
                        }
                      </button>
                    </div>
                  </>
                )}

                {/* ════ ADDONS STEP ════ */}
                {pos.phase === 'addons' && currentChild && currentOrder.mainMeal && (
                  <>
                    <div className="px-5 pt-4 pb-3 flex-shrink-0 border-b border-cx-line">
                      {/* Child + selected meal summary */}
                      <div className="flex gap-3 items-center">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-cx-muted flex-shrink-0">
                          <img src={currentOrder.mainMeal.image} alt={currentOrder.mainMeal.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <User size={11} className="text-[#C41E3A]" />
                            <span className="text-[11px] font-extrabold text-[#C41E3A]">
                              {currentChild.firstName} {currentChild.lastName}
                            </span>
                          </div>
                          <p className="text-[13.5px] font-extrabold text-cx-base truncate">{currentOrder.mainMeal.name}</p>
                          <p className="text-[12px] font-bold text-[#C41E3A]">{fmt(currentOrder.mainMeal.price)}</p>
                        </div>
                        <span className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-[#C41E3A]/10
                          text-[12px] font-bold text-[#C41E3A] border border-[#C41E3A]/20">
                          × 1 repas
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 py-4">
                      {addonGroups.length === 0 ? (
                        <p className="text-cx-soft text-[13px] text-center py-10">Pas d'extras disponibles</p>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {/* Category tabs (display only — navigation is via Next button) */}
                          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] -mx-1 px-1">
                            {addonGroups.map((g, i) => {
                              const count = g.items.filter((m) => currentOrder.addonQtys.has(m.id)).length
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
                                    <span className={`w-4 h-4 rounded-full text-[10px] font-extrabold flex items-center justify-center ${i === addonTab ? 'bg-white text-[#C41E3A]' : 'bg-[#C41E3A] text-white'}`}>
                                      {count}
                                    </span>
                                  )}
                                </button>
                              )
                            })}
                          </div>

                          {/* Addon grid */}
                          <AnimatePresence mode="wait">
                            <motion.div key={addonGroups[addonTab]?.id}
                              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.15 }}
                              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                            >
                              {addonGroups[addonTab]?.items.map((m) => {
                                const sel = currentOrder.addonQtys.has(m.id)
                                const qty = currentOrder.addonQtys.get(m.id) ?? 1
                                return (
                                  <motion.div key={m.id}
                                    whileHover={{ y: -3 }} transition={{ duration: 0.18 }}
                                    onClick={() => toggleAddon(m.id)}
                                    className={`relative flex flex-col rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 bg-cx-card ${sel ? 'border-[#C41E3A] shadow-[0_0_0_3px_rgba(196,30,58,0.12)]' : 'border-cx-line hover:border-[#C41E3A]/40'}`}
                                  >
                                    <div className="relative aspect-[4/3] overflow-hidden bg-cx-muted">
                                      <img src={m.image} alt={m.name} className="w-full h-full object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                      <AnimatePresence>
                                        {sel && (
                                          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#C41E3A] flex items-center justify-center shadow-[0_2px_8px_rgba(196,30,58,0.5)]">
                                            <Check size={13} className="text-white" strokeWidth={3} />
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                    <div className="p-3 flex flex-col gap-1.5">
                                      <p className="text-[12.5px] font-bold text-cx-base line-clamp-2 leading-snug">{m.name}</p>
                                      <p className="text-[14px] font-extrabold text-[#C41E3A]">{fmt(m.price)}</p>
                                      <AnimatePresence>
                                        {sel && (
                                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-between pt-2 border-t border-cx-line mt-1">
                                              <span className="text-[10.5px] text-cx-soft font-medium">{t.mealModal.qty}</span>
                                              <div className="flex items-center rounded-lg overflow-hidden border border-cx-edge bg-cx-fill">
                                                <button type="button" onClick={() => changeAddonQty(m.id, -1)}
                                                  className="w-7 h-7 flex items-center justify-center text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-colors">
                                                  <Minus size={11} />
                                                </button>
                                                <span className="w-6 text-center text-[12px] font-bold text-cx-base">{qty}</span>
                                                <button type="button" onClick={() => changeAddonQty(m.id, 1)}
                                                  className="w-7 h-7 flex items-center justify-center text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-colors">
                                                  <Plus size={11} />
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
                      )}
                    </div>

                    <div className="flex-shrink-0 border-t border-cx-line px-5 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[12px] text-cx-soft">{t.mealModal.subtotal}</span>
                        <span className="text-[18px] font-extrabold text-cx-base">{fmt(childSubtotal(currentOrder))}</span>
                      </div>
                      {/* Skip extras — bypass remaining addon tabs for this child */}
                      <button onClick={skipExtras}
                        className="w-full flex items-center justify-center gap-2 py-2 mb-2 rounded-xl
                          border-2 border-[#C41E3A]/40 text-[#C41E3A] font-bold text-[13px]
                          hover:bg-[#C41E3A]/8 hover:border-[#C41E3A] transition-all duration-200">
                        <Zap size={13} />
                        <span>{t.mealModal.directCheckout}</span>
                      </button>
                      <div className="flex gap-2">
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
                          <span>{nextLabel()}</span>
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* ════ REVIEW STEP ════ */}
                {pos.phase === 'review' && (
                  <>
                    <div className="flex-1 overflow-y-auto px-5 py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {students.map((student, i) => {
                          const order = childOrders[i]
                          const addonItems = Array.from(order.addonQtys.entries())
                            .map(([id, qty]) => ({ meal: meals.find((x) => x.id === id)!, qty }))
                            .filter((x) => x.meal)
                          return (
                            <div key={student.id} className="bg-cx-fill rounded-2xl border border-cx-line overflow-hidden">
                              <div className="px-4 py-3 bg-[#C41E3A]/8 border-b border-cx-line flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-[13.5px] font-extrabold text-cx-base truncate">
                                    {student.firstName} {student.lastName}
                                  </p>
                                  <p className="text-[11.5px] text-cx-soft truncate">{student.school}</p>
                                </div>
                                <button
                                  onClick={() => { setAddonTab(0); setPos({ phase: 'meal', childIdx: i }) }}
                                  className="text-[11.5px] font-bold text-[#C41E3A] hover:underline flex-shrink-0">
                                  Modifier
                                </button>
                              </div>

                              <div className="px-4 py-3 flex flex-col gap-2.5">
                                {!order.mainMeal ? (
                                  <p className="text-[12.5px] text-cx-soft italic">Aucun repas sélectionné</p>
                                ) : (
                                  <>
                                    {/* Main meal + qty stepper */}
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

                                    {/* Add-ons with remove + qty */}
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
                                          <button type="button" onClick={() => changeAddonQtyForChild(i, m.id, -1)}
                                            className="w-5 h-5 flex items-center justify-center text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-colors">
                                            <Minus size={9} />
                                          </button>
                                          <span className="w-4 text-center text-[10.5px] font-bold text-cx-base">{qty}</span>
                                          <button type="button" onClick={() => changeAddonQtyForChild(i, m.id, 1)}
                                            className="w-5 h-5 flex items-center justify-center text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-colors">
                                            <Plus size={9} />
                                          </button>
                                        </div>
                                        <button type="button" onClick={() => removeAddonForChild(i, m.id)}
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
                                <span className="text-[13px] font-extrabold text-[#C41E3A]">{fmt(childSubtotal(order))}</span>
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
                        <button onClick={retreat}
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
                        <ShoppingCart size={15} />
                        Confirmer la commande
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
