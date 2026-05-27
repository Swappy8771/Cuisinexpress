import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Meal } from '../../types'
import AddonCard from './AddonCard'
import { useLang } from '../../contexts/LangContext'

type Props = {
  label: string
  items: Meal[]
  selectedIds: Set<string>
  onToggle: (id: string) => void
}

export default function CategoryCarousel({ label, items, selectedIds, onToggle }: Props) {
  const { t } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * 220, behavior: 'smooth' })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <h3 className="text-[17px] font-bold text-cx-base">{label}</h3>
        <span className="text-[13px] text-cx-soft">({items.length} {t.mealModal.available})</span>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10
            w-8 h-8 rounded-full bg-cx-card border border-cx-edge
            shadow-[0_2px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)]
            items-center justify-center text-cx-soft hover:text-cx-base
            hover:border-cx-muted transition-all duration-200"
        >
          <ChevronLeft size={15} />
        </button>

        <div
          ref={ref}
          className="flex gap-3 overflow-x-auto pb-2 px-0.5
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

        <div className="sm:hidden absolute right-0 top-0 bottom-2 w-10
          bg-gradient-to-l from-cx-page to-transparent pointer-events-none" />

        <button
          type="button"
          onClick={() => scroll(1)}
          className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10
            w-8 h-8 rounded-full bg-cx-card border border-cx-edge
            shadow-[0_2px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)]
            items-center justify-center text-cx-soft hover:text-cx-base
            hover:border-cx-muted transition-all duration-200"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
