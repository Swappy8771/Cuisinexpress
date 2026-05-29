import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../contexts/LangContext'

/* ── Inline SVG illustrations for each step ───────────────────────────────── */

function IllustrationOrder() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="40" cy="40" r="40" fill="#C41E3A" fillOpacity="0.08" />
      {/* Phone */}
      <rect x="25" y="16" width="30" height="48" rx="5" fill="#C41E3A" fillOpacity="0.15" stroke="#C41E3A" strokeWidth="1.5"/>
      <rect x="29" y="22" width="22" height="28" rx="2" fill="white" fillOpacity="0.9"/>
      {/* Cart icon on screen */}
      <path d="M34 30h2l1 5h6l1-4H35" stroke="#C41E3A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="38" cy="37" r="1" fill="#C41E3A"/>
      <circle cx="42" cy="37" r="1" fill="#C41E3A"/>
      {/* Checkmark badge */}
      <circle cx="52" cy="24" r="7" fill="#C41E3A"/>
      <path d="M49 24l2 2 3.5-3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Home button */}
      <circle cx="40" cy="58" r="2" fill="#C41E3A" fillOpacity="0.4"/>
    </svg>
  )
}

function IllustrationPrep() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="40" cy="40" r="40" fill="#C41E3A" fillOpacity="0.08" />
      {/* Van */}
      <rect x="10" y="38" width="42" height="22" rx="3" fill="#C41E3A" fillOpacity="0.15" stroke="#C41E3A" strokeWidth="1.5"/>
      <path d="M52 44l8 2v10l-8 2V44z" fill="#C41E3A" fillOpacity="0.2" stroke="#C41E3A" strokeWidth="1.5"/>
      {/* Windshield */}
      <rect x="14" y="42" width="14" height="9" rx="1.5" fill="white" fillOpacity="0.8"/>
      {/* Wheels */}
      <circle cx="22" cy="61" r="5" fill="#1a1a1a" stroke="#C41E3A" strokeWidth="1.5"/>
      <circle cx="22" cy="61" r="2" fill="#C41E3A"/>
      <circle cx="52" cy="61" r="5" fill="#1a1a1a" stroke="#C41E3A" strokeWidth="1.5"/>
      <circle cx="52" cy="61" r="2" fill="#C41E3A"/>
      {/* Steam / freshness lines */}
      <path d="M34 30 Q35 27 34 24" stroke="#C41E3A" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M39 28 Q40 25 39 22" stroke="#C41E3A" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M44 30 Q45 27 44 24" stroke="#C41E3A" strokeWidth="1.4" strokeLinecap="round"/>
      {/* Box on van */}
      <rect x="32" y="30" width="16" height="12" rx="2" fill="#C41E3A" fillOpacity="0.3" stroke="#C41E3A" strokeWidth="1.2"/>
      <path d="M32 36h16" stroke="#C41E3A" strokeWidth="1" strokeDasharray="2 2"/>
    </svg>
  )
}

function IllustrationMeal() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="40" cy="40" r="40" fill="#C41E3A" fillOpacity="0.08" />
      {/* Plate */}
      <ellipse cx="40" cy="50" rx="22" ry="6" fill="#C41E3A" fillOpacity="0.12"/>
      <circle cx="40" cy="46" r="18" fill="white" fillOpacity="0.15" stroke="#C41E3A" strokeWidth="1.5"/>
      <circle cx="40" cy="46" r="13" fill="#C41E3A" fillOpacity="0.1"/>
      {/* Food on plate */}
      <ellipse cx="40" cy="46" rx="9" ry="7" fill="#C41E3A" fillOpacity="0.25"/>
      <path d="M35 44 Q38 40 41 44 Q44 48 47 44" stroke="#C41E3A" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      {/* Fork */}
      <path d="M20 34 L20 56" stroke="#C41E3A" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M18 34 L18 40 Q20 42 22 40 L22 34" stroke="#C41E3A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Knife */}
      <path d="M60 34 L60 56" stroke="#C41E3A" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M58 34 Q62 38 60 42" stroke="#C41E3A" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      {/* Steam */}
      <path d="M36 28 Q37 25 36 22" stroke="#C41E3A" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M40 26 Q41 23 40 20" stroke="#C41E3A" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M44 28 Q45 25 44 22" stroke="#C41E3A" strokeWidth="1.3" strokeLinecap="round"/>
      {/* Star rating */}
      <path d="M68 20 l1 3h3l-2.5 2 1 3L68 26l-2.5 2 1-3L64 23h3z" fill="#C41E3A"/>
    </svg>
  )
}

const ILLUSTRATIONS = [IllustrationOrder, IllustrationPrep, IllustrationMeal]

const STEP_COLORS = [
  { num: '01', accent: '#C41E3A', bg: 'from-[#C41E3A]/5 to-transparent' },
  { num: '02', accent: '#C41E3A', bg: 'from-[#C41E3A]/5 to-transparent' },
  { num: '03', accent: '#C41E3A', bg: 'from-[#C41E3A]/5 to-transparent' },
]

/* ── Animated connector arrow ─────────────────────────────────────────────── */
function ConnectorArrow() {
  return (
    <div className="hidden md:flex items-center justify-center w-12 flex-shrink-0 mt-[-30px]">
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex flex-col items-center gap-1"
      >
        <div className="w-px h-6 bg-gradient-to-b from-transparent to-[#C41E3A]/40" />
        <div className="flex gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="w-1 h-1 rounded-full bg-[#C41E3A]/40"
            />
          ))}
        </div>
        <ArrowRight size={16} className="text-[#C41E3A]/50" />
      </motion.div>
    </div>
  )
}

/* ── Trust stats strip ────────────────────────────────────────────────────── */
const TRUST_ITEMS_FR = [
  { value: '500+', label: 'Familles satisfaites' },
  { value: '3',    label: 'Écoles partenaires' },
  { value: '100%', label: 'Frais & fait maison' },
  { value: '4.9',  label: 'Note moyenne', star: true },
]
const TRUST_ITEMS_EN = [
  { value: '500+', label: 'Happy families' },
  { value: '3',    label: 'Partner schools' },
  { value: '100%', label: 'Fresh & homemade' },
  { value: '4.9',  label: 'Average rating', star: true },
]

/* ── Main component ───────────────────────────────────────────────────────── */
export default function HowItWorks() {
  const { t, lang } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const steps = t.how.steps.map((s, i) => ({
    Illustration: ILLUSTRATIONS[i],
    ...STEP_COLORS[i],
    title: s.title,
    description: s.description,
  }))

  const trustItems = lang === 'en' ? TRUST_ITEMS_EN : TRUST_ITEMS_FR

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-cx-card overflow-hidden py-24 sm:py-32"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none select-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(196,30,58,0.04) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(196,30,58,0.03) 0%, transparent 40%)`,
        }}
      />

      <div className="relative max-w-[1380px] mx-auto px-3 sm:px-4 lg:px-6">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5
            bg-[#C41E3A]/8 border border-[#C41E3A]/20 rounded-full
            text-[#C41E3A] text-[11px] font-extrabold tracking-[0.14em] uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A] animate-pulse" />
            {t.how.tag}
          </span>
          <h2 className="text-cx-base text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.08]">
            {t.how.title}
          </h2>
          <p className="mt-5 text-cx-body text-[16px] sm:text-[17px] max-w-lg mx-auto leading-relaxed">
            {t.how.subtitle}
          </p>
        </motion.div>

        {/* ── Steps row ── */}
        <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-0">
          {steps.map(({ Illustration, num, bg, title, description }, i) => (
            <div key={num} className="flex flex-col md:flex-row items-stretch flex-1 min-w-0">

              {/* Step card */}
              <motion.div
                initial={{ opacity: 0, y: 48 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: i * 0.16, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col flex-1 p-7 sm:p-8 rounded-2xl
                  bg-cx-fill border border-cx-line
                  hover:border-[#C41E3A]/30
                  hover:shadow-[0_20px_60px_rgba(196,30,58,0.1)]
                  transition-all duration-500 overflow-hidden cursor-default"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${bg}
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Large ghost step number */}
                <span className="absolute -bottom-3 -right-1
                  text-[100px] sm:text-[120px] font-black leading-none select-none
                  text-cx-line group-hover:text-[#C41E3A]/8 transition-colors duration-500">
                  {num}
                </span>

                {/* Step badge */}
                <div className="relative z-10 flex items-center gap-3 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full
                    bg-[#C41E3A] text-white text-[12px] font-black shadow-[0_4px_12px_rgba(196,30,58,0.35)]">
                    {i + 1}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-[#C41E3A]/30 to-transparent" />
                </div>

                {/* Illustration */}
                <div className="relative z-10 w-20 h-20 mb-6
                  group-hover:scale-110 transition-transform duration-500 ease-out">
                  <Illustration />
                </div>

                {/* Text */}
                <div className="relative z-10 flex-1">
                  <h3 className="text-cx-base text-[19px] sm:text-[21px] font-extrabold
                    tracking-tight mb-3 group-hover:text-[#C41E3A] transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="text-cx-body text-[14px] sm:text-[15px] leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Bottom animated bar */}
                <div className="relative z-10 mt-6 h-[3px] w-0 group-hover:w-full
                  bg-gradient-to-r from-[#C41E3A] to-[#C41E3A]/40 rounded-full
                  transition-all duration-500 ease-out" />
              </motion.div>

              {/* Connector between cards (md+) */}
              {i < steps.length - 1 && <ConnectorArrow />}
            </div>
          ))}
        </div>

        {/* ── Trust stats strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px
            rounded-2xl overflow-hidden border border-cx-line bg-cx-line"
        >
          {trustItems.map(({ value, label, star }) => (
            <div key={label}
              className="flex flex-col items-center justify-center gap-1.5
                px-6 py-6 bg-cx-fill hover:bg-[#C41E3A]/4 transition-colors duration-300">
              <div className="flex items-center gap-1">
                <span className="text-[26px] sm:text-[30px] font-black text-cx-base tracking-tight">
                  {value}
                </span>
                {star && <Star size={16} className="text-[#C41E3A] fill-[#C41E3A] mb-1" />}
              </div>
              <span className="text-[12px] text-cx-soft font-medium text-center leading-tight">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.7 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/commander"
            className="group inline-flex items-center gap-2.5
              px-8 py-4 bg-[#C41E3A] hover:bg-[#a51830]
              text-white text-[15px] font-bold rounded-2xl
              shadow-[0_8px_28px_rgba(196,30,58,0.35)] hover:shadow-[0_12px_36px_rgba(196,30,58,0.5)]
              transition-all duration-300"
          >
            {lang === 'en' ? 'Start ordering now' : 'Commander maintenant'}
            <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <span className="text-[13px] text-cx-soft">
            {lang === 'en' ? 'No commitment · Cancel anytime' : 'Sans engagement · Annulez à tout moment'}
          </span>
        </motion.div>

      </div>
    </section>
  )
}
