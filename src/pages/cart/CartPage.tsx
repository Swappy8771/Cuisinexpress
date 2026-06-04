import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft,
  ShoppingBag, Tag, Calendar, User,
} from 'lucide-react'
import { useCartStore, selectCartTotal, selectCartCount } from '../../store/cartStore'
import type { CartItem } from '../../types'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(n)

// Group cart items by student, preserving insertion order
function groupByStudent(items: CartItem[]) {
  const map = new Map<string, { name: string; items: CartItem[] }>()

  for (const item of items) {
    const key = item.student?.id ?? '__unassigned'
    const name = item.student
      ? `${item.student.firstName} ${item.student.lastName}`
      : 'Commande générale'
    if (!map.has(key)) map.set(key, { name, items: [] })
    map.get(key)!.items.push(item)
  }

  return [...map.values()]
}

export default function CartPage() {
  const items      = useCartStore((s) => s.items)
  const total      = useCartStore(selectCartTotal)
  const count      = useCartStore(selectCartCount)
  const updateQty  = useCartStore((s) => s.updateQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart  = useCartStore((s) => s.clearCart)
  const navigate   = useNavigate()

  const TAX_RATE   = 0.14975
  const taxes      = total * TAX_RATE
  const grandTotal = total + taxes

  const studentGroups = groupByStudent(items)

  const groupSubtotal = (groupItems: CartItem[]) =>
    groupItems.reduce((s, i) => s + i.meal.price * i.quantity, 0)

  return (
    <div className="min-h-screen bg-cx-page transition-colors duration-300">

      {/* Page header */}
      <div className="bg-cx-card border-b border-cx-line shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[13.5px] text-cx-soft hover:text-[#C41E3A]
              transition-colors font-medium"
          >
            <ArrowLeft size={16} />
            Retour
          </button>
          <div className="h-5 w-px bg-cx-edge" />
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#C41E3A]" />
            <h1 className="text-[17px] font-extrabold text-cx-base">Mon panier</h1>
            {count > 0 && (
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5
                rounded-full bg-[#C41E3A] text-white text-[11px] font-bold">
                {count}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">

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
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* ── Item list grouped by student ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">

              {/* List header */}
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-cx-soft font-medium">
                  {count} repas sélectionné{count > 1 ? 's' : ''}
                </p>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1.5 text-[12.5px] text-cx-soft
                    hover:text-[#C41E3A] transition-colors"
                >
                  <Trash2 size={13} />
                  Vider le panier
                </button>
              </div>

              {/* Student groups */}
              {studentGroups.map((group, gi) => (
                <div key={gi} className="flex flex-col gap-3">

                  {/* Student header */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                      bg-[#7B2535]/8 border border-[#7B2535]/20">
                      <User size={13} className="text-[#7B2535]" />
                      <span className="text-[12.5px] font-extrabold text-[#7B2535]">
                        {group.name}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-cx-line" />
                    <span className="text-[11px] text-cx-faint font-medium">
                      {group.items.reduce((s, i) => s + i.quantity, 0)} repas
                    </span>
                  </div>

                  {/* Items for this student */}
                  <AnimatePresence initial={false}>
                    {group.items.map((item) => {
                      const key = item.key ?? item.meal.id
                      return (
                        <motion.div
                          key={key}
                          layout
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.25 }}
                          className="bg-cx-card rounded-2xl border border-cx-line
                            shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden"
                        >
                          <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-4">

                            {/* Image */}
                            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-cx-muted">
                              <img
                                src={item.meal.image}
                                alt={item.meal.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-[14.5px] font-bold text-cx-base truncate">
                                {item.meal.name}
                              </p>
                              {item.delivery && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Calendar size={11} className="text-cx-faint" />
                                  <span className="text-[11.5px] text-cx-soft capitalize">
                                    {item.delivery.formattedDate}
                                  </span>
                                </div>
                              )}
                              <p className="text-[13px] font-semibold text-[#C41E3A] mt-1">
                                {fmt(item.meal.price)} / repas
                              </p>
                            </div>

                            {/* Right: qty + subtotal + remove */}
                            <div className="flex flex-col items-end gap-3 flex-shrink-0">
                              <p className="text-[15px] font-extrabold text-cx-base">
                                {fmt(item.meal.price * item.quantity)}
                              </p>

                              <div className="flex items-center gap-1 bg-cx-fill rounded-xl p-1">
                                <button
                                  onClick={() => updateQty(key, -1)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg
                                    text-cx-soft hover:bg-[#C41E3A]/10 hover:text-[#C41E3A]
                                    transition-colors duration-150"
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="w-7 text-center text-[13.5px] font-bold text-cx-base">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQty(key, +1)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg
                                    text-cx-soft hover:bg-[#C41E3A]/10 hover:text-[#C41E3A]
                                    transition-colors duration-150"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>

                              <button
                                onClick={() => removeItem(key)}
                                className="text-cx-faint hover:text-[#C41E3A] transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>

                  {/* Student subtotal */}
                  <div className="flex justify-end pr-1">
                    <span className="text-[12px] text-cx-soft">
                      Sous-total {group.name} :{' '}
                      <span className="font-bold text-cx-base">
                        {fmt(groupSubtotal(group.items))}
                      </span>
                    </span>
                  </div>
                </div>
              ))}

              {/* Continue shopping */}
              <Link
                to="/commander"
                className="flex items-center gap-2 text-[13px] text-[#C41E3A]
                  font-semibold hover:underline underline-offset-2 w-fit"
              >
                <Plus size={14} />
                Ajouter d'autres repas
              </Link>
            </div>

            {/* ── Order summary ── */}
            <div className="w-full sm:w-full lg:w-80 flex-shrink-0">
              <div className="bg-cx-card rounded-2xl border border-cx-line
                shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden sticky top-[96px]">

                <div className="px-6 py-4 border-b border-cx-line">
                  <h2 className="text-[15px] font-extrabold text-cx-base">Récapitulatif</h2>
                </div>

                {/* Summary by student */}
                <div className="px-6 py-4 flex flex-col gap-4 max-h-72 overflow-y-auto">
                  {studentGroups.map((group, gi) => (
                    <div key={gi} className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <User size={11} className="text-[#7B2535]" />
                        <span className="text-[11px] font-extrabold text-[#7B2535] uppercase tracking-wide">
                          {group.name}
                        </span>
                      </div>
                      {group.items.map((item) => (
                        <div key={item.key ?? item.meal.id} className="flex items-center justify-between gap-3">
                          <p className="text-[12.5px] text-cx-soft truncate flex-1">
                            <span className="font-semibold text-cx-base">{item.quantity}×</span>{' '}
                            {item.meal.name}
                          </p>
                          <p className="text-[12.5px] font-semibold text-cx-base flex-shrink-0">
                            {fmt(item.meal.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="px-6 py-4 border-t border-cx-line flex flex-col gap-2.5">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-cx-soft">Sous-total</span>
                    <span className="font-semibold text-cx-base">{fmt(total)}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-cx-soft flex items-center gap-1">
                      <Tag size={11} />
                      TPS + TVQ (14,975 %)
                    </span>
                    <span className="font-semibold text-cx-base">{fmt(taxes)}</span>
                  </div>
                  <div className="mt-2 pt-3 border-t border-cx-line flex justify-between">
                    <span className="text-[15px] font-extrabold text-cx-base">Total</span>
                    <span className="text-[15px] font-extrabold text-[#C41E3A]">{fmt(grandTotal)}</span>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <button
                    className="w-full bg-[#C41E3A] hover:bg-[#a01830] text-white font-bold
                      text-[14.5px] py-3.5 rounded-xl transition-all duration-200
                      hover:shadow-[0_4px_20px_rgba(196,30,58,0.4)] active:scale-[0.98]"
                  >
                    Passer la commande
                  </button>
                  <p className="mt-3 text-center text-[11.5px] text-cx-soft">
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
    </div>
  )
}
