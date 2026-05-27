import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Check, ChevronLeft, ChevronRight,
  Minus, Plus, ShoppingCart, Calendar,
} from 'lucide-react'
import type { Meal, MenuCategory, MealTag, DeliveryInfo } from '../../types'
import { fmt, TAG_CONFIG, DAYS, fmtDeliveryDate } from '../../lib/menuConfig'
import type { DayName } from '../../lib/menuConfig'
import { weeks } from '../../lib/mockData'
import { useCartStore } from '../../store/cartStore'
import { useLang } from '../../contexts/LangContext'

interface Props {
  day: DayName
  defaultWeekId: string
  meals: Meal[]          // school+week filtered set
  categories: MenuCategory[]
  onClose: () => void
  preSelectedMeal?: Meal // if set, skip step 1 and jump straight to add-ons
}

type Step = 'select-meal' | 'select-addons'

export default function DayOrderModal({
  day: initialDay,
  defaultWeekId,
  meals,
  categories,
  onClose,
  preSelectedMeal,
}: Props) {
  const { t, lang } = useLang()
  const { addItem } = useCartStore()

  const tagLabels: Record<MealTag, string> = {
    hot: t.menu.tagLabels.hot,
    cold: t.menu.tagLabels.cold,
    vegetarian: t.menu.tagLabels.vegetarian,
    vegan: t.menu.tagLabels.vegan,
    halal: t.menu.tagLabels.halal,
    'gluten-free': t.menu.tagLabels['gluten-free'],
  }

  const [step, setStep]               = useState<Step>(preSelectedMeal ? 'select-addons' : 'select-meal')
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(preSelectedMeal ?? null)
  const [selectedDay]   = useState<DayName>(initialDay)
  const [selectedWeekId] = useState(defaultWeekId || weeks[0]?.id || '')
  const [mainQty, setMainQty]           = useState(1)
  const [addonQtys, setAddonQtys]       = useState<Map<string, number>>(new Map())
  const [addonGroupIndex, setAddonGroupIndex] = useState(0)

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // ── Derived data ──────────────────────────────────────────────────────────

  // Main meals: cat-1, available, and served on the chosen day
  const mainMeals = meals.filter(
    (m) => m.categoryId === 'cat-1' && m.available && m.availableDays?.includes(selectedDay)
  )

  // Add-ons: everything except cat-1
  const addonGroups = categories
    .filter((c) => c.id !== '' && c.id !== 'cat-1')
    .map((c) => ({ ...c, items: meals.filter((m) => m.categoryId === c.id && m.available) }))
    .filter((g) => g.items.length > 0)

  const activeGroup  = addonGroups[addonGroupIndex] ?? null
  const selectedWeek = weeks.find((w) => w.id === selectedWeekId)

  const totalAddonQty = Array.from(addonQtys.values()).reduce((s, v) => s + v, 0)

  const grandTotal =
    (selectedMeal?.price ?? 0) * mainQty +
    Array.from(addonQtys.entries()).reduce((s, [id, q]) => {
      const m = meals.find((x) => x.id === id)
      return s + (m?.price ?? 0) * q
    }, 0)

  // ── Handlers ──────────────────────────────────────────────────────────────

  const toggleAddon = (id: string) =>
    setAddonQtys((prev) => {
      const next = new Map(prev)
      next.has(id) ? next.delete(id) : next.set(id, 1)
      return next
    })

  const changeAddonQty = (id: string, delta: number) =>
    setAddonQtys((prev) => {
      const next = new Map(prev)
      const updated = (next.get(id) ?? 0) + delta
      if (updated <= 0) next.delete(id)
      else next.set(id, updated)
      return next
    })

  const handleContinue = () => {
    if (!selectedMeal) return
    setStep('select-addons')
    setAddonGroupIndex(0)
    setAddonQtys(new Map())
    setMainQty(1)
  }

  const isLastGroup = addonGroupIndex >= addonGroups.length - 1

  const commitCart = () => {
    if (!selectedMeal) return
    const w = weeks.find((x) => x.id === selectedWeekId)
    const dayIndex = DAYS.indexOf(selectedDay)
    const isoDate = (() => {
      if (!w) return ''
      const d = new Date(w.startDate + 'T12:00:00')
      d.setDate(d.getDate() + dayIndex)
      return d.toISOString().slice(0, 10)
    })()
    const delivery: DeliveryInfo = {
      weekId: selectedWeekId,
      weekLabel: w?.label ?? '',
      weekStartDate: w?.startDate ?? '',
      day: selectedDay,
      isoDate,
      formattedDate: w
        ? fmtDeliveryDate(w.startDate, selectedDay, t.menu.dayLabels[selectedDay], lang)
        : t.menu.dayLabels[selectedDay],
    }
    for (let i = 0; i < mainQty; i++) addItem(selectedMeal, delivery)
    addonQtys.forEach((qty, id) => {
      const m = meals.find((x) => x.id === id)
      if (m) for (let i = 0; i < qty; i++) addItem(m, delivery)
    })
    onClose()
  }

  const handleFooterAction = () => {
    if (isLastGroup) commitCart()
    else setAddonGroupIndex((i) => i + 1)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Panel */}
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
          shadow-[0_0_0_1px_rgba(196,30,58,0.15),0_0_40px_rgba(196,30,58,0.12),0_24px_80px_rgba(0,0,0,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="absolute top-4 right-5 z-10">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cx-fill border-2 border-cx-edge flex items-center
              justify-center text-cx-soft hover:text-[#C41E3A] hover:border-[#C41E3A]/50 transition-all"
          >
            <X size={14} />
          </button>
        </div>

        <AnimatePresence mode="wait">

          {/* ── Step 1: pick a main meal ── */}
          {step === 'select-meal' && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-cx-line flex-shrink-0">
                <p className="text-[11px] font-extrabold text-[#C41E3A] uppercase tracking-widest mb-1">
                  {t.dayOrder.step1}
                </p>
                <h2 className="text-[20px] font-extrabold text-cx-base leading-tight">
                  {t.dayOrder.selectMealTitle}
                </h2>
                <p className="text-[13px] text-cx-soft mt-1">
                  {t.dayOrder.availableOn}{' '}
                  <span className="font-bold text-cx-base">{t.menu.dayLabels[initialDay]}</span>
                </p>
              </div>

              {/* Meal grid */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {mainMeals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-cx-soft text-[14px]">{t.dayOrder.noMeals}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {mainMeals.map((meal) => {
                      const isSelected = selectedMeal?.id === meal.id
                      return (
                        <motion.div
                          key={meal.id}
                          whileHover={{ y: -3 }}
                          transition={{ duration: 0.18 }}
                          onClick={() => setSelectedMeal(meal)}
                          className={`relative flex flex-col rounded-2xl overflow-hidden cursor-pointer
                            border-2 transition-all duration-200 bg-cx-card
                            ${isSelected
                              ? 'border-[#C41E3A] shadow-[0_0_0_3px_rgba(196,30,58,0.12),0_4px_20px_rgba(0,0,0,0.1)]'
                              : 'border-cx-line hover:border-[#C41E3A]/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
                            }`}
                        >
                          {/* Image */}
                          <div className="relative aspect-[4/3] overflow-hidden bg-cx-muted">
                            <img
                              src={meal.image}
                              alt={meal.name}
                              className="w-full h-full object-cover transition-transform duration-300"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.5 }}
                                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#C41E3A]
                                    flex items-center justify-center shadow-[0_2px_8px_rgba(196,30,58,0.5)]"
                                >
                                  <Check size={13} className="text-white" strokeWidth={3} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Info */}
                          <div className="p-3 flex flex-col gap-1">
                            <p className="text-[12.5px] font-bold text-cx-base line-clamp-2 leading-snug">
                              {meal.name}
                            </p>
                            <p className="text-[14px] font-extrabold text-[#C41E3A]">
                              {fmt(meal.price)}
                            </p>
                            {meal.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {meal.tags.slice(0, 2).map((tag) => {
                                  const cfg = TAG_CONFIG[tag]
                                  const Icon = cfg.icon
                                  return (
                                    <span
                                      key={tag}
                                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full
                                        text-[9.5px] font-semibold bg-cx-fill border border-cx-edge ${cfg.color}`}
                                    >
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

              {/* Footer */}
              <div className="flex-shrink-0 border-t border-cx-line px-5 py-4">
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={!selectedMeal}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                    bg-[#C41E3A] hover:bg-[#a01830] text-white font-extrabold text-[14px]
                    uppercase tracking-wide transition-all duration-200
                    hover:shadow-[0_6px_24px_rgba(196,30,58,0.45)] hover:-translate-y-0.5
                    disabled:bg-cx-muted disabled:text-cx-soft disabled:cursor-not-allowed
                    disabled:shadow-none disabled:translate-y-0"
                >
                  {t.dayOrder.continue}
                  {selectedMeal && <ChevronRight size={15} />}
                </button>
                {!selectedMeal && (
                  <p className="text-center text-[11.5px] text-cx-faint mt-2">
                    {t.dayOrder.selectHint}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Step 2: add-ons ── */}
          {step === 'select-addons' && selectedMeal && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col h-full"
            >
              {/* Header — selected meal + week/day selector */}
              <div className="px-5 pt-5 pb-4 flex-shrink-0 border-b border-cx-line">
                <p className="text-[11px] font-extrabold text-[#C41E3A] uppercase tracking-widest mb-3">
                  {t.dayOrder.step2}
                </p>

                {/* Meal summary row */}
                <div className="flex gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-cx-muted flex-shrink-0 border border-cx-line">
                    <img
                      src={selectedMeal.image}
                      alt={selectedMeal.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                  <div className="flex flex-col justify-between min-w-0 flex-1 pr-6">
                    <div>
                      <h2 className="text-[16px] sm:text-[18px] font-extrabold text-cx-base leading-tight">
                        {selectedMeal.name}
                      </h2>
                      <p className="text-[12px] text-cx-soft line-clamp-2 mt-0.5">
                        {selectedMeal.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span className="text-[19px] font-extrabold text-[#C41E3A] leading-none">
                        {fmt(selectedMeal.price)}
                      </span>
                      {/* Qty stepper */}
                      <div className="flex items-center rounded-xl overflow-hidden border border-cx-edge bg-cx-fill">
                        <button
                          type="button"
                          onClick={() => setMainQty((q) => Math.max(1, q - 1))}
                          className="w-8 h-8 flex items-center justify-center text-[#C41E3A]
                            hover:bg-[#C41E3A]/10 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-[13px] font-bold text-cx-base">{mainQty}</span>
                        <button
                          type="button"
                          onClick={() => setMainQty((q) => q + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#C41E3A]
                            hover:bg-[#C41E3A]/10 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery date — read-only, day was chosen from the tab */}
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                    text-[12px] font-bold bg-[#C41E3A]/10 border border-[#C41E3A]/25 text-[#C41E3A]">
                    <Calendar size={11} />
                    {selectedWeek
                      ? fmtDeliveryDate(selectedWeek.startDate, selectedDay, t.menu.dayLabels[selectedDay], lang)
                      : t.menu.dayLabels[selectedDay]}
                  </span>
                </div>
              </div>

              {/* Scrollable add-ons */}
              <div className="flex-1 overflow-y-auto">
                {addonGroups.length > 0 && activeGroup && (
                  <div className="px-5 py-4 flex flex-col gap-4">

                    {/* Section header */}
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-extrabold text-cx-base uppercase tracking-wider">
                        {t.mealModal.extrasTitle}
                      </p>
                      {totalAddonQty > 0 && (
                        <span className="text-[11px] font-bold text-[#C41E3A]">
                          {totalAddonQty} {totalAddonQty > 1 ? t.mealModal.selectedPlural : t.mealModal.selected}
                        </span>
                      )}
                    </div>

                    {/* Category tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none]
                      [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-1 px-1">
                      {addonGroups.map((group, i) => {
                        const count = group.items.filter((m) => addonQtys.has(m.id)).length
                        return (
                          <button
                            key={group.id}
                            type="button"
                            onClick={() => setAddonGroupIndex(i)}
                            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl
                              text-[12px] font-bold border-2 transition-all duration-200
                              ${i === addonGroupIndex
                                ? 'bg-[#C41E3A] border-[#C41E3A] text-white shadow-[0_4px_14px_rgba(196,30,58,0.35)]'
                                : 'bg-cx-fill border-cx-edge text-cx-sub hover:border-[#C41E3A]/40 hover:text-cx-base'
                              }`}
                          >
                            <span>{group.emoji}</span>
                            <span>{group.label}</span>
                            {count > 0 && (
                              <span className={`w-4 h-4 rounded-full text-[10px] font-extrabold
                                flex items-center justify-center
                                ${i === addonGroupIndex
                                  ? 'bg-white text-[#C41E3A]'
                                  : 'bg-[#C41E3A] text-white'
                                }`}
                              >
                                {count}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* Addon grid */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeGroup.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.18 }}
                        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                      >
                        {activeGroup.items.map((m) => {
                          const sel = addonQtys.has(m.id)
                          const qty = addonQtys.get(m.id) ?? 1
                          return (
                            <motion.div
                              key={m.id}
                              whileHover={{ y: -3 }}
                              transition={{ duration: 0.18 }}
                              onClick={() => toggleAddon(m.id)}
                              className={`relative flex flex-col rounded-2xl overflow-hidden cursor-pointer
                                border-2 transition-all duration-200 bg-cx-card
                                ${sel
                                  ? 'border-[#C41E3A] shadow-[0_0_0_3px_rgba(196,30,58,0.12),0_4px_20px_rgba(0,0,0,0.1)]'
                                  : 'border-cx-line hover:border-[#C41E3A]/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
                                }`}
                            >
                              <div className="relative aspect-[4/3] overflow-hidden bg-cx-muted">
                                <img
                                  src={m.image}
                                  alt={m.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                />
                                <AnimatePresence>
                                  {sel && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.5 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.5 }}
                                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#C41E3A]
                                        flex items-center justify-center
                                        shadow-[0_2px_8px_rgba(196,30,58,0.5)]"
                                    >
                                      <Check size={13} className="text-white" strokeWidth={3} />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <div className="p-3 flex flex-col gap-1.5">
                                <p className="text-[12.5px] font-bold text-cx-base line-clamp-2 leading-snug">
                                  {m.name}
                                </p>
                                <p className="text-[14px] font-extrabold text-[#C41E3A]">
                                  {fmt(m.price)}
                                </p>

                                {/* Qty stepper — visible only when selected */}
                                <AnimatePresence>
                                  {sel && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="overflow-hidden"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <div className="flex items-center justify-between pt-2 border-t border-cx-line mt-1">
                                        <span className="text-[10.5px] text-cx-soft font-medium">
                                          {t.mealModal.qty}
                                        </span>
                                        <div className="flex items-center rounded-lg overflow-hidden border border-cx-edge bg-cx-fill">
                                          <button
                                            type="button"
                                            onClick={() => changeAddonQty(m.id, -1)}
                                            className="w-7 h-7 flex items-center justify-center text-[#C41E3A]
                                              hover:bg-[#C41E3A]/10 transition-colors"
                                          >
                                            <Minus size={11} />
                                          </button>
                                          <span className="w-6 text-center text-[12px] font-bold text-cx-base">{qty}</span>
                                          <button
                                            type="button"
                                            onClick={() => changeAddonQty(m.id, 1)}
                                            className="w-7 h-7 flex items-center justify-center text-[#C41E3A]
                                              hover:bg-[#C41E3A]/10 transition-colors"
                                          >
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

              {/* Footer */}
              <div className="flex-shrink-0 border-t border-cx-line bg-cx-card px-5 py-4">
                {/* Grand total */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] text-cx-soft font-medium">{t.mealModal.subtotal}</span>
                  <span className="text-[20px] font-extrabold text-cx-base tracking-tight">
                    {fmt(grandTotal)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Back — prev add-on group, or back to step 1 if already on first */}
                  <button
                    type="button"
                    onClick={() => {
                      if (addonGroupIndex > 0) setAddonGroupIndex((i) => i - 1)
                      else setStep('select-meal')
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 border-cx-edge
                      text-[13px] font-bold text-cx-sub transition-all duration-200
                      hover:border-cx-muted hover:text-cx-base flex-shrink-0"
                  >
                    <ChevronLeft size={15} />
                    <span className="hidden sm:inline">
                      {addonGroupIndex > 0
                        ? addonGroups[addonGroupIndex - 1]?.label
                        : t.mealModal.back}
                    </span>
                  </button>

                  {/* Next group or add to cart */}
                  <button
                    type="button"
                    onClick={handleFooterAction}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                      bg-[#C41E3A] hover:bg-[#a01830] text-white font-extrabold text-[14px]
                      uppercase tracking-wide transition-all duration-200
                      hover:shadow-[0_6px_24px_rgba(196,30,58,0.45)] hover:-translate-y-0.5
                      active:translate-y-0"
                  >
                    {isLastGroup ? (
                      <>
                        <ShoppingCart size={15} />
                        <span>{t.mealModal.add}</span>
                      </>
                    ) : (
                      <>
                        <span>{addonGroups[addonGroupIndex + 1]?.label}</span>
                        <ChevronRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </>
  )
}
