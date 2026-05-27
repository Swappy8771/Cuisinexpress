import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ChevronLeft, ChevronRight, Minus, Plus,
  ShoppingCart, SkipForward,
} from 'lucide-react'
import type { Meal, MenuCategory, MealTag } from '../../types'
import { fmt, TAG_CONFIG } from '../../lib/menuConfig'
import { meals as allMeals } from '../../lib/mockData'
import { useCartStore } from '../../store/cartStore'
import { useLang } from '../../contexts/LangContext'
import CategoryCarousel from './CategoryCarousel'

interface Props {
  meals: Meal[]
  index: number
  categories: MenuCategory[]
  onClose: () => void
  onNavigate: (index: number) => void
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
}: {
  meal: Meal
  categories: MenuCategory[]
  currentIndex: number
  total: number
  hasPrev: boolean
  hasNext: boolean
  onBack: () => void
  onSkip: () => void
  onAdd: (addonQtys: Map<string, number>, mainQty: number) => void
}) {
  const { t } = useLang()
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

  const category = categories.find((c) => c.id === meal.categoryId)

  const otherMeals = allMeals.filter((m) => m.id !== meal.id && m.available)
  const addonGroups = categories
    .filter((c) => c.id !== '')
    .map((c) => ({ ...c, items: otherMeals.filter((m) => m.categoryId === c.id) }))
    .filter((g) => g.items.length > 0)

  const activeGroup = addonGroups[addonGroupIndex] ?? null
  const hasPrevGroup = addonGroupIndex > 0
  const hasNextGroup = addonGroupIndex < addonGroups.length - 1

  // Toggle: first click adds with qty 1; clicking again removes
  const toggleAddon = (id: string) =>
    setAddonQtys((prev) => {
      const next = new Map(prev)
      next.has(id) ? next.delete(id) : next.set(id, 1)
      return next
    })

  const changeAddonQty = (id: string, delta: number) =>
    setAddonQtys((prev) => {
      const next = new Map(prev)
      const current = next.get(id) ?? 0
      const updated = current + delta
      if (updated <= 0) next.delete(id)
      else next.set(id, updated)
      return next
    })

  // Derive a Set of selected IDs for CategoryCarousel
  const selectedAddonIds = new Set(addonQtys.keys())
  const selectedAddonMeals = allMeals.filter((m) => addonQtys.has(m.id))
  const selectionTotal =
    meal.price * mainQty +
    selectedAddonMeals.reduce((s, m) => s + m.price * (addonQtys.get(m.id) ?? 1), 0)

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-cx-line flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Progress dots */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(total, 8) }).map((_, i) => {
              const isActive = total <= 8
                ? i === currentIndex
                : i === Math.round(currentIndex / (total - 1) * 7)
              return (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-4 h-2 bg-[#C41E3A]'
                      : 'w-2 h-2 bg-cx-edge'
                  }`}
                />
              )
            })}
          </div>
          <span className="text-[12px] text-cx-soft font-medium ml-1">
            {currentIndex + 1} / {total}
          </span>
        </div>

        <button
          type="button"
          onClick={() => { /* handled by parent close */ }}
          className="w-8 h-8 rounded-full bg-cx-fill border border-cx-edge flex items-center
            justify-center text-cx-soft hover:text-cx-base hover:border-cx-muted transition-all
            data-[close]:flex"
          data-close
        >
          <X size={14} />
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Meal hero */}
        <div className="flex gap-4 p-5">
          {/* Image */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-cx-muted flex-shrink-0">
            <img
              src={meal.image}
              alt={meal.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center gap-1.5 min-w-0">
            {category && (
              <div className="flex items-center gap-1.5">
                <span className="text-[13px]">{category.emoji}</span>
                <span className="text-[11px] font-bold text-cx-soft uppercase tracking-wider">
                  {category.label}
                </span>
              </div>
            )}
            <h2 className="text-[18px] sm:text-[20px] font-extrabold text-cx-base leading-tight">
              {meal.name}
            </h2>
            <p className="text-[12px] text-cx-soft line-clamp-2 leading-relaxed">
              {meal.description}
            </p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {meal.tags.slice(0, 3).map((tag) => {
                  const cfg = TAG_CONFIG[tag]
                  const Icon = cfg.icon
                  return (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                        text-[10px] font-semibold bg-cx-fill border border-cx-edge ${cfg.color}`}
                    >
                      <Icon size={9} /> {tagLabels[tag]}
                    </span>
                  )
                })}
              </div>
              <span className="text-[20px] font-extrabold text-[#C41E3A] tracking-tight">
                {fmt(meal.price)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Add-on carousels — one category at a time ── */}
        {addonGroups.length > 0 && activeGroup && (
          <div className="border-t border-cx-line px-5 py-5 flex flex-col gap-4">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {addonGroups.map((group, i) => {
                const selectedCount = group.items.filter((m) => addonQtys.has(m.id)).length
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setAddonGroupIndex(i)}
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                      text-[12px] font-semibold border transition-all duration-200
                      ${i === addonGroupIndex
                        ? 'bg-[#C41E3A] border-[#C41E3A] text-white shadow-[0_2px_10px_rgba(196,30,58,0.3)]'
                        : 'bg-cx-fill border-cx-edge text-cx-sub hover:border-cx-muted hover:text-cx-base'
                      }`}
                  >
                    <span>{group.emoji}</span>
                    <span>{group.label}</span>
                    {selectedCount > 0 && (
                      <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center
                        ${i === addonGroupIndex ? 'bg-white text-[#C41E3A]' : 'bg-[#C41E3A] text-white'}`}>
                        {selectedCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Active category carousel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGroup.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                <CategoryCarousel
                  label={activeGroup.label}
                  items={activeGroup.items}
                  selectedIds={selectedAddonIds}
                  onToggle={toggleAddon}
                />
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next group navigation */}
            {addonGroups.length > 1 && (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setAddonGroupIndex((i) => i - 1)}
                  disabled={!hasPrevGroup}
                  className="flex items-center gap-1 text-[12px] font-semibold text-cx-soft
                    hover:text-cx-base transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                  {addonGroupIndex > 0 ? addonGroups[addonGroupIndex - 1].label : ''}
                </button>
                <span className="text-[11px] text-cx-faint">
                  {addonGroupIndex + 1} / {addonGroups.length}
                </span>
                <button
                  type="button"
                  onClick={() => setAddonGroupIndex((i) => i + 1)}
                  disabled={!hasNextGroup}
                  className="flex items-center gap-1 text-[12px] font-semibold text-cx-soft
                    hover:text-cx-base transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {addonGroupIndex < addonGroups.length - 1 ? addonGroups[addonGroupIndex + 1].label : ''}
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Selection summary ── */}
        <div className="border-t border-cx-line px-5 py-4 flex flex-col gap-0 divide-y divide-cx-line">
          {/* Main meal row */}
          <div className="flex items-center gap-3 py-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-cx-line bg-cx-muted">
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
            <span className="flex-1 text-[13px] font-semibold text-cx-base line-clamp-1">
              {meal.name}
            </span>
            {/* Qty control */}
            <div className="flex items-center rounded-lg overflow-hidden border border-cx-edge bg-cx-fill flex-shrink-0">
              <button
                type="button"
                onClick={() => setMainQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center text-[#C41E3A]
                  hover:bg-[#C41E3A]/10 transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="w-7 text-center text-[13px] font-bold text-cx-base">
                {mainQty}
              </span>
              <button
                type="button"
                onClick={() => setMainQty((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center text-[#C41E3A]
                  hover:bg-[#C41E3A]/10 transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
            <span className="text-[12px] text-cx-soft font-medium w-14 text-right flex-shrink-0">
              {fmt(meal.price * mainQty)}
            </span>
          </div>

          {/* Selected add-ons */}
          <AnimatePresence>
            {selectedAddonMeals.map((m) => {
              const qty = addonQtys.get(m.id) ?? 1
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 py-3 overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-cx-line bg-cx-muted">
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                  <span className="flex-1 text-[13px] font-semibold text-cx-base line-clamp-1">
                    {m.name}
                  </span>
                  {/* Qty control */}
                  <div className="flex items-center rounded-lg overflow-hidden border border-cx-edge bg-cx-fill flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => changeAddonQty(m.id, -1)}
                      className="w-8 h-8 flex items-center justify-center text-[#C41E3A]
                        hover:bg-[#C41E3A]/10 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-7 text-center text-[13px] font-bold text-cx-base">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeAddonQty(m.id, 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#C41E3A]
                        hover:bg-[#C41E3A]/10 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-[12px] text-cx-soft font-medium w-14 text-right flex-shrink-0">
                    {fmt(m.price * qty)}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleAddon(m.id)}
                    className="w-6 h-6 rounded-full border border-cx-edge flex items-center
                      justify-center text-cx-faint hover:text-red-500 hover:border-red-300
                      transition-all duration-200 text-[15px] leading-none flex-shrink-0"
                  >
                    ×
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Total */}
          <div className="flex items-center justify-between pt-3 pb-1">
            <span className="text-[12px] text-cx-soft">Sous-total</span>
            <span className="text-[18px] font-extrabold text-cx-base tracking-tight">
              {fmt(selectionTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Footer action bar ── */}
      <div className="flex-shrink-0 border-t border-cx-line bg-cx-card px-5 py-4">
        <div className="flex items-center gap-2">
          {/* Back */}
          <button
            type="button"
            onClick={onBack}
            disabled={!hasPrev}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-cx-edge
              text-[13px] font-semibold text-cx-sub transition-all duration-200
              hover:border-cx-muted hover:text-cx-base
              disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            <ChevronLeft size={15} />
            <span className="hidden sm:inline">Retour</span>
          </button>

          {/* Skip */}
          <button
            type="button"
            onClick={onSkip}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-cx-edge
              text-[13px] font-semibold text-cx-sub transition-all duration-200
              hover:border-cx-muted hover:text-cx-base flex-shrink-0"
          >
            <SkipForward size={14} />
            <span>{hasNext ? 'Passer' : 'Fermer'}</span>
          </button>

          {/* Add to cart */}
          <button
            type="button"
            onClick={() => onAdd(addonQtys, mainQty)}
            disabled={!meal.available}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
              bg-[#C41E3A] hover:bg-[#a01830] text-white font-bold text-[13.5px]
              tracking-wide uppercase transition-all duration-200
              hover:shadow-[0_6px_20px_rgba(196,30,58,0.35)] hover:-translate-y-0.5
              active:translate-y-0 disabled:bg-cx-muted disabled:text-cx-soft
              disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
          >
            <ShoppingCart size={15} />
            <span>Ajouter</span>
            {hasNext && (
              <ChevronRight size={14} className="opacity-70" />
            )}
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

  // Lock body scroll
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

  const meal = meals[index]
  if (!meal) return null

  const hasPrev = index > 0
  const hasNext = index < meals.length - 1

  const handleAdd = (addonQtys: Map<string, number>, qty: number) => {
    for (let i = 0; i < qty; i++) addItem(meal)
    addonQtys.forEach((addonQty, id) => {
      const m = allMeals.find((x) => x.id === id)
      if (m) for (let i = 0; i < addonQty; i++) addItem(m)
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

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-4 top-[4%] bottom-[4%]
          sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2
          sm:w-full sm:max-w-xl
          z-50 bg-cx-card rounded-3xl overflow-hidden flex flex-col
          shadow-[0_24px_80px_rgba(0,0,0,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button overlay */}
        <div className="absolute top-4 right-5 z-10">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cx-fill border border-cx-edge flex items-center
              justify-center text-cx-soft hover:text-cx-base hover:border-cx-muted transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content — key resets local state (addons, qty) on meal change */}
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
        />
      </motion.div>
    </>
  )
}
