import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Plus, Minus, ShoppingCart, Flame, Star, CheckCircle2 } from 'lucide-react'
import type { Meal, Allergy, MenuCategory, MealTag } from '../../types'
import { fmt, TAG_CONFIG, DAYS } from '../../lib/menuConfig'
import type { DayName } from '../../lib/menuConfig'
import { useCartStore } from '../../store/cartStore'
import { useLang } from '../../contexts/LangContext'

interface Props {
  meal: Meal
  allergies: Allergy[]
  categories: MenuCategory[]
  onOpen?: () => void
}

export default function MealCard({ meal, allergies, categories, onOpen }: Props) {
  const navigate = useNavigate()
  const handleOpen = () => onOpen ? onOpen() : navigate(`/commander/${meal.id}`)
  const { t } = useLang()
  const tagLabels: Record<MealTag, string> = {
    hot: t.menu.tagLabels.hot, cold: t.menu.tagLabels.cold,
    vegetarian: t.menu.tagLabels.vegetarian, vegan: t.menu.tagLabels.vegan,
    halal: t.menu.tagLabels.halal, 'gluten-free': t.menu.tagLabels['gluten-free'],
  }
  const [isFav, setIsFav] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, updateQty, getQty } = useCartStore()
  const qty = getQty(meal.id)

  const category = categories.find((c) => c.id === meal.categoryId)
  const mealAllergies = allergies.filter((a) => meal.allergyIds.includes(a.id))


  const handleAdd = () => {
    if (!meal.available) return
    addItem(meal)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35 }}
      whileHover={meal.available ? { y: -4 } : {}}
      className={`group bg-cx-card rounded-2xl overflow-hidden border border-cx-line
        shadow-[0_2px_16px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]
        transition-shadow duration-300 flex flex-col ${!meal.available ? 'opacity-70' : ''}`}
    >
      {/* Image — click navigates to detail */}
      <div
        className="relative aspect-[4/3] overflow-hidden bg-cx-muted cursor-pointer"
        onClick={handleOpen}
      >
        <motion.img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover"
          whileHover={meal.available ? { scale: 1.06 } : {}}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          onError={(e) => {
            const img = e.target as HTMLImageElement
            img.style.display = 'none'
            const parent = img.parentElement
            if (parent) parent.classList.add('flex', 'items-center', 'justify-center', 'bg-gradient-to-br', 'from-cx-muted', 'to-cx-fill')
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Top badges row */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {meal.isNew && (
            <span className="px-2.5 py-1 bg-[#C41E3A] text-white text-[10px] font-bold
              tracking-wider uppercase rounded-full shadow-lg">
              {t.mealCard.new}
            </span>
          )}
          {meal.popular && (
            <span className="px-2.5 py-1 bg-[#F59E0B] text-white text-[10px] font-bold
              tracking-wider uppercase rounded-full shadow-lg flex items-center gap-1">
              <Star size={9} className="fill-white" />
              {t.mealCard.popular}
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsFav(!isFav) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm
            flex items-center justify-center shadow-md
            opacity-0 group-hover:opacity-100 transition-all duration-200
            hover:scale-110 active:scale-95"
        >
          <Heart
            size={15}
            className={isFav ? 'fill-[#C41E3A] text-[#C41E3A]' : 'text-cx-soft'}
          />
        </button>

        {/* Unavailable ribbon */}
        {!meal.available && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-cx-card text-cx-base text-[12px] font-bold px-4 py-1.5
              rounded-full shadow-lg">
              {t.mealCard.unavailable}
            </span>
          </div>
        )}

        {/* Day availability chips on image */}
        {meal.availableDays && meal.availableDays.length > 0 && meal.availableDays.length < 5 && meal.available && (
          <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1">
            {DAYS.map((day) => {
              const active = meal.availableDays!.includes(day)
              const short = t.menu.dayLabels[day as DayName].slice(0, 3)
              return active ? (
                <span
                  key={day}
                  className="inline-flex items-center px-1.5 py-0.5 rounded-md
                    text-[9.5px] font-extrabold tracking-wide
                    bg-[#C41E3A] text-white shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
                >
                  {short}
                </span>
              ) : null
            })}
          </div>
        )}

        {/* Calories */}
        {meal.calories && meal.available && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1
            bg-black/50 backdrop-blur-sm text-white text-[10.5px] font-semibold
            px-2 py-1 rounded-full">
            <Flame size={9} />
            {meal.calories} kcal
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-4 gap-2.5">

        {/* Category chip */}
        {category && category.id && (
          <div className="flex items-center gap-1.5">
            <span className="text-[13px]">{category.emoji}</span>
            <span className="text-[11.5px] font-semibold text-cx-soft uppercase tracking-wide">
              {category.label}
            </span>
          </div>
        )}

        {/* Title */}
        <h3
          className="text-[15px] font-bold text-cx-base leading-snug line-clamp-1
            hover:text-[#C41E3A] transition-colors cursor-pointer"
          onClick={handleOpen}
        >
          {meal.name}
        </h3>

        {/* Description */}
        <p className="text-[12.5px] text-cx-soft leading-relaxed line-clamp-2 flex-1">
          {meal.description}
        </p>

        {/* Tag chips */}
        {meal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {meal.tags.slice(0, 3).map((tag) => {
              const cfg = TAG_CONFIG[tag]
              const Icon = cfg.icon
              return (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                    text-[10.5px] font-semibold ${cfg.cardColor}`}
                >
                  <Icon size={9} />
                  {tagLabels[tag]}
                </span>
              )
            })}
          </div>
        )}

        {/* Allergy badges */}
        {mealAllergies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {mealAllergies.map((a) => (
              <span
                key={a.id}
                title={a.label}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                  text-[10.5px] font-semibold ring-1 ${a.colorClass}`}
              >
                {a.emoji} {a.label}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3 mt-auto pt-2 border-t border-cx-line">
          <div>
            <span className="text-[20px] font-extrabold text-cx-base tracking-tight">
              {fmt(meal.price)}
            </span>
            <span className="text-[11px] text-cx-body ml-1">{t.mealCard.perMeal}</span>
          </div>

          <AnimatePresence mode="wait">
            {qty === 0 ? (
              <motion.button
                key="add"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleAdd}
                disabled={!meal.available}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold
                  text-[13px] transition-all duration-200 ${
                  meal.available
                    ? justAdded
                      ? 'bg-green-500 text-white scale-95'
                      : 'bg-[#7B2535] hover:bg-[#9B3045] text-white hover:shadow-[0_4px_16px_rgba(123,37,53,0.35)] hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-cx-muted text-cx-soft cursor-not-allowed'
                }`}
              >
                {justAdded ? (
                  <><CheckCircle2 size={14} /> <span>{t.mealCard.added}</span></>
                ) : (
                  <><ShoppingCart size={13} /> <span>{t.mealCard.add}</span></>
                )}
              </motion.button>
            ) : (
              <motion.div
                key="qty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-0 bg-cx-page rounded-xl overflow-hidden border border-cx-edge"
              >
                <button
                  onClick={() => updateQty(meal.id, -1)}
                  className="w-9 h-9 flex items-center justify-center text-[#7B2535]
                    hover:bg-[#C41E3A]/10 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-[14px] font-bold text-cx-base">
                  {qty}
                </span>
                <button
                  onClick={() => updateQty(meal.id, 1)}
                  className="w-9 h-9 flex items-center justify-center text-[#7B2535]
                    hover:bg-[#C41E3A]/10 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
