import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft,
  ShoppingBag, Tag, Calendar, User, Pencil,
} from 'lucide-react'
import { useCartStore, selectCartTotal, selectCartCount } from '../../store/cartStore'
import DayOrderModal from '../../components/orders/DayOrderModal'
import { mealsService } from '../../services/mealsService'
import type { CartItem } from '../../types'
import type { DayName } from '../../lib/menuConfig'
import woodTexture from '../../assets/wooden-texture.png'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(n)

// Nested grouping: student → days within that student
function groupByStudentThenDay(items: CartItem[]) {
  const studentMap = new Map<string, {
    studentKey: string
    name: string
    student: CartItem['student']
    days: Map<string, { dayKey: string; day: DayName; weekId: string; label: string; items: CartItem[] }>
  }>()

  for (const item of items) {
    const sKey = item.student?.id ?? '__unassigned'
    const name = item.student
      ? `${item.student.firstName} ${item.student.lastName}`
      : 'Commande générale'

    if (!studentMap.has(sKey)) {
      studentMap.set(sKey, { studentKey: sKey, name, student: item.student, days: new Map() })
    }
    const sg = studentMap.get(sKey)!

    const dKey = item.delivery ? `${item.delivery.weekId}__${item.delivery.day}` : '__noday'
    if (!sg.days.has(dKey)) {
      sg.days.set(dKey, {
        dayKey: dKey,
        day: (item.delivery?.day ?? '') as DayName,
        weekId: item.delivery?.weekId ?? '',
        label: item.delivery?.formattedDate ?? 'Sans date',
        items: [],
      })
    }
    sg.days.get(dKey)!.items.push(item)
  }

  return [...studentMap.values()].map((sg) => ({
    ...sg,
    days: [...sg.days.values()],
  }))
}

type EditTarget = {
  student: NonNullable<CartItem['student']>
  day: DayName
  weekId: string
}

export default function CartPage() {
  const items      = useCartStore((s) => s.items)
  const total      = useCartStore(selectCartTotal)
  const count      = useCartStore(selectCartCount)
  const updateQty  = useCartStore((s) => s.updateQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart  = useCartStore((s) => s.clearCart)
  const navigate   = useNavigate()

  const [editTarget, setEditTarget] = useState<EditTarget | null>(null)

  const TAX_RATE   = 0.14975
  const taxes      = total * TAX_RATE
  const grandTotal = total + taxes

  const studentGroups = groupByStudentThenDay(items)

  // Reference data for the edit modal
  const { data: schools = [] } = useQuery({
    queryKey: ['ordering-schools'],
    queryFn: mealsService.getSchools,
  })
  const { data: categories = [] } = useQuery({
    queryKey: ['ordering-categories'],
    queryFn: mealsService.getCategories,
  })
  const { data: modalMeals = [] } = useQuery({
    queryKey: ['meals-modal', editTarget?.weekId],
    queryFn: () => mealsService.getMeals({ weekId: editTarget!.weekId }),
    enabled: !!editTarget,
  })

  const groupSubtotal = (groupItems: CartItem[]) =>
    groupItems.reduce((s, i) => s + i.meal.price * i.quantity, 0)

  // Clear a student's items for a specific day then open the edit modal
  const startEdit = (target: EditTarget, dayItems: CartItem[]) => {
    dayItems.forEach((i) => removeItem(i.key ?? i.meal.id))
    setEditTarget(target)
  }

  return (
    <div className="min-h-screen bg-cx-page transition-colors duration-300">

      {/* ── Wood page header ── */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundImage: `url('${woodTexture}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/62" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[13.5px] text-white/70 hover:text-white
              transition-colors font-medium"
          >
            <ArrowLeft size={16} />
            Retour
          </button>
          <div className="h-5 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#C41E3A]" />
            <h1 className="text-[17px] font-extrabold text-white">Mon panier</h1>
            {count > 0 && (
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5
                rounded-full bg-[#C41E3A] text-white text-[11px] font-bold">
                {count}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">

        {/* Empty state */}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#C41E3A]/10 flex items-center justify-center mb-6">
              <ShoppingBag size={32} className="text-[#C41E3A]" strokeWidth={1.5} />
            </div>
            <h2 className="text-[20px] font-bold text-cx-base mb-2">Votre panier est vide</h2>
            <p className="text-cx-soft text-[14px] mb-8 max-w-xs">
              Parcourez notre menu et ajoutez des repas pour vos enfants.
            </p>
            <Link
              to="/commander"
              className="inline-flex items-center gap-2 bg-[#C41E3A] hover:bg-[#a01830]
                text-white font-semibold text-[14px] px-6 py-3 rounded-full
                transition-all duration-200 hover:shadow-[0_4px_20px_rgba(196,30,58,0.35)]"
            >
              <ShoppingCart size={15} />
              Voir le menu
            </Link>
          </motion.div>
        )}

        {items.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 items-start">

            {/* ── Items grouped by student, then day ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-8">

              {/* List header */}
              <div className="flex items-center justify-between">
                <p className="text-[15px] text-cx-soft font-semibold">
                  {count} repas sélectionné{count > 1 ? 's' : ''}
                </p>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1.5 text-[14px] text-cx-soft
                    hover:text-[#C41E3A] transition-colors"
                >
                  <Trash2 size={14} />
                  Vider le panier
                </button>
              </div>

              {studentGroups.map((sg) => (
                <div key={sg.studentKey} className="flex flex-col gap-4">

                  {/* ── Student heading ── */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl
                      bg-[#7B2535]/10 border border-[#7B2535]/25">
                      <User size={15} className="text-[#7B2535]" />
                      <span className="text-[15px] font-extrabold text-[#7B2535]">{sg.name}</span>
                    </div>
                    <div className="flex-1 h-px bg-cx-line" />
                  </div>

                  {/* ── Day groups — each is its own card ── */}
                  {sg.days.map((dg) => (
                    <div key={dg.dayKey}
                      className="bg-cx-card rounded-2xl border border-cx-line
                        shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">

                      {/* Card header: date + Modifier button */}
                      <div className="flex items-center justify-between gap-3
                        px-5 py-4 border-b border-cx-line bg-cx-fill">
                        <div className="flex items-center gap-2">
                          <Calendar size={15} className="text-[#C41E3A]" />
                          <span className="text-[15px] font-bold text-cx-base capitalize">
                            {dg.label}
                          </span>
                        </div>

                        {sg.student && dg.weekId && (
                          <button
                            onClick={() => startEdit(
                              { student: sg.student!, day: dg.day, weekId: dg.weekId },
                              dg.items
                            )}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
                              text-[13px] font-bold border-2 border-[#7B2535]/30 text-[#7B2535]
                              hover:bg-[#7B2535] hover:text-white hover:border-[#7B2535]
                              transition-all duration-200"
                          >
                            <Pencil size={13} />
                            Modifier la commande
                          </button>
                        )}
                      </div>

                      {/* Items for this student+day */}
                      <AnimatePresence initial={false}>
                        {dg.items.map((item) => {
                          const key = item.key ?? item.meal.id
                          return (
                            <motion.div
                              key={key}
                              layout
                              initial={{ opacity: 0, x: -16 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 16, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="border-b border-cx-line last:border-b-0"
                            >
                              <div className="flex items-center gap-4 px-5 py-4">

                                {/* Image */}
                                <div className="flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden bg-cx-muted">
                                  <img
                                    src={item.meal.image}
                                    alt={item.meal.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                  />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-[16px] font-bold text-cx-base truncate">
                                    {item.meal.name}
                                  </p>
                                  <p className="text-[14px] font-semibold text-[#C41E3A] mt-0.5">
                                    {fmt(item.meal.price)} / repas
                                  </p>
                                </div>

                                {/* Price + controls */}
                                <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
                                  <p className="text-[17px] font-extrabold text-cx-base">
                                    {fmt(item.meal.price * item.quantity)}
                                  </p>

                                  {item.isAddon ? (
                                    /* Add-on: full qty stepper + remove */
                                    <>
                                      <div className="flex items-center gap-1 bg-cx-fill rounded-xl p-1">
                                        <button
                                          onClick={() => updateQty(key, -1)}
                                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                            text-cx-soft hover:bg-[#C41E3A]/10 hover:text-[#C41E3A]
                                            transition-colors duration-150"
                                        >
                                          <Minus size={14} />
                                        </button>
                                        <span className="w-8 text-center text-[15px] font-bold text-cx-base">
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() => updateQty(key, +1)}
                                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                            text-cx-soft hover:bg-[#C41E3A]/10 hover:text-[#C41E3A]
                                            transition-colors duration-150"
                                        >
                                          <Plus size={14} />
                                        </button>
                                      </div>
                                      <button
                                        onClick={() => removeItem(key)}
                                        className="text-cx-faint hover:text-red-500 transition-colors p-1"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </>
                                  ) : (
                                    /* Main meal: fixed × 1 — use "Modifier la commande" to change */
                                    <span className="px-3 py-1.5 rounded-xl bg-cx-fill border border-cx-edge
                                      text-[13px] font-bold text-cx-soft">
                                      × 1 repas
                                    </span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>

                      {/* Day subtotal — inside card footer */}
                      <div className="flex justify-end px-5 py-3 border-t border-cx-line bg-cx-fill/50">
                        <span className="text-[14px] text-cx-soft">
                          {dg.label} :{' '}
                          <span className="font-extrabold text-cx-base text-[15px]">
                            {fmt(groupSubtotal(dg.items))}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Continue shopping */}
              <Link
                to="/commander"
                className="flex items-center gap-2 text-[15px] text-[#C41E3A]
                  font-semibold hover:underline underline-offset-2 w-fit"
              >
                <Plus size={15} />
                Ajouter d'autres repas
              </Link>
            </div>

            {/* ── Order summary ── */}
            <div className="w-full lg:w-[360px] xl:w-[380px] flex-shrink-0">
              {/* Vertical divider — desktop only */}
              <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-cx-line
                -translate-x-5 xl:-translate-x-7 pointer-events-none" />

              <div className="bg-cx-card rounded-2xl border border-cx-line
                shadow-[0_4px_32px_rgba(0,0,0,0.10)] overflow-hidden sticky top-[96px]">

                {/* Summary header */}
                <div className="px-6 py-5 border-b border-cx-line bg-cx-fill">
                  <h2 className="text-[18px] font-extrabold text-cx-base">Récapitulatif</h2>
                </div>

                {/* Line items by student */}
                <div className="px-6 py-5 flex flex-col gap-5 max-h-72 overflow-y-auto">
                  {studentGroups.map((sg) => (
                    <div key={sg.studentKey} className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-1.5 pb-1 border-b border-cx-line">
                        <User size={13} className="text-[#7B2535]" />
                        <span className="text-[13px] font-extrabold text-[#7B2535] uppercase tracking-wide">
                          {sg.name}
                        </span>
                      </div>
                      {sg.days.map((dg) =>
                        dg.items.map((item) => (
                          <div key={item.key ?? item.meal.id} className="flex items-center justify-between gap-3 pl-2">
                            <p className="text-[14px] text-cx-body truncate flex-1">
                              <span className="font-bold text-cx-base">{item.quantity}×</span>{' '}
                              {item.meal.name}
                            </p>
                            <p className="text-[14px] font-semibold text-cx-base flex-shrink-0">
                              {fmt(item.meal.price * item.quantity)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  ))}
                </div>

                <div className="px-6 py-4 border-t border-cx-line flex flex-col gap-3">
                  <div className="flex justify-between text-[15px]">
                    <span className="text-cx-soft">Sous-total</span>
                    <span className="font-semibold text-cx-base">{fmt(total)}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-cx-soft flex items-center gap-1">
                      <Tag size={12} />
                      TPS + TVQ (14,975 %)
                    </span>
                    <span className="font-semibold text-cx-base">{fmt(taxes)}</span>
                  </div>
                  <div className="mt-1 pt-3 border-t border-cx-line flex justify-between">
                    <span className="text-[17px] font-extrabold text-cx-base">Total</span>
                    <span className="text-[17px] font-extrabold text-[#C41E3A]">{fmt(grandTotal)}</span>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <button
                    className="w-full bg-[#C41E3A] hover:bg-[#a01830] text-white font-bold
                      text-[16px] py-4 rounded-xl transition-all duration-200
                      hover:shadow-[0_4px_20px_rgba(196,30,58,0.4)] active:scale-[0.98]"
                  >
                    Passer la commande
                  </button>
                  <p className="mt-3 text-center text-[13px] text-cx-soft">
                    Paiement sécurisé · Visa / Mastercard / Interac
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Mobile sticky checkout */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-cx-card border-t border-cx-line
          shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] text-cx-soft font-medium">Total (TPS + TVQ)</span>
              <span className="text-[18px] font-extrabold text-[#C41E3A] leading-none">{fmt(grandTotal)}</span>
            </div>
            <span className="text-[12px] text-cx-soft">{fmt(taxes)} taxes</span>
          </div>
          <button
            className="w-full bg-[#C41E3A] hover:bg-[#a01830] text-white font-bold
              text-[14px] py-3 rounded-xl transition-all duration-200
              hover:shadow-[0_4px_20px_rgba(196,30,58,0.4)] active:scale-[0.98]"
          >
            Passer la commande
          </button>
        </div>
      )}

      {/* ── Edit modal — reopens the full wizard for one child + one day ── */}
      <AnimatePresence>
        {editTarget && (
          <DayOrderModal
            day={editTarget.day}
            weekId={editTarget.weekId}
            meals={modalMeals}
            categories={categories}
            students={[editTarget.student]}
            schools={schools}
            onClose={() => setEditTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
