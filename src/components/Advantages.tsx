import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, ShieldCheck, BadgeCheck, Zap } from 'lucide-react'
import { useLang } from '../contexts/LangContext'

/* ─────────────────────────────── SVG Illustrations ────────────────────────── */

function IllustHot() {
  return (
    <svg viewBox="0 0 72 72" fill="none" className="w-full h-full">
      <circle cx="36" cy="36" r="36" fill="#C41E3A" fillOpacity="0.1"/>
      {/* Bowl */}
      <ellipse cx="36" cy="52" rx="18" ry="5" fill="#C41E3A" fillOpacity="0.15"/>
      <path d="M18 42 Q18 56 36 56 Q54 56 54 42 Z" fill="#C41E3A" fillOpacity="0.2" stroke="#C41E3A" strokeWidth="1.4"/>
      <path d="M20 42 h32" stroke="#C41E3A" strokeWidth="1.6" strokeLinecap="round"/>
      {/* Food */}
      <ellipse cx="36" cy="42" rx="12" ry="5" fill="#C41E3A" fillOpacity="0.3"/>
      <path d="M28 40 Q32 36 36 40 Q40 44 44 40" stroke="#C41E3A" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      {/* Steam lines */}
      <path d="M28 34 Q29 30 28 26" stroke="#C41E3A" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M36 32 Q37 28 36 24" stroke="#C41E3A" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M44 34 Q45 30 44 26" stroke="#C41E3A" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Flame accent */}
      <path d="M60 20 C60 16 56 14 56 18 C56 14 52 12 53 17 C50 14 50 20 54 22 C52 22 51 24 53 24 C56 26 62 24 60 20Z"
        fill="#C41E3A" fillOpacity="0.7"/>
    </svg>
  )
}

function IllustDelivery() {
  return (
    <svg viewBox="0 0 72 72" fill="none" className="w-full h-full">
      <circle cx="36" cy="36" r="36" fill="#1A6FC4" fillOpacity="0.08"/>
      {/* School building */}
      <rect x="10" y="28" width="24" height="22" rx="2" fill="#1A6FC4" fillOpacity="0.15" stroke="#1A6FC4" strokeWidth="1.3"/>
      <path d="M10 32 h24" stroke="#1A6FC4" strokeWidth="1"/>
      <rect x="18" y="36" width="8" height="10" rx="1" fill="#1A6FC4" fillOpacity="0.25"/>
      <path d="M22 28 L22 24" stroke="#1A6FC4" strokeWidth="1.3"/>
      <path d="M19 24 h6 l-3-4z" fill="#1A6FC4" fillOpacity="0.5"/>
      {/* Van */}
      <rect x="36" y="36" width="24" height="14" rx="2.5" fill="#1A6FC4" fillOpacity="0.2" stroke="#1A6FC4" strokeWidth="1.4"/>
      <path d="M36 40 h16" stroke="#1A6FC4" strokeWidth="1"/>
      <rect x="38" y="38" width="10" height="6" rx="1" fill="white" fillOpacity="0.5"/>
      <circle cx="42" cy="51" r="3.5" fill="#0a0a0a" stroke="#1A6FC4" strokeWidth="1.3"/>
      <circle cx="42" cy="51" r="1.5" fill="#1A6FC4"/>
      <circle cx="56" cy="51" r="3.5" fill="#0a0a0a" stroke="#1A6FC4" strokeWidth="1.3"/>
      <circle cx="56" cy="51" r="1.5" fill="#1A6FC4"/>
      {/* Arrow / motion lines */}
      <path d="M32 44 L36 44" stroke="#1A6FC4" strokeWidth="1.3" strokeDasharray="1.5 1.5"/>
      <path d="M30 47 L34 47" stroke="#1A6FC4" strokeWidth="1.3" strokeDasharray="1.5 1.5"/>
      {/* Clock */}
      <circle cx="58" cy="22" r="8" fill="#1A6FC4" fillOpacity="0.15" stroke="#1A6FC4" strokeWidth="1.3"/>
      <path d="M58 18 L58 22 L61 24" stroke="#1A6FC4" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function IllustPayment() {
  return (
    <svg viewBox="0 0 72 72" fill="none" className="w-full h-full">
      <circle cx="36" cy="36" r="36" fill="#0A7C59" fillOpacity="0.08"/>
      {/* Card base */}
      <rect x="10" y="24" width="52" height="34" rx="5" fill="#0A7C59" fillOpacity="0.15" stroke="#0A7C59" strokeWidth="1.4"/>
      <rect x="10" y="30" width="52" height="8" fill="#0A7C59" fillOpacity="0.2"/>
      {/* Chip */}
      <rect x="16" y="43" width="10" height="8" rx="2" fill="#0A7C59" fillOpacity="0.4" stroke="#0A7C59" strokeWidth="1"/>
      <path d="M18 46 h6 M18 49 h6 M21 43 v8" stroke="#0A7C59" strokeWidth="0.8"/>
      {/* Card digits dots */}
      {[0,1,2,3].map(g => (
        [0,1,2,3].map(d => (
          <circle key={`${g}-${d}`} cx={32 + g * 8 + d * 1.6} cy="46" r="1" fill="#0A7C59" fillOpacity={d < 3 ? 0.3 : 0.8}/>
        ))
      ))}
      {/* Contactless waves */}
      <path d="M52 37 Q55 34 52 31" stroke="#0A7C59" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M55 39 Q60 34 55 29" stroke="#0A7C59" strokeWidth="1.3" strokeLinecap="round"/>
      {/* Lock badge */}
      <circle cx="56" cy="20" r="8" fill="#0A7C59"/>
      <rect x="53" y="20" width="6" height="5" rx="1" fill="white" fillOpacity="0.9"/>
      <path d="M54 20 v-2 a2 2 0 0 1 4 0 v2" stroke="white" strokeWidth="1.3"/>
      <circle cx="56" cy="22.5" r="1" fill="#0A7C59"/>
    </svg>
  )
}

function IllustQuality() {
  return (
    <svg viewBox="0 0 72 72" fill="none" className="w-full h-full">
      <circle cx="36" cy="36" r="36" fill="#B45309" fillOpacity="0.08"/>
      {/* Trophy */}
      <path d="M24 18 h24 v14 a12 12 0 0 1-24 0 Z" fill="#B45309" fillOpacity="0.2" stroke="#B45309" strokeWidth="1.4"/>
      <path d="M24 24 Q16 24 16 30 Q16 36 24 36" stroke="#B45309" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      <path d="M48 24 Q56 24 56 30 Q56 36 48 36" stroke="#B45309" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      <rect x="30" y="44" width="12" height="4" rx="1" fill="#B45309" fillOpacity="0.3" stroke="#B45309" strokeWidth="1.2"/>
      <rect x="26" y="48" width="20" height="3" rx="1.5" fill="#B45309" fillOpacity="0.4" stroke="#B45309" strokeWidth="1.2"/>
      {/* Star in trophy */}
      <path d="M36 24 l1.8 5.5h5.8l-4.7 3.4 1.8 5.5L36 35l-4.7 3.4 1.8-5.5-4.7-3.4h5.8z"
        fill="#B45309" fillOpacity="0.7"/>
      {/* Fresh leaf accent */}
      <path d="M56 14 C54 10 58 8 60 12 C62 10 64 14 60 16 C62 18 58 20 56 16 C54 18 50 16 52 12 C50 10 54 10 56 14Z"
        fill="#0A7C59" fillOpacity="0.7"/>
    </svg>
  )
}

function IllustCancel() {
  return (
    <svg viewBox="0 0 72 72" fill="none" className="w-full h-full">
      <circle cx="36" cy="36" r="36" fill="#C41E3A" fillOpacity="0.07"/>
      {/* Calendar */}
      <rect x="12" y="18" width="48" height="42" rx="5" fill="#C41E3A" fillOpacity="0.1" stroke="#C41E3A" strokeWidth="1.4"/>
      <rect x="12" y="18" width="48" height="12" rx="5" fill="#C41E3A" fillOpacity="0.2"/>
      <rect x="12" y="25" width="48" height="5" fill="#C41E3A" fillOpacity="0.2"/>
      {/* Calendar pegs */}
      <rect x="22" y="13" width="4" height="10" rx="2" fill="#C41E3A" strokeWidth="1.2" stroke="#C41E3A"/>
      <rect x="46" y="13" width="4" height="10" rx="2" fill="#C41E3A" strokeWidth="1.2" stroke="#C41E3A"/>
      {/* Grid dots */}
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x={18 + (i % 7) * 6} y={37 + Math.floor(i / 7) * 6} width="3" height="3" rx="0.8"
          fill="#C41E3A" fillOpacity={i === 0 ? 0.7 : 0.2}/>
      ))}
      {/* Big 8 with clock indicator */}
      <text x="36" y="54" textAnchor="middle" fontSize="16" fontWeight="800" fill="#C41E3A" fillOpacity="0.85">8:00</text>
      {/* Refund shield */}
      <circle cx="56" cy="18" r="9" fill="#0A7C59"/>
      <path d="M56 13 l4 2 v4 a4 4 0 0 1-8 0 v-4z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1"/>
      <path d="M53 18 l2 2 3.5-3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ─────────────────────────────── Config per card ───────────────────────────── */

const CARD_META = [
  {
    Illustration: IllustHot,
    accent: '#C41E3A',
    glow: 'rgba(196,30,58,0.15)',
    border: 'hover:border-[#C41E3A]/40',
    tag: { fr: 'Toujours servi chaud', en: 'Always served hot' },
    metric: { value: '100%', label: { fr: 'livré chaud', en: 'delivered hot' } },
  },
  {
    Illustration: IllustDelivery,
    accent: '#1A6FC4',
    glow: 'rgba(26,111,196,0.14)',
    border: 'hover:border-blue-400/40',
    tag: { fr: 'Livraison directe', en: 'Direct delivery' },
    metric: { value: '11h', label: { fr: 'avant le repas', en: 'before lunch' } },
  },
  {
    Illustration: IllustPayment,
    accent: '#0A7C59',
    glow: 'rgba(10,124,89,0.14)',
    border: 'hover:border-emerald-400/40',
    tag: { fr: 'Paiement 100% sécurisé', en: '100% secure payment' },
    metric: { value: '3', label: { fr: 'moyens de paiement', en: 'payment methods' } },
  },
  {
    Illustration: IllustQuality,
    accent: '#B45309',
    glow: 'rgba(180,83,9,0.14)',
    border: 'hover:border-amber-400/40',
    tag: { fr: 'Zéro congelé · 100% frais', en: 'Zero frozen · 100% fresh' },
    metric: { value: '0', label: { fr: 'légumes congelés', en: 'frozen veggies' } },
  },
  {
    Illustration: IllustCancel,
    accent: '#C41E3A',
    glow: 'rgba(196,30,58,0.13)',
    border: 'hover:border-[#C41E3A]/40',
    tag: { fr: 'Remboursement 100%', en: '100% refund' },
    metric: { value: '8h', label: { fr: "heure limite d'annulation", en: 'cancellation cutoff' } },
  },
]

/* ─────────────────────────────── Trust bar items ───────────────────────────── */

const TRUST_FR = [
  { icon: Star,        text: '4.9 / 5 étoiles',       sub: '200+ avis parents' },
  { icon: ShieldCheck, text: 'Paiement sécurisé',      sub: 'Visa · MC · Interac' },
  { icon: BadgeCheck,  text: 'Fait maison',            sub: 'Chaque jour, sans exception' },
  { icon: Zap,         text: 'Annulation facile',      sub: 'Remboursé à 100 %' },
]
const TRUST_EN = [
  { icon: Star,        text: '4.9 / 5 stars',          sub: '200+ parent reviews' },
  { icon: ShieldCheck, text: 'Secure payment',         sub: 'Visa · MC · Interac' },
  { icon: BadgeCheck,  text: 'Homemade',               sub: 'Every day, no exception' },
  { icon: Zap,         text: 'Easy cancellation',      sub: '100% refunded' },
]

/* ─────────────────────────────── Main component ────────────────────────────── */

export default function Advantages() {
  const { t, lang } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const advantages = t.advantages.items.map((item, i) => ({
    ...(CARD_META[i] ?? CARD_META[0]),
    title: item.title,
    description: item.description,
  }))

  const trustItems = lang === 'en' ? TRUST_EN : TRUST_FR

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-cx-page overflow-hidden py-24 sm:py-32"
    >
      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse at 80% 0%, rgba(196,30,58,0.05) 0%, transparent 55%),
                            radial-gradient(ellipse at 10% 100%, rgba(26,111,196,0.04) 0%, transparent 45%)`,
        }}
      />

      <div className="relative max-w-[1380px] mx-auto px-3 sm:px-4 lg:px-6">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5
            bg-[#C41E3A]/8 border border-[#C41E3A]/20 rounded-full
            text-[#C41E3A] text-[11px] font-extrabold tracking-[0.14em] uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A] animate-pulse" />
            {t.advantages.tag}
          </span>
          <h2 className="text-cx-base text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.08] mb-5">
            {t.advantages.title}
          </h2>
          <p className="text-cx-body text-[16px] sm:text-[17px] max-w-lg mx-auto leading-relaxed">
            {t.advantages.subtitle}
          </p>
        </motion.div>

        {/* ── Trust bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12"
        >
          {trustItems.map(({ icon: Icon, text, sub }) => (
            <div key={text}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl
                bg-cx-card border border-cx-line
                hover:border-[#C41E3A]/25 hover:bg-cx-fill
                transition-all duration-300 group">
              <div className="w-9 h-9 rounded-xl bg-[#C41E3A]/10 flex items-center justify-center flex-shrink-0
                group-hover:bg-[#C41E3A]/20 transition-colors duration-300">
                <Icon size={16} className="text-[#C41E3A]" />
              </div>
              <div className="min-w-0">
                <p className="text-[12.5px] font-bold text-cx-base leading-tight">{text}</p>
                <p className="text-[11px] text-cx-soft leading-tight mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Cards grid ── */}
        <div className="space-y-4">
          {/* Row 1 — 3 equal cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {advantages.slice(0, 3).map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 44 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <BentoCard lang={lang} {...item} />
              </motion.div>
            ))}
          </div>

          {/* Row 2 — 2 equal cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-2/3 lg:mx-auto">
            {advantages.slice(3).map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 44 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <BentoCard lang={lang} {...item} />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

/* ─────────────────────────────── BentoCard ─────────────────────────────────── */

type CardProps = {
  Illustration: () => React.JSX.Element
  accent: string
  glow: string
  border: string
  tag: { fr: string; en: string }
  metric: { value: string; label: { fr: string; en: string } }
  title: string
  description: string
  lang: string
}

function BentoCard({ Illustration, accent, glow, border, tag, metric, title, description, lang }: CardProps) {
  return (
    <div
      className={`group relative flex overflow-hidden rounded-2xl
        bg-cx-card border border-cx-line ${border}
        transition-all duration-400 h-full
        hover:shadow-[0_20px_56px_var(--glow)]`}
      style={{ ['--glow' as string]: glow } as React.CSSProperties}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl
          scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      <div className="flex flex-col gap-0 w-full">

        {/* Illustration panel */}
        <div className="relative flex-shrink-0 h-44
          bg-gradient-to-br from-cx-fill to-transparent
          flex items-center justify-center p-8 overflow-hidden"
        >
          {/* Glow blob behind illustration */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(circle at 50% 50%, ${accent}20, transparent 70%)` }} />
          <div className="relative w-24 h-24 group-hover:scale-110
            transition-transform duration-500 ease-out drop-shadow-lg">
            <Illustration />
          </div>

          {/* Metric callout — bottom-right of illustration */}
          <div className="absolute bottom-3 right-3 flex flex-col items-end">
            <span className="text-[22px] font-black leading-none" style={{ color: accent }}>
              {metric.value}
            </span>
            <span className="text-[9.5px] font-semibold text-cx-soft text-right leading-tight max-w-[70px]">
              {lang === 'en' ? metric.label.en : metric.label.fr}
            </span>
          </div>
        </div>

        {/* Text content */}
        <div className="flex flex-col p-6 flex-1">
          {/* Tag pill */}
          <span className="inline-flex self-start items-center gap-1.5 mb-4
            px-2.5 py-1 rounded-full text-[10.5px] font-extrabold uppercase tracking-wide border"
            style={{ color: accent, borderColor: `${accent}30`, background: `${accent}0d` }}>
            <span className="w-1 h-1 rounded-full" style={{ background: accent }} />
            {lang === 'en' ? tag.en : tag.fr}
          </span>

          <h3 className="text-cx-base text-[17px] sm:text-[18px] font-extrabold
            tracking-tight mb-3 group-hover:text-[var(--accent)] transition-colors duration-300"
            style={{ ['--accent' as string]: accent } as React.CSSProperties}>
            {title}
          </h3>
          <p className="text-cx-body text-[13.5px] sm:text-[14px] leading-relaxed flex-1">
            {description}
          </p>

          {/* Bottom animated underline */}
          <div className="mt-5 h-[2px] w-0 group-hover:w-10 rounded-full
            transition-all duration-500 ease-out"
            style={{ background: accent }} />
        </div>
      </div>
    </div>
  )
}

import type React from 'react'
