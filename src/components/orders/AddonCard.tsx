import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Check } from 'lucide-react'
import { fmt } from '../../lib/menuConfig'
import type { Meal } from '../../types'

type Props = {
  meal: Meal
  selected: boolean
  onToggle: () => void
}

export default function AddonCard({ meal, selected, onToggle }: Props) {
  const [isFav, setIsFav] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={onToggle}
      className={`relative flex-shrink-0 w-32 sm:w-36 cursor-pointer rounded-2xl overflow-hidden
        border-2 transition-all duration-200 group
        bg-cx-card shadow-[0_2px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]
        ${selected
          ? 'border-[#C41E3A] shadow-[0_0_0_3px_rgba(196,30,58,0.12)]'
          : 'border-cx-line hover:border-cx-edge'}`}
    >
      <div className="relative aspect-square overflow-hidden bg-cx-muted">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108"
        />

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

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setIsFav((f) => !f) }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm
            flex items-center justify-center shadow
            opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Heart size={11} className={isFav ? 'fill-[#C41E3A] text-[#C41E3A]' : 'text-cx-soft'} />
        </button>
      </div>

      <div className="p-2.5">
        <p className="text-[11.5px] font-semibold text-cx-base line-clamp-2 leading-snug mb-1.5">
          {meal.name}
        </p>
        <p className="text-[13px] font-extrabold text-[#C41E3A]">{fmt(meal.price)}</p>
      </div>
    </motion.div>
  )
}
