import type React from 'react'
import { motion } from 'framer-motion'
import { Flame, ShieldCheck, CreditCard, Award, CalendarX } from 'lucide-react'
import { useLang } from '../contexts/LangContext'

const ADVANTAGE_META = [
  { icon: Flame,       accent: '#C41E3A', iconBg: 'bg-[#C41E3A]/10' },
  { icon: ShieldCheck, accent: '#1A6FC4', iconBg: 'bg-blue-500/10' },
  { icon: CreditCard,  accent: '#0A7C59', iconBg: 'bg-emerald-500/10' },
  { icon: Award,       accent: '#B45309', iconBg: 'bg-amber-500/10' },
  { icon: CalendarX,   accent: '#7B2535', iconBg: 'bg-[#7B2535]/10' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

export default function Advantages() {
  const { t } = useLang()
  const advantages = t.advantages.items.map((item, i) => ({
    ...(ADVANTAGE_META[i] ?? ADVANTAGE_META[0]),
    title: item.title,
    description: item.description,
  }))

  return (
    <section className="w-full bg-cx-page py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#C41E3A] text-sm font-semibold tracking-widest uppercase mb-3">
            {t.advantages.tag}
          </span>
          <h2 className="text-cx-base text-4xl sm:text-5xl font-extrabold tracking-tight">
            {t.advantages.title}
          </h2>
          <p className="mt-4 text-cx-body text-[16px] max-w-xl mx-auto leading-relaxed">
            {t.advantages.subtitle}
          </p>
        </motion.div>

        {/* Cards grid — first row: 3, second row: 2 centered */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="space-y-6"
        >
          {/* Row 1 — 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.slice(0, 3).map((item) => (
              <AdvantageCard key={item.title} {...item} />
            ))}
          </div>

          {/* Row 2 — 2 cards centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:w-2/3 lg:mx-auto">
            {advantages.slice(3).map((item) => (
              <AdvantageCard key={item.title} {...item} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

type AdvantageCardProps = {
  icon: React.ElementType
  title: string
  description: string
  accent: string
  iconBg: string
}

function AdvantageCard({ icon: Icon, title, description, accent, iconBg }: AdvantageCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative flex flex-col gap-5 p-6 sm:p-7 bg-cx-card rounded-2xl
        border border-cx-line hover:border-transparent
        hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)]
        transition-all duration-400 overflow-hidden"
    >
      {/* Subtle top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-0
          group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: accent }}
      />

      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center
          transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon size={26} style={{ color: accent }} strokeWidth={1.8} />
      </div>

      {/* Text */}
      <div>
        <h3 className="text-cx-base text-[16px] sm:text-[17px] font-bold mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-cx-body text-[13.5px] sm:text-[14px] leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom tag */}
      <div
        className="mt-auto pt-4 border-t border-cx-line flex items-center gap-2
          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: accent }}
        />
        <span className="text-[12px] font-semibold tracking-wide" style={{ color: accent }}>
          CuisineXpress
        </span>
      </div>
    </motion.div>
  )
}
