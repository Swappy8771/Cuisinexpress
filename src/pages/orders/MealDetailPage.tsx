import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, ChevronRight, ArrowLeft, Check,
  Minus, Plus, Truck, FileText, ShoppingCart, User,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { meals, categories, weeks } from '../../lib/mockData'
import { fmt, TAG_CONFIG, DAYS, fmtWeekRange, fmtDeliveryDate } from '../../lib/menuConfig'
import type { DayName } from '../../lib/menuConfig'
import type { MealTag } from '../../types'
import { studentsService } from '../../services/studentsService'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import CategoryCarousel from '../../components/orders/CategoryCarousel'
import { useLang } from '../../contexts/LangContext'

export default function MealDetailPage() {
  const { t, lang } = useLang()
  const tagLabels: Record<MealTag, string> = {
    hot: t.menu.tagLabels.hot, cold: t.menu.tagLabels.cold,
    vegetarian: t.menu.tagLabels.vegetarian, vegan: t.menu.tagLabels.vegan,
    halal: t.menu.tagLabels.halal, 'gluten-free': t.menu.tagLabels['gluten-free'],
  }
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
        <p className="text-[18px] font-bold text-cx-base">{t.mealDetail.notFound}</p>
        <Link to="/commander" className="text-[#C41E3A] font-semibold hover:underline underline-offset-2">
          {t.mealDetail.backToMenuLink}
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
                <Home size={13} /> <span>{t.common.home}</span>
              </Link>
            </li>
            <li><ChevronRight size={12} /></li>
            <li>
              <Link to="/commander" className="hover:text-[#C41E3A] transition-colors"><span>{t.mealDetail.breadcrumb}</span></Link>
            </li>
            <li><ChevronRight size={12} /></li>
            <li className="text-cx-base font-medium truncate max-w-[160px]">{meal.name}</li>
          </ol>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[13px] text-cx-soft
            hover:text-[#C41E3A] font-semibold transition-colors group w-fit"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>{t.mealDetail.back}</span>
        </button>

        {/* ── Main meal card (compact) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
                        <Icon size={9} /> {tagLabels[tag]}
                      </span>
                    )
                  })}
                </div>
                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-[22px] font-extrabold text-[#C41E3A] tracking-tight">
                    {fmt(meal.price)}
                  </span>
                  <span className="text-[11px] text-cx-body">{t.mealDetail.perMeal}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Student + Day selector ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="bg-cx-card rounded-2xl border border-cx-line overflow-hidden
            shadow-[0_2px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_24px_rgba(0,0,0,0.4)]"
        >
          <div className="px-6 py-4 border-b border-cx-line">
            <h2 className="text-[16px] font-bold text-cx-base">
              {t.mealDetail.selectStudentDay}
            </h2>
          </div>

          <div className="px-4 sm:px-6 py-5 flex flex-col gap-6">

            {/* Student chips */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <span className="text-[12.5px] font-semibold text-cx-soft sm:w-16 sm:flex-shrink-0 sm:pt-1.5">
                {t.mealDetail.studentLabel}
              </span>
              {students.length === 0 ? (
                <div className="flex items-center gap-2 text-[13px] text-cx-soft">
                  <User size={14} />
                  <Link to="/user/students"
                    className="text-[#C41E3A] font-semibold hover:underline underline-offset-2">
                    {t.mealDetail.addStudent}
                  </Link>
                  <span> {t.mealDetail.toContinue}</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {students.map((s) => {
                    const active = selectedStudent === s.id
                    return (
                      <button type="button"
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
                        <span>{s.firstName}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Week + Day */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <span className="text-[12.5px] font-semibold text-cx-soft sm:w-16 sm:flex-shrink-0 sm:pt-1.5">
                {t.mealDetail.dayLabel}
              </span>
              <div className="flex flex-col gap-3 flex-1">
                {/* Week selector */}
                <div className="flex flex-wrap gap-2">
                  {weeks.map((w) => (
                    <button type="button"
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
                    {fmtWeekRange(selectedWeek.startDate, selectedWeek.endDate, lang)}
                  </p>
                )}

                {/* Day chips */}
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => {
                    const active = selectedDay === day
                    const label = t.menu.dayLabels[day]
                    return (
                      <button type="button"
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
                        <span>{label}</span>
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
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="bg-cx-card rounded-2xl border border-cx-line overflow-hidden
            shadow-[0_2px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_24px_rgba(0,0,0,0.4)]"
        >
          <div className="px-6 py-4 border-b border-cx-line">
            <h2 className="text-[16px] font-bold text-cx-base">{t.mealDetail.summary}</h2>
          </div>

          <div className="px-6 py-5 flex flex-col gap-0 divide-y divide-cx-line">

            {/* ── Current selection ── */}
            {/* Main meal row */}
            <div className="flex items-center gap-4 py-4">
              <div className="flex items-center rounded-xl overflow-hidden border border-cx-edge bg-cx-fill flex-shrink-0">
                <button type="button"
                  onClick={() => setMainQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="w-7 text-center text-[14px] font-bold text-cx-base">{mainQty}</span>
                <button type="button"
                  onClick={() => setMainQty((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>
              <span className="flex-1 text-[14px] font-semibold text-cx-base">{meal.name}</span>
              <span className="text-[13px] text-cx-soft font-medium flex-shrink-0">{fmt(meal.price)} {t.mealDetail.each}</span>
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
                  <button type="button"
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
                {t.mealDetail.willBeServed}{' '}
                <span className="font-bold text-cx-base">
                  {selectedWeek
                    ? fmtDeliveryDate(selectedWeek.startDate, selectedDay, t.menu.dayLabels[selectedDay], lang)
                    : t.menu.dayLabels[selectedDay].toLowerCase()}
                </span>
                {student && (
                  <> {t.mealDetail.forStudent} <span className="font-bold text-cx-base">{student.firstName} {student.lastName}</span></>
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
                placeholder={t.mealDetail.notePlaceholder}
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
                    {t.mealDetail.currentCart}
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
                        <button type="button"
                          onClick={() => updateQty(item.key ?? item.meal.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-6 text-center text-[12px] font-bold text-cx-base">{item.quantity}</span>
                        <button type="button"
                          onClick={() => updateQty(item.key ?? item.meal.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <span className="text-[13px] text-cx-soft font-medium w-16 text-right flex-shrink-0">
                        {fmt(item.meal.price * item.quantity)}
                      </span>
                      <button type="button"
                        onClick={() => removeItem(item.key ?? item.meal.id)}
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
                {cartItems.length > 0 ? t.mealDetail.totalWithCart : t.mealDetail.total}
              </span>
              <span className="text-[22px] font-extrabold text-cx-base tracking-tight">
                {fmt(grandTotal)}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 pb-6">
            <button type="button"
              onClick={handleAddToCart}
              disabled={!meal.available}
              className="w-full flex items-center justify-center gap-2.5
                bg-[#C41E3A] hover:bg-[#a01830] disabled:bg-cx-muted disabled:text-cx-soft
                text-white font-bold text-[14px] tracking-widest uppercase
                py-4 rounded-2xl transition-all duration-300
                hover:shadow-[0_8px_28px_rgba(196,30,58,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingCart size={17} />
              <span>{t.mealDetail.addToCart}</span>
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
