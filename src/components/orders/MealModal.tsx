import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ChevronLeft, ChevronRight, Minus, Plus,
  ShoppingCart, SkipForward, Check, Calendar, Zap,
} from 'lucide-react'
import type { Meal, MenuCategory, MealTag, DeliveryInfo } from '../../types'
import { fmt, TAG_CONFIG, DAYS, fmtWeekRange, fmtDeliveryDate } from '../../lib/menuConfig'
import type { DayName } from '../../lib/menuConfig'
import { meals as allMeals, weeks } from '../../lib/mockData'
import { useCartStore } from '../../store/cartStore'
import { useLang } from '../../contexts/LangContext'
import { useNavigate } from 'react-router-dom'

interface Props {
  meals: Meal[]
  index: number
  categories: MenuCategory[]
  onClose: () => void
  onNavigate: (index: number) => void
}

/* ── Addon grid card ── */
function AddonGridCard({
  meal,
  selected,
  qty,
  onToggle,
  onChangeQty,
  tagLabels,
  unavailableLabel,
  qtyLabel,
}: {
  meal: Meal
  selected: boolean
  qty: number
  onToggle: () => void
  onChangeQty: (delta: number) => void
  tagLabels: Record<MealTag, string>
  unavailableLabel: string
  qtyLabel: string
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      onClick={onToggle}
      className={`relative flex flex-col rounded-2xl overflow-hidden cursor-pointer
        border-2 transition-all duration-200 bg-cx-card
        ${selected
          ? 'border-[#C41E3A] shadow-[0_0_0_3px_rgba(196,30,58,0.12),0_4px_20px_rgba(0,0,0,0.1)]'
          : 'border-cx-line hover:border-[#C41E3A]/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
        }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cx-muted">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />

        {/* Selected checkmark badge */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full
                bg-[#C41E3A] flex items-center justify-center
                shadow-[0_2px_8px_rgba(196,30,58,0.5)]"
            >
              <Check size={13} className="text-white" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unavailable overlay */}
        {!meal.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-cx-card text-cx-soft text-[11px] font-bold px-3 py-1 rounded-full">
              {unavailableLabel}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <p className="text-[12.5px] font-bold text-cx-base line-clamp-2 leading-snug">
          {meal.name}
        </p>
        <p className="text-[15px] font-extrabold text-[#C41E3A] tracking-tight">
          {fmt(meal.price)}
        </p>

        {/* Tags */}
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

        {/* Qty stepper — shown only when selected */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mt-1 pt-2 border-t border-cx-line">
                <span className="text-[10.5px] text-cx-soft font-medium">{qtyLabel}</span>
                <div className="flex items-center rounded-lg overflow-hidden border border-cx-edge bg-cx-fill">
                  <button
                    type="button"
                    onClick={() => onChangeQty(-1)}
                    className="w-7 h-7 flex items-center justify-center text-[#C41E3A]
                      hover:bg-[#C41E3A]/10 transition-colors"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="w-6 text-center text-[12px] font-bold text-cx-base">{qty}</span>
                  <button
                    type="button"
                    onClick={() => onChangeQty(1)}
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
}

/* ── Inner content — key={meal.id} resets state on meal change ── */
function ModalContent({
  meal,
  categories,
  currentIndex,
  total,
  hasPrev,
  hasNext,
  onBack,
  onSkip,
  onAdd,
  onDirectCheckout,
}: {
  meal: Meal
  categories: MenuCategory[]
  currentIndex: number
  total: number
  hasPrev: boolean
  hasNext: boolean
  onBack: () => void
  onSkip: () => void
  onAdd: (addonQtys: Map<string, number>, mainQty: number, delivery: DeliveryInfo) => void
  onDirectCheckout: (mainQty: number, delivery: DeliveryInfo) => void
}) {
  const { t, lang } = useLang()
  const tagLabels: Record<MealTag, string> = {
    hot: t.menu.tagLabels.hot,
    cold: t.menu.tagLabels.cold,
    vegetarian: t.menu.tagLabels.vegetarian,
    vegan: t.menu.tagLabels.vegan,
    halal: t.menu.tagLabels.halal,
    'gluten-free': t.menu.tagLabels['gluten-free'],
  }

  const [addonQtys, setAddonQtys] = useState<Map<string, number>>(new Map())
  const [mainQty, setMainQty] = useState(1)
  const [addonGroupIndex, setAddonGroupIndex] = useState(0)
  const [selectedWeekId, setSelectedWeekId] = useState(weeks[0]?.id ?? '')
  const firstAvailableDay = (meal.availableDays?.find((d) => DAYS.includes(d as DayName)) as DayName | undefined) ?? 'Lundi'
  const [selectedDay, setSelectedDay] = useState<DayName>(firstAvailableDay)

  const selectedWeek = weeks.find((w) => w.id === selectedWeekId)
  const category = categories.find((c) => c.id === meal.categoryId)

  const otherMeals = allMeals.filter((m) => m.id !== meal.id && m.available)
  const addonGroups = categories
    .filter((c) => c.id !== '')
    .map((c) => ({ ...c, items: otherMeals.filter((m) => m.categoryId === c.id) }))
    .filter((g) => g.items.length > 0)

  const activeGroup = addonGroups[addonGroupIndex] ?? null
  const hasPrevGroup = addonGroupIndex > 0
  const hasNextGroup = addonGroupIndex < addonGroups.length - 1

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

  const selectedAddonMeals = allMeals.filter((m) => addonQtys.has(m.id))
  const selectionTotal =
    meal.price * mainQty +
    selectedAddonMeals.reduce((s, m) => s + m.price * (addonQtys.get(m.id) ?? 1), 0)

  const totalSelectedAddons = Array.from(addonQtys.values()).reduce((s, v) => s + v, 0)

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ── */}
      <div className="relative px-5 pt-5 pb-4 flex-shrink-0">
        {/* Counter row */}
        <div className="flex items-center justify-between mb-3">
          {category && (
            <span className="text-[11px] font-extrabold text-[#C41E3A] uppercase tracking-widest">
              {category.emoji} {category.label}
            </span>
          )}
          <span className="text-[11px] text-cx-faint font-medium">
            {currentIndex + 1} / {total}
          </span>
        </div>

        {/* Image + info side by side */}
        <div className="flex gap-4">
          {/* Meal image */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-cx-muted flex-shrink-0 border border-cx-line">
            <img
              src={meal.image}
              alt={meal.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>

          {/* Text info */}
          <div className="flex flex-col justify-between min-w-0 flex-1 pr-6">
            <div>
              <h2 className="text-[18px] sm:text-[21px] font-extrabold text-cx-base leading-tight tracking-tight">
                {meal.name}
              </h2>
              <p className="text-[12px] text-cx-soft line-clamp-2 leading-relaxed mt-1">
                {meal.description}
              </p>
            </div>
            <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
              <span className="text-[21px] font-extrabold text-[#C41E3A] tracking-tight leading-none">
                {fmt(meal.price)}
              </span>
              {/* Qty control */}
              <div className="flex items-center rounded-xl overflow-hidden border border-cx-edge bg-cx-fill">
                <button
                  type="button"
                  onClick={() => setMainQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-colors"
                >
                  <Minus size={12} />
                </button>
                <span className="w-7 text-center text-[13px] font-bold text-cx-base">{mainQty}</span>
                <button
                  type="button"
                  onClick={() => setMainQty((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-colors"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tags + delivery day row */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {meal.tags.slice(0, 3).map((tag) => {
            const cfg = TAG_CONFIG[tag]
            const Icon = cfg.icon
            return (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                  text-[10.5px] font-semibold bg-cx-fill border border-cx-edge ${cfg.color}`}
              >
                <Icon size={9} /> {tagLabels[tag]}
              </span>
            )
          })}
          {/* Delivery day tag */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
            text-[10.5px] font-semibold bg-[#C41E3A]/10 border border-[#C41E3A]/25 text-[#C41E3A]">
            <Calendar size={9} />
            {selectedWeek
              ? fmtDeliveryDate(selectedWeek.startDate, selectedDay, t.menu.dayLabels[selectedDay], lang)
              : t.menu.dayLabels[selectedDay]}
          </span>
        </div>

        {/* ── Week + Day selector ── */}
        <div className="mt-4 flex flex-col gap-3">
          {/* Week pills */}
          <div className="flex flex-wrap gap-2">
            {weeks.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setSelectedWeekId(w.id)}
                className={`px-3 py-1 rounded-lg text-[11.5px] font-semibold border transition-all duration-200
                  ${selectedWeekId === w.id
                    ? 'bg-cx-base text-cx-card border-cx-base'
                    : 'bg-cx-fill border-cx-edge text-cx-soft hover:border-cx-muted hover:text-cx-base'
                  }`}
              >
                {w.label}
                {selectedWeek && selectedWeekId === w.id && (
                  <span className="ml-1.5 text-[10px] opacity-70">
                    {fmtWeekRange(w.startDate, w.endDate, lang)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Day chips */}
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => {
              const active = selectedDay === day
              const label = t.menu.dayLabels[day]
              const shortLabel = label.slice(0, 3)
              const disabled = !!(meal.availableDays && !meal.availableDays.includes(day))
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && setSelectedDay(day)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full
                    text-[12px] font-bold border-2 transition-all duration-200
                    ${disabled
                      ? 'bg-cx-fill border-cx-edge text-cx-faint opacity-35 cursor-not-allowed'
                      : active
                        ? 'bg-[#C41E3A] border-[#C41E3A] text-white shadow-[0_2px_10px_rgba(196,30,58,0.3)]'
                        : 'bg-cx-fill border-cx-edge text-cx-sub hover:border-[#C41E3A]/40 hover:text-cx-base'
                    }`}
                >
                  {active && !disabled && <Check size={11} strokeWidth={3} />}
                  <span className="sm:hidden">{shortLabel}</span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mt-4">
          {Array.from({ length: Math.min(total, 10) }).map((_, i) => {
            const isActive = total <= 10
              ? i === currentIndex
              : i === Math.round(currentIndex / (total - 1) * 9)
            return (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-[#C41E3A]' : 'bg-cx-edge'
                }`}
              />
            )
          })}
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto border-t border-cx-line">

        {/* ── Add-on section ── */}
        {addonGroups.length > 0 && activeGroup && (
          <div className="px-6 py-5 flex flex-col gap-4">

            {/* Section title + category tabs */}
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-extrabold text-cx-base uppercase tracking-wider">
                {t.mealModal.extrasTitle}
              </p>
              {totalSelectedAddons > 0 && (
                <span className="text-[11px] font-bold text-[#C41E3A]">
                  {totalSelectedAddons} {totalSelectedAddons > 1 ? t.mealModal.selectedPlural : t.mealModal.selected}
                </span>
              )}
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-1 px-1">
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
                      <span className={`w-4 h-4 rounded-full text-[10px] font-extrabold flex items-center justify-center
                        ${i === addonGroupIndex ? 'bg-white text-[#C41E3A]' : 'bg-[#C41E3A] text-white'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Grid of addon cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGroup.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              >
                {activeGroup.items.map((m) => (
                  <AddonGridCard
                    key={m.id}
                    meal={m}
                    selected={addonQtys.has(m.id)}
                    qty={addonQtys.get(m.id) ?? 1}
                    onToggle={() => toggleAddon(m.id)}
                    onChangeQty={(delta) => changeAddonQty(m.id, delta)}
                    tagLabels={tagLabels}
                    unavailableLabel={t.mealModal.unavailable}
                    qtyLabel={t.mealModal.qty}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

                {/* Group counter */}
            {addonGroups.length > 1 && (
              <div className="flex justify-center">
                <span className="text-[11px] text-cx-faint font-medium">
                  {addonGroupIndex + 1} / {addonGroups.length}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Selected summary (compact) ── */}
        <AnimatePresence>
          {selectedAddonMeals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-cx-line px-6 py-4 flex flex-col gap-2"
            >
              <p className="text-[11px] font-extrabold text-cx-soft uppercase tracking-widest mb-1">
                {t.mealModal.subtotal}
              </p>
              {selectedAddonMeals.map((m) => {
                const qty = addonQtys.get(m.id) ?? 1
                return (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-cx-line bg-cx-muted">
                      <img
                        src={m.image}
                        alt={m.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>
                    <span className="flex-1 text-[13px] font-semibold text-cx-base line-clamp-1">{m.name}</span>
                    <span className="text-[12px] text-cx-soft">×{qty}</span>
                    <span className="text-[13px] font-bold text-cx-base w-14 text-right flex-shrink-0">
                      {fmt(m.price * qty)}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleAddon(m.id)}
                      className="w-5 h-5 rounded-full border border-cx-edge flex items-center justify-center
                        text-cx-faint hover:text-red-500 hover:border-red-300 transition-all text-[13px]"
                    >
                      ×
                    </button>
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <div className="flex-shrink-0 border-t border-cx-line bg-cx-card px-5 py-4">
        {/* Total row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] text-cx-soft font-medium">{t.mealModal.subtotal}</span>
          <span className="text-[20px] font-extrabold text-cx-base tracking-tight">
            {fmt(selectionTotal)}
          </span>
        </div>

        {/* Direct checkout button */}
        <button
          type="button"
          onClick={() => {
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
            onDirectCheckout(mainQty, delivery)
          }}
          disabled={!meal.available}
          className="w-full flex items-center justify-center gap-2 py-2 mb-2 rounded-xl
            border-2 border-[#C41E3A]/40 text-[#C41E3A] font-bold text-[13px]
            hover:bg-[#C41E3A]/8 hover:border-[#C41E3A] transition-all duration-200
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Zap size={14} />
          <span>{t.mealModal.directCheckout}</span>
        </button>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Back — goes to prev addon group, or prev meal if already on first */}
          <button
            type="button"
            onClick={() => {
              if (hasPrevGroup) setAddonGroupIndex((i) => i - 1)
              else onBack()
            }}
            disabled={!hasPrevGroup && !hasPrev}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 border-cx-edge
              text-[13px] font-bold text-cx-sub transition-all duration-200
              hover:border-cx-muted hover:text-cx-base
              disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            <ChevronLeft size={15} />
            <span className="hidden sm:inline">
              {hasPrevGroup ? addonGroups[addonGroupIndex - 1].label : t.mealModal.back}
            </span>
          </button>

          {/* Skip — goes to next addon group, or next meal if on last group */}
          <button
            type="button"
            onClick={() => {
              if (hasNextGroup) setAddonGroupIndex((i) => i + 1)
              else onSkip()
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 border-cx-edge
              text-[13px] font-bold text-cx-sub transition-all duration-200
              hover:border-cx-muted hover:text-cx-base flex-shrink-0"
          >
            <SkipForward size={14} />
            <span>
              {hasNextGroup
                ? addonGroups[addonGroupIndex + 1].label
                : hasNext ? t.mealModal.skip : t.mealModal.close}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
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
              onAdd(addonQtys, mainQty, delivery)
            }}
            disabled={!meal.available}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
              bg-[#C41E3A] hover:bg-[#a01830] text-white font-extrabold text-[14px]
              uppercase tracking-wide transition-all duration-200
              hover:shadow-[0_6px_24px_rgba(196,30,58,0.45)] hover:-translate-y-0.5
              active:translate-y-0 disabled:bg-cx-muted disabled:text-cx-soft
              disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
          >
            <ShoppingCart size={15} />
            <span>{t.mealModal.add}</span>
            {hasNext && <ChevronRight size={14} className="opacity-80" />}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main modal shell ── */
export default function MealModal({
  meals,
  index,
  categories,
  onClose,
  onNavigate,
}: Props) {
  const { addItem } = useCartStore()
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const meal = meals[index]
  if (!meal) return null

  const hasPrev = index > 0
  const hasNext = index < meals.length - 1

  const handleAdd = (addonQtys: Map<string, number>, qty: number, delivery: DeliveryInfo) => {
    for (let i = 0; i < qty; i++) addItem(meal, delivery)
    addonQtys.forEach((addonQty, id) => {
      const m = allMeals.find((x) => x.id === id)
      if (m) for (let i = 0; i < addonQty; i++) addItem(m, delivery)
    })
    if (hasNext) onNavigate(index + 1)
    else onClose()
  }

  const handleSkip = () => {
    if (hasNext) onNavigate(index + 1)
    else onClose()
  }

  const handleBack = () => {
    if (hasPrev) onNavigate(index - 1)
  }

  const handleDirectCheckout = (qty: number, delivery: DeliveryInfo) => {
    for (let i = 0; i < qty; i++) addItem(meal, delivery)
    onClose()
    navigate('/panier')
  }

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

      {/* Panel — wider to fit 3-col grid, with red glow border */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-4 top-[3%] bottom-[3%]
          sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2
          sm:w-full sm:max-w-2xl
          z-50 bg-cx-card rounded-3xl overflow-hidden flex flex-col
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
              justify-center text-cx-soft hover:text-cx-base hover:border-[#C41E3A]/50
              hover:text-[#C41E3A] transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content — key resets state on meal change */}
        <ModalContent
          key={meal.id}
          meal={meal}
          categories={categories}
          currentIndex={index}
          total={meals.length}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onBack={handleBack}
          onSkip={handleSkip}
          onAdd={handleAdd}
          onDirectCheckout={handleDirectCheckout}
        />
      </motion.div>
    </>
  )
}
