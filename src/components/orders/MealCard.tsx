import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Plus, Minus, ShoppingCart, Flame, Leaf, Snowflake, Star, Zap, CheckCircle2 } from 'lucide-react'
import type { Meal, Allergy, MenuCategory, MealTag } from '../../types'
import { useCartStore } from '../../store/cartStore'

const TAG_CONFIG: Record<MealTag, { label: string; icon: React.ElementType; color: string }> = {
  hot:           { label: 'Chaud',       icon: Flame,     color: 'bg-red-100   text-red-700'   },
  cold:          { label: 'Froid',       icon: Snowflake, color: 'bg-blue-100  text-blue-700'  },
  vegetarian:    { label: 'Végétarien',  icon: Leaf,      color: 'bg-green-100 text-green-700' },
  vegan:         { label: 'Vegan',       icon: Leaf,      color: 'bg-emerald-100 text-emerald-700' },
  halal:         { label: 'Halal',       icon: Star,      color: 'bg-amber-100 text-amber-700' },
  'gluten-free': { label: 'Sans gluten', icon: Zap,       color: 'bg-violet-100 text-violet-700' },
}

interface Props {
  meal: Meal
  allergies: Allergy[]
  categories: MenuCategory[]
}

function MealCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-20 bg-gray-100 rounded-full animate-pulse" />
        <div className="h-5 w-3/4 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
        <div className="flex gap-2 mt-1">
          <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-6 w-14 bg-gray-100 rounded-full animate-pulse" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="h-7 w-16 bg-gray-100 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export { MealCardSkeleton }

export default function MealCard({ meal, allergies, categories }: Props) {
  const navigate = useNavigate()
  const [isFav, setIsFav] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, updateQty, getQty } = useCartStore()
  const qty = getQty(meal.id)

  const category = categories.find((c) => c.id === meal.categoryId)
  const mealAllergies = allergies.filter((a) => meal.allergyIds.includes(a.id))

  const fmt = (n: number) =>
    new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(n)

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
      className={`group bg-white rounded-2xl overflow-hidden border border-gray-100
        shadow-[0_2px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]
        transition-shadow duration-300 flex flex-col ${!meal.available ? 'opacity-70' : ''}`}
    >
      {/* Image — click navigates to detail */}
      <div
        className="relative aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer"
        onClick={() => navigate(`/commander/${meal.id}`)}
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
            if (parent) parent.classList.add('flex', 'items-center', 'justify-center', 'bg-gradient-to-br', 'from-gray-100', 'to-gray-200')
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Top badges row */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {meal.isNew && (
            <span className="px-2.5 py-1 bg-[#C41E3A] text-white text-[10px] font-bold
              tracking-wider uppercase rounded-full shadow-lg">
              Nouveau
            </span>
          )}
          {meal.popular && (
            <span className="px-2.5 py-1 bg-[#F59E0B] text-white text-[10px] font-bold
              tracking-wider uppercase rounded-full shadow-lg flex items-center gap-1">
              <Star size={9} className="fill-white" />
              Populaire
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
            className={isFav ? 'fill-[#C41E3A] text-[#C41E3A]' : 'text-gray-500'}
          />
        </button>

        {/* Unavailable ribbon */}
        {!meal.available && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-white text-[#0A0A0A] text-[12px] font-bold px-4 py-1.5
              rounded-full shadow-lg">
              Non disponible
            </span>
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
            <span className="text-[11.5px] font-semibold text-gray-400 uppercase tracking-wide">
              {category.label}
            </span>
          </div>
        )}

        {/* Title */}
        <h3
          className="text-[15px] font-bold text-[#0A0A0A] leading-snug line-clamp-1
            hover:text-[#C41E3A] transition-colors cursor-pointer"
          onClick={() => navigate(`/commander/${meal.id}`)}
        >
          {meal.name}
        </h3>

        {/* Description */}
        <p className="text-[12.5px] text-gray-400 leading-relaxed line-clamp-2 flex-1">
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
                    text-[10.5px] font-semibold ${cfg.color}`}
                >
                  <Icon size={9} />
                  {cfg.label}
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
        <div className="flex items-center justify-between gap-3 mt-auto pt-2 border-t border-gray-50">
          <div>
            <span className="text-[20px] font-extrabold text-[#0A0A0A] tracking-tight">
              {fmt(meal.price)}
            </span>
            <span className="text-[11px] text-gray-300 ml-1">/repas</span>
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
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {justAdded ? (
                  <><CheckCircle2 size={14} /> Ajouté</>
                ) : (
                  <><ShoppingCart size={13} /> Ajouter</>
                )}
              </motion.button>
            ) : (
              <motion.div
                key="qty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-0 bg-[#F7F7F7] rounded-xl overflow-hidden border border-gray-200"
              >
                <button
                  onClick={() => updateQty(meal.id, -1)}
                  className="w-9 h-9 flex items-center justify-center text-[#7B2535]
                    hover:bg-[#FFF0F2] transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-[14px] font-bold text-[#0A0A0A]">
                  {qty}
                </span>
                <button
                  onClick={() => updateQty(meal.id, 1)}
                  className="w-9 h-9 flex items-center justify-center text-[#7B2535]
                    hover:bg-[#FFF0F2] transition-colors"
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
