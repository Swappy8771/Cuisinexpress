import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, ChevronRight, Heart, ShoppingCart, Plus, Minus,
  Flame, Leaf, Snowflake, Star, Zap, CheckCircle2, ArrowLeft, Info,
} from 'lucide-react'
import { meals, allergies, categories } from '../../lib/mockData'
import { useCartStore } from '../../store/cartStore'
import type { MealTag } from '../../types'

const TAG_CONFIG: Record<MealTag, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  hot:           { label: 'Chaud',       icon: Flame,     color: 'text-red-600',     bg: 'bg-red-50 border-red-100' },
  cold:          { label: 'Froid',       icon: Snowflake, color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-100' },
  vegetarian:    { label: 'Végétarien',  icon: Leaf,      color: 'text-green-600',   bg: 'bg-green-50 border-green-100' },
  vegan:         { label: 'Vegan',       icon: Leaf,      color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
  halal:         { label: 'Halal',       icon: Star,      color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-100' },
  'gluten-free': { label: 'Sans gluten', icon: Zap,       color: 'text-violet-600',  bg: 'bg-violet-50 border-violet-100' },
}

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(n)

export default function MealDetailPage() {
  const { mealId } = useParams<{ mealId: string }>()
  const navigate   = useNavigate()
  const meal       = meals.find((m) => m.id === mealId)

  const { addItem, updateQty, getQty } = useCartStore()
  const qty = meal ? getQty(meal.id) : 0

  const [isFav, setIsFav]     = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  if (!meal) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center gap-4">
        <p className="text-[18px] font-bold text-[#0A0A0A]">Repas introuvable.</p>
        <Link to="/commander" className="text-[#C41E3A] font-semibold hover:underline underline-offset-2">
          ← Retour au menu
        </Link>
      </div>
    )
  }

  const category    = categories.find((c) => c.id === meal.categoryId)
  const mealAllergies = allergies.filter((a) => meal.allergyIds.includes(a.id))

  // Simulate multiple views of the same image (would be real images in production)
  const images = [meal.image, meal.image]

  const handleAdd = () => {
    addItem(meal)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1800)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">

      {/* Breadcrumb */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1.5 text-[13px] text-gray-400">
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
            <li className="text-[#0A0A0A] font-medium truncate max-w-[180px]">{meal.name}</li>
          </ol>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[13px] text-gray-400
            hover:text-[#C41E3A] font-semibold mb-8 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Retour au menu
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Left — images ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-4"
          >
            {/* Thumbnails */}
            <div className="flex flex-col gap-3 flex-shrink-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200
                    ${activeImg === i ? 'border-[#C41E3A] shadow-[0_0_0_2px_rgba(196,30,58,0.15)]' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-100
              aspect-square shadow-[0_4px_32px_rgba(0,0,0,0.1)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={images[activeImg]}
                  alt={meal.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {meal.isNew && (
                  <span className="px-3 py-1 bg-[#C41E3A] text-white text-[11px] font-bold
                    tracking-wider uppercase rounded-full shadow-lg">
                    Nouveau
                  </span>
                )}
                {meal.popular && (
                  <span className="px-3 py-1 bg-[#F59E0B] text-white text-[11px] font-bold
                    tracking-wider uppercase rounded-full shadow-lg flex items-center gap-1">
                    <Star size={10} className="fill-white" /> Populaire
                  </span>
                )}
                {!meal.available && (
                  <span className="px-3 py-1 bg-gray-700 text-white text-[11px] font-bold
                    rounded-full">Non disponible</span>
                )}
              </div>

              {/* Favourite */}
              <button
                onClick={() => setIsFav(!isFav)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95
                  shadow-md flex items-center justify-center
                  hover:scale-110 active:scale-95 transition-transform duration-150"
              >
                <Heart
                  size={17}
                  className={isFav ? 'fill-[#C41E3A] text-[#C41E3A]' : 'text-gray-400'}
                />
              </button>

              {/* Calories */}
              {meal.calories && (
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5
                  bg-black/55 backdrop-blur-sm text-white text-[11px] font-semibold
                  px-3 py-1.5 rounded-full">
                  <Flame size={11} />
                  {meal.calories} kcal
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Right — details ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex flex-col gap-6"
          >
            {/* Allergens */}
            {mealAllergies.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400">
                  <Info size={12} />
                  Présence d'ingrédients allergènes
                </div>
                {mealAllergies.map((a) => (
                  <span
                    key={a.id}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                      text-[11.5px] font-bold ring-1 ${a.colorClass}`}
                  >
                    {a.emoji} {a.label}
                  </span>
                ))}
              </div>
            )}

            {/* Category + tags */}
            <div className="flex flex-wrap items-center gap-2">
              {category && category.id && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                  bg-[#0A0A0A] text-white text-[12px] font-semibold">
                  {category.emoji} {category.label}
                </span>
              )}
              {meal.tags.map((tag) => {
                const cfg = TAG_CONFIG[tag]
                const Icon = cfg.icon
                return (
                  <span key={tag} className={`inline-flex items-center gap-1.5 px-3 py-1.5
                    rounded-full border text-[12px] font-semibold ${cfg.bg} ${cfg.color}`}>
                    <Icon size={11} />
                    {cfg.label}
                  </span>
                )
              })}
            </div>

            {/* Name */}
            <div>
              <h1 className="text-[32px] sm:text-[36px] font-extrabold text-[#0A0A0A]
                tracking-tight leading-tight">
                {meal.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-[38px] font-extrabold text-[#C41E3A] tracking-tight">
                {fmt(meal.price)}
              </span>
              <span className="text-[14px] text-gray-400 font-medium">/ repas</span>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Description */}
            <div>
              <p className="text-[14px] font-semibold text-[#0A0A0A] mb-2">Description</p>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {meal.description}
              </p>
            </div>

            <div className="h-px bg-gray-100" />

            {/* CTA */}
            {meal.available ? (
              <div className="flex items-center gap-4">
                <AnimatePresence mode="wait">
                  {qty === 0 ? (
                    <motion.button
                      key="add"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={handleAdd}
                      className={`flex-1 flex items-center justify-center gap-2.5
                        py-4 rounded-2xl font-bold text-[15px] transition-all duration-200
                        ${justAdded
                          ? 'bg-green-500 text-white'
                          : 'bg-[#C41E3A] hover:bg-[#a01830] text-white hover:shadow-[0_8px_28px_rgba(196,30,58,0.4)] hover:-translate-y-0.5 active:translate-y-0'
                        }`}
                    >
                      {justAdded ? (
                        <><CheckCircle2 size={18} /> Ajouté au panier</>
                      ) : (
                        <><ShoppingCart size={17} /> Ajouter au panier</>
                      )}
                    </motion.button>
                  ) : (
                    <motion.div
                      key="qty"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-0 bg-[#F7F7F7] rounded-2xl
                        overflow-hidden border border-gray-200 flex-1"
                    >
                      <button
                        onClick={() => updateQty(meal.id, -1)}
                        className="flex-1 py-4 flex items-center justify-center text-[#C41E3A]
                          hover:bg-[#FFF0F2] transition-colors text-[18px] font-bold"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="px-6 text-[20px] font-extrabold text-[#0A0A0A]">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQty(meal.id, 1)}
                        className="flex-1 py-4 flex items-center justify-center text-[#C41E3A]
                          hover:bg-[#FFF0F2] transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => setIsFav(!isFav)}
                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center
                    transition-all duration-200 flex-shrink-0
                    ${isFav
                      ? 'border-[#C41E3A] bg-[#FFF0F2]'
                      : 'border-gray-200 hover:border-[#C41E3A] hover:bg-[#FFF0F2]'
                    }`}
                >
                  <Heart
                    size={20}
                    className={isFav ? 'fill-[#C41E3A] text-[#C41E3A]' : 'text-gray-400'}
                  />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-4 px-5 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                <p className="text-[14px] font-semibold text-gray-500">
                  Ce repas n'est pas disponible cette semaine.
                </p>
              </div>
            )}

            {/* Go to cart */}
            {qty > 0 && (
              <Link
                to="/panier"
                className="text-center text-[13px] text-[#C41E3A] font-semibold
                  hover:underline underline-offset-2 transition-colors"
              >
                Voir le panier ({qty} article{qty > 1 ? 's' : ''}) →
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
