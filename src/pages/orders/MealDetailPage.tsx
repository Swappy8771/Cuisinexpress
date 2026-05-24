import { useState, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, ChevronRight, ArrowLeft, Heart, Check,
  ChevronLeft, ChevronRight as ChevronRightIcon,
  Minus, Plus, Truck, FileText, ShoppingCart, User,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { meals, categories, weeks } from '../../lib/mockData'
import { fmt, TAG_CONFIG, DAYS, fmtWeekRange, fmtDeliveryDate } from '../../lib/menuConfig'
import type { DayName } from '../../lib/menuConfig'
import { studentsService } from '../../services/studentsService'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import type { Meal } from '../../types'

/* ── Mini add-on card ─────────────────────────────────────────── */
function AddonCard({
  meal, selected, onToggle,
}: { meal: Meal; selected: boolean; onToggle: () => void }) {
  const [isFav, setIsFav] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={onToggle}
      className={`relative flex-shrink-0 w-36 cursor-pointer rounded-2xl overflow-hidden
        border-2 transition-all duration-200 group
        bg-cx-card shadow-[0_2px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]
        ${selected
          ? 'border-[#C41E3A] shadow-[0_0_0_3px_rgba(196,30,58,0.12)]'
          : 'border-cx-line hover:border-cx-edge'}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cx-muted">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108"
          style={{ transform: 'scale(1)' }}
        />

        {/* Selected overlay */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#C41E3A]/15 flex items-center justify-center"
            >
              <div className="w-8 h-8 rounded-full bg-[#C41E3A] flex items-center justify-center shadow-lg">
                <Check size={14} className="text-white" strokeWidth={3} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Favourite */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsFav((f) => !f) }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm
            flex items-center justify-center shadow
            opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Heart size={11} className={isFav ? 'fill-[#C41E3A] text-[#C41E3A]' : 'text-cx-soft'} />
        </button>
      </div>

      {/* Body */}
      <div className="p-2.5">
        <p className="text-[11.5px] font-semibold text-cx-base line-clamp-2 leading-snug mb-1.5">
          {meal.name}
        </p>
        <p className="text-[13px] font-extrabold text-[#C41E3A]">{fmt(meal.price)}</p>
      </div>
    </motion.div>
  )
}

/* ── Horizontal carousel ──────────────────────────────────────── */
function CategoryCarousel({
  label, items, selectedIds, onToggle,
}: { label: string; items: Meal[]; selectedIds: Set<string>; onToggle: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * 220, behavior: 'smooth' })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <h3 className="text-[17px] font-bold text-cx-base">{label}</h3>
        <span className="text-[13px] text-cx-soft">({items.length} disponibles)</span>
      </div>

      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll(-1)}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10
            w-8 h-8 rounded-full bg-cx-card border border-cx-edge
            shadow-[0_2px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)]
            flex items-center justify-center text-cx-soft hover:text-cx-base
            hover:border-cx-muted transition-all duration-200"
        >
          <ChevronLeft size={15} />
        </button>

        {/* Scroll container */}
        <div
          ref={ref}
          className="flex gap-3 overflow-x-auto pb-1 px-0.5
            [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((m) => (
            <AddonCard
              key={m.id}
              meal={m}
              selected={selectedIds.has(m.id)}
              onToggle={() => onToggle(m.id)}
            />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll(1)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10
            w-8 h-8 rounded-full bg-cx-card border border-cx-edge
            shadow-[0_2px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)]
            flex items-center justify-center text-cx-soft hover:text-cx-base
            hover:border-cx-muted transition-all duration-200"
        >
          <ChevronRightIcon size={15} />
        </button>
      </div>
    </div>
  )
}

/* ── Main page ────────────────────────────────────────────────── */
export default function MealDetailPage() {
  const { mealId } = useParams<{ mealId: string }>()
  const navigate   = useNavigate()
  const meal       = meals.find((m) => m.id === mealId)
  const { addItem, updateQty, removeItem, items: cartItems } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: studentsService.list,
    enabled: isAuthenticated,
  })

  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [selectedWeekId,  setSelectedWeekId]  = useState(weeks[0]?.id ?? '')
  const [selectedDay,     setSelectedDay]     = useState<DayName>('Lundi')
  const [selectedAddons,  setSelectedAddons]  = useState<Set<string>>(new Set())
  const [mainQty,         setMainQty]         = useState(1)
  const [note,            setNote]            = useState('')

  if (!meal) {
    return (
      <div className="min-h-screen bg-cx-page flex flex-col items-center justify-center gap-4">
        <p className="text-[18px] font-bold text-cx-base">Repas introuvable.</p>
        <Link to="/commander" className="text-[#C41E3A] font-semibold hover:underline underline-offset-2">
          ← Retour au menu
        </Link>
      </div>
    )
  }

  const category = categories.find((c) => c.id === meal.categoryId)

  /* Group other available meals by category */
  const otherMeals = meals.filter((m) => m.id !== meal.id && m.available)
  const addonGroups = categories
    .filter((c) => c.id !== '')
    .map((c) => ({ ...c, items: otherMeals.filter((m) => m.categoryId === c.id) }))
    .filter((g) => g.items.length > 0)

  const selectedWeek = weeks.find((w) => w.id === selectedWeekId)

  const toggleAddon = (id: string) =>
    setSelectedAddons((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })

  const selectedAddonMeals = meals.filter((m) => selectedAddons.has(m.id))
  const selectionTotal = meal.price * mainQty + selectedAddonMeals.reduce((s, m) => s + m.price, 0)
  const cartTotal      = cartItems.reduce((s, i) => s + i.meal.price * i.quantity, 0)
  const grandTotal     = selectionTotal + cartTotal
  const student        = students.find((s) => s.id === selectedStudent)

  const handleAddToCart = () => {
    for (let i = 0; i < mainQty; i++) addItem(meal)
    selectedAddonMeals.forEach((m) => addItem(m))
    navigate('/panier')
  }

  return (
    <div className="min-h-screen bg-cx-page transition-colors duration-300">

      {/* ── Breadcrumb ── */}
      <div className="w-full bg-cx-card border-b border-cx-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1.5 text-[13px] text-cx-soft">
            <li>
              <Link to="/" className="flex items-center gap-1 hover:text-[#C41E3A] transition-colors">
                <Home size={13} /> Accueil
              </Link>
            </li>
            <li><ChevronRight size={12} /></li>
            <li>
              <Link to="/commander" className="hover:text-[#C41E3A] transition-colors">Commander</Link>
            </li>
            <li><ChevronRight size={12} /></li>
            <li className="text-cx-base font-medium truncate max-w-[160px]">{meal.name}</li>
          </ol>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[13px] text-cx-soft
            hover:text-[#C41E3A] font-semibold transition-colors group w-fit"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Retour au menu
        </button>

        {/* ── Main meal card (compact) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-cx-card rounded-2xl border border-cx-line overflow-hidden
            shadow-[0_2px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_24px_rgba(0,0,0,0.4)]"
        >
          <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />
          <div className="flex gap-5 p-5">
            {/* Image */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden bg-cx-muted flex-shrink-0">
              <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div>
                {category && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[13px]">{category.emoji}</span>
                    <span className="text-[11px] font-bold text-cx-soft uppercase tracking-wider">
                      {category.label}
                    </span>
                  </div>
                )}
                <h1 className="text-[20px] sm:text-[24px] font-extrabold text-cx-base
                  leading-tight tracking-tight line-clamp-2">
                  {meal.name}
                </h1>
                <p className="text-[12.5px] text-cx-soft mt-1.5 line-clamp-2 leading-relaxed">
                  {meal.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {meal.tags.slice(0, 3).map((tag) => {
                    const cfg = TAG_CONFIG[tag]
                    const Icon = cfg.icon
                    return (
                      <span key={tag}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                          text-[10.5px] font-semibold bg-cx-fill border border-cx-edge ${cfg.color}`}>
                        <Icon size={9} /> {cfg.label}
                      </span>
                    )
                  })}
                </div>
                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-[22px] font-extrabold text-[#C41E3A] tracking-tight">
                    {fmt(meal.price)}
                  </span>
                  <span className="text-[11px] text-cx-body">/repas</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Student + Day selector ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="bg-cx-card rounded-2xl border border-cx-line overflow-hidden
            shadow-[0_2px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_24px_rgba(0,0,0,0.4)]"
        >
          <div className="px-6 py-4 border-b border-cx-line">
            <h2 className="text-[16px] font-bold text-cx-base">
              Sélectionner l'élève et la journée
            </h2>
          </div>

          <div className="px-6 py-5 flex flex-col gap-6">

            {/* Student chips */}
            <div className="flex items-start gap-4">
              <span className="text-[12.5px] font-semibold text-cx-soft w-16 flex-shrink-0 pt-1.5">
                Élève
              </span>
              {students.length === 0 ? (
                <div className="flex items-center gap-2 text-[13px] text-cx-soft">
                  <User size={14} />
                  <Link to="/user/students"
                    className="text-[#C41E3A] font-semibold hover:underline underline-offset-2">
                    Ajouter un élève
                  </Link>
                  pour continuer
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {students.map((s) => {
                    const active = selectedStudent === s.id
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStudent(active ? null : s.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                          text-[13px] font-semibold border-2 transition-all duration-200
                          ${active
                            ? 'bg-[#F59E0B] border-[#F59E0B] text-white shadow-[0_2px_10px_rgba(245,158,11,0.35)]'
                            : 'bg-cx-fill border-cx-edge text-cx-sub hover:border-[#F59E0B]/50 hover:text-cx-base'
                          }`}
                      >
                        {active && <Check size={12} strokeWidth={3} />}
                        {s.firstName}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Week + Day */}
            <div className="flex items-start gap-4">
              <span className="text-[12.5px] font-semibold text-cx-soft w-16 flex-shrink-0 pt-1.5">
                Journée
              </span>
              <div className="flex flex-col gap-3 flex-1">
                {/* Week selector */}
                <div className="flex flex-wrap gap-2">
                  {weeks.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWeekId(w.id)}
                      className={`px-3 py-1 rounded-lg text-[12px] font-semibold border transition-all duration-200
                        ${selectedWeekId === w.id
                          ? 'bg-cx-base text-cx-card border-cx-base'
                          : 'bg-cx-fill border-cx-edge text-cx-soft hover:border-cx-muted hover:text-cx-base'
                        }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>

                {/* Week range label */}
                {selectedWeek && (
                  <p className="text-[12px] text-cx-soft font-medium">
                    {fmtWeekRange(selectedWeek.startDate, selectedWeek.endDate)}
                  </p>
                )}

                {/* Day chips */}
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => {
                    const active = selectedDay === day
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                          text-[13px] font-semibold border-2 transition-all duration-200
                          ${active
                            ? 'bg-[#F59E0B] border-[#F59E0B] text-white shadow-[0_2px_10px_rgba(245,158,11,0.35)]'
                            : 'bg-cx-fill border-cx-edge text-cx-sub hover:border-[#F59E0B]/50 hover:text-cx-base'
                          }`}
                      >
                        {active && <Check size={12} strokeWidth={3} />}
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Add-on carousels ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="flex flex-col gap-8 px-4"
        >
          {addonGroups.map((group) => (
            <CategoryCarousel
              key={group.id}
              label={group.label}
              items={group.items}
              selectedIds={selectedAddons}
              onToggle={toggleAddon}
            />
          ))}
        </motion.div>

        {/* ── Order summary ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="bg-cx-card rounded-2xl border border-cx-line overflow-hidden
            shadow-[0_2px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_24px_rgba(0,0,0,0.4)]"
        >
          <div className="px-6 py-4 border-b border-cx-line">
            <h2 className="text-[16px] font-bold text-cx-base">Résumé de votre sélection</h2>
          </div>

          <div className="px-6 py-5 flex flex-col gap-0 divide-y divide-cx-line">

            {/* ── Current selection ── */}
            {/* Main meal row */}
            <div className="flex items-center gap-4 py-4">
              <div className="flex items-center rounded-xl overflow-hidden border border-cx-edge bg-cx-fill flex-shrink-0">
                <button
                  onClick={() => setMainQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#C41E3A] hover:bg-[#FFF0F2] transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="w-7 text-center text-[14px] font-bold text-cx-base">{mainQty}</span>
                <button
                  onClick={() => setMainQty((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#C41E3A] hover:bg-[#FFF0F2] transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>
              <span className="flex-1 text-[14px] font-semibold text-cx-base">{meal.name}</span>
              <span className="text-[13px] text-cx-soft font-medium flex-shrink-0">{fmt(meal.price)} /ch.</span>
            </div>

            {/* Selected add-ons */}
            <AnimatePresence>
              {selectedAddonMeals.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 py-4 overflow-hidden"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-cx-line">
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="flex-1 text-[13.5px] font-semibold text-cx-base">{m.name}</span>
                  <span className="text-[13px] text-cx-soft font-medium">{fmt(m.price)}</span>
                  <button
                    onClick={() => toggleAddon(m.id)}
                    className="w-6 h-6 rounded-full border border-cx-edge flex items-center justify-center
                      text-cx-faint hover:text-red-500 hover:border-red-300 transition-all duration-200 text-[15px] leading-none"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Delivery info */}
            <div className="flex items-center gap-3 py-4">
              <div className="w-8 h-8 rounded-full bg-cx-fill border border-cx-edge flex items-center justify-center flex-shrink-0">
                <Truck size={14} className="text-cx-soft" />
              </div>
              <p className="text-[13.5px] text-cx-body">
                Sera servi{' '}
                <span className="font-bold text-cx-base">
                  {selectedWeek ? fmtDeliveryDate(selectedWeek.startDate, selectedDay) : selectedDay.toLowerCase()}
                </span>
                {student && (
                  <> pour <span className="font-bold text-cx-base">{student.firstName} {student.lastName}</span></>
                )}
              </p>
            </div>

            {/* Note */}
            <div className="flex items-center gap-3 py-4">
              <div className="w-8 h-8 rounded-full bg-cx-fill border border-cx-edge flex items-center justify-center flex-shrink-0">
                <FileText size={14} className="text-cx-soft" />
              </div>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ajouter une note ou instruction…"
                className="flex-1 bg-transparent text-[13.5px] text-cx-base placeholder:text-cx-faint outline-none"
              />
            </div>

            {/* ── Existing cart items ── */}
            <AnimatePresence>
              {cartItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-4 flex flex-col gap-0 divide-y divide-cx-line"
                >
                  <p className="text-[11px] font-bold text-cx-soft uppercase tracking-widest pb-3">
                    Panier actuel
                  </p>
                  {cartItems.map((item) => (
                    <div key={item.meal.id} className="flex items-center gap-3 py-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-cx-line">
                        <img src={item.meal.image} alt={item.meal.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="flex-1 text-[13px] font-semibold text-cx-base line-clamp-1">
                        {item.meal.name}
                      </span>
                      {/* Qty control */}
                      <div className="flex items-center rounded-lg overflow-hidden border border-cx-edge bg-cx-fill flex-shrink-0">
                        <button
                          onClick={() => updateQty(item.meal.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-[#C41E3A] hover:bg-[#FFF0F2] transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-6 text-center text-[12px] font-bold text-cx-base">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.meal.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#C41E3A] hover:bg-[#FFF0F2] transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <span className="text-[13px] text-cx-soft font-medium w-16 text-right flex-shrink-0">
                        {fmt(item.meal.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.meal.id)}
                        className="w-6 h-6 rounded-full border border-cx-edge flex items-center justify-center
                          text-cx-faint hover:text-red-500 hover:border-red-300 transition-all duration-200 text-[15px] leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Total */}
            <div className="flex items-center justify-between gap-3 pt-4 pb-1">
              <span className="text-[13px] text-cx-soft">
                {cartItems.length > 0 ? 'Total (sélection + panier)' : 'Total'}
              </span>
              <span className="text-[22px] font-extrabold text-cx-base tracking-tight">
                {fmt(grandTotal)}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 pb-6">
            <button
              onClick={handleAddToCart}
              disabled={!meal.available}
              className="w-full flex items-center justify-center gap-2.5
                bg-[#C41E3A] hover:bg-[#a01830] disabled:bg-cx-muted disabled:text-cx-soft
                text-white font-bold text-[14px] tracking-widest uppercase
                py-4 rounded-2xl transition-all duration-300
                hover:shadow-[0_8px_28px_rgba(196,30,58,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingCart size={17} />
              Ajouter à votre panier
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
