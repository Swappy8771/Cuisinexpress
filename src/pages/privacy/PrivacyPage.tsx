import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ChevronRight, ShieldCheck, Mail, Phone, MapPin, type LucideIcon } from 'lucide-react'
import { useLang } from '../../contexts/LangContext'

// ── Section body types ────────────────────────────────────────────────────────

type TextBody = {
  type: 'text'
  body: string
}

type BulletsBody = {
  type: 'bullets'
  points: readonly string[]
}

type CardsBody = {
  type: 'cards'
  cards: readonly { title: string; body: string }[]
}

type TableBody = {
  type: 'table'
  intro: string
  cols: [string, string, string]
  rows: { category: string; examples: string; purposes: string | readonly string[] }[]
  footnote: string
}

type InfoBoxBody = {
  type: 'infobox'
  p1: string
  p2: { pre: string; bold: string; post: string }
  boxTitle: string
  items: readonly string[]
}

type ContactBody = {
  type: 'contact'
  p1: { pre: string; name: string; post: string }
  p2: string
  cards: { label: string; value: string; href?: string; icon: LucideIcon }[]
}

type SectionBody = TextBody | BulletsBody | CardsBody | TableBody | InfoBoxBody | ContactBody

interface PageSection {
  num: number
  title: string
  body: SectionBody
}

// ── Body renderer ─────────────────────────────────────────────────────────────

function SectionBody({ body }: { body: SectionBody }) {
  switch (body.type) {
    case 'text':
      return (
        <div className="px-8 sm:px-12 py-6">
          <p className="text-[16px] text-cx-body leading-relaxed">{body.body}</p>
        </div>
      )

    case 'bullets':
      return (
        <div className="px-8 sm:px-12 py-6 flex flex-col gap-3">
          {body.points.map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C41E3A]/50 flex-shrink-0" />
              <p className="text-[16px] text-cx-body leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      )

    case 'cards':
      return (
        <div className="px-8 sm:px-12 py-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {body.cards.map(({ title, body: cardBody }) => (
            <div key={title} className="rounded-xl bg-cx-fill border border-cx-line px-5 py-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A] flex-shrink-0" />
                <p className="text-[15px] font-bold text-cx-base">{title}</p>
              </div>
              <p className="text-[15px] text-cx-body leading-relaxed">{cardBody}</p>
            </div>
          ))}
        </div>
      )

    case 'table':
      return (
        <div className="px-8 sm:px-12 py-6 flex flex-col gap-5">
          <p className="text-[16px] text-cx-body leading-relaxed">{body.intro}</p>
          <div className="rounded-xl border border-cx-line overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[540px] text-[15px]">
              <thead>
                <tr className="bg-cx-fill">
                  {body.cols.map((col) => (
                    <th key={col} className="text-left px-5 py-3.5 font-semibold text-cx-base border-b border-cx-line">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cx-line">
                {body.rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-cx-fill align-top' : 'align-top'}>
                    <td className="px-5 py-4 font-semibold text-cx-base">{row.category}</td>
                    <td className="px-5 py-4 text-cx-soft">{row.examples}</td>
                    <td className="px-5 py-4 text-cx-soft">
                      {Array.isArray(row.purposes) ? (
                        <ul className="list-disc list-inside space-y-1">
                          {(row.purposes as readonly string[]).map((p) => <li key={p}>{p}</li>)}
                        </ul>
                      ) : row.purposes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[14px] text-cx-body italic">{body.footnote}</p>
        </div>
      )

    case 'infobox':
      return (
        <div className="px-8 sm:px-12 py-6 flex flex-col gap-5">
          <p className="text-[16px] text-cx-body leading-relaxed">{body.p1}</p>
          <p className="text-[16px] text-cx-body leading-relaxed">
            {body.p2.pre}<span className="font-semibold text-cx-base">{body.p2.bold}</span>{body.p2.post}
          </p>
          <div className="rounded-xl bg-cx-fill border border-cx-line px-6 py-5">
            <p className="text-[14px] font-semibold text-cx-base mb-3">{body.boxTitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
              {body.items.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="mt-[7px] w-1 h-1 rounded-full bg-[#C41E3A]/60 flex-shrink-0" />
                  <span className="text-[15px] text-cx-body">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'contact':
      return (
        <div className="px-8 sm:px-12 py-6 flex flex-col gap-5">
          <p className="text-[16px] text-cx-body leading-relaxed">
            {body.p1.pre}<span className="font-semibold text-cx-base">{body.p1.name}</span>{body.p1.post}
          </p>
          <p className="text-[16px] text-cx-body leading-relaxed">{body.p2}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
            {body.cards.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-3 rounded-xl bg-cx-fill border border-cx-line px-5 py-4">
                <div className="w-9 h-9 rounded-lg bg-[#C41E3A]/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-[#C41E3A]" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-cx-soft uppercase tracking-wide mb-0.5">{label}</p>
                  {href
                    ? <a href={href} className="text-[15px] font-semibold text-[#C41E3A] hover:underline underline-offset-2">{value}</a>
                    : <p className="text-[15px] font-semibold text-cx-base leading-snug">{value}</p>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      )
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

const cardClass = 'bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden'

export default function PrivacyPage() {
  const { t } = useLang()
  const p = t.privacy

  const sections: PageSection[] = [
    {
      num: 1,
      title: p.s1Title,
      body: {
        type: 'table',
        intro: p.s1Intro,
        cols: [p.s1ColCategory, p.s1ColExamples, p.s1ColPurposes],
        rows: [
          { category: p.s1Row1Category, examples: p.s1Row1Examples, purposes: p.s1Row1Purposes },
          { category: p.s1Row2Category, examples: p.s1Row2Examples, purposes: p.s1Row2Purposes },
        ],
        footnote: p.s1Footnote,
      },
    },
    {
      num: 2,
      title: p.s2Title,
      body: { type: 'cards', cards: p.s2Cards },
    },
    {
      num: 3,
      title: p.s3Title,
      body: { type: 'bullets', points: p.s3Points },
    },
    {
      num: 4,
      title: p.s4Title,
      body: { type: 'text', body: p.s4Body },
    },
    {
      num: 5,
      title: p.s5Title,
      body: {
        type: 'infobox',
        p1: p.s5p1,
        p2: { pre: p.s5p2part1, bold: p.s5p2bold, post: p.s5p2part2 },
        boxTitle: p.s5InfoTitle,
        items: p.s5Items,
      },
    },
    {
      num: 6,
      title: p.s6Title,
      body: {
        type: 'contact',
        p1: { pre: p.s6p1part1, name: p.s6p1person, post: p.s6p1part2 },
        p2: p.s6p2,
        cards: [
          { icon: MapPin, label: p.s6AddressLabel, value: '1309 Rue Arthur-Dupéré, Québec (QC) G1C 0M1' },
          { icon: Mail,   label: p.s6EmailLabel,   value: 'info@cuisinexpressrepas.ca', href: 'mailto:info@cuisinexpressrepas.ca' },
          { icon: Phone,  label: p.s6PhoneLabel,   value: '581-992-9952', href: 'tel:5819929952' },
        ],
      },
    },
    {
      num: 7,
      title: p.s7Title,
      body: { type: 'text', body: p.s7Body },
    },
  ]

  return (
    <div className="min-h-screen bg-cx-page transition-colors duration-300">

      {/* ── Hero banner ── */}
      <div className="relative w-full h-36 sm:h-44 md:h-52 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1a0608] to-[#7B2535]" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #C41E3A 0%, transparent 60%), radial-gradient(circle at 80% 50%, #7B2535 0%, transparent 60%)' }} />
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="max-w-[1380px] mx-auto w-full px-3 sm:px-4 lg:px-6">
            <ol className="flex items-center gap-1.5 text-[13px] text-white/50 mb-3">
              <li>
                <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
                  <Home size={13} />
                  {t.common.home}
                </Link>
              </li>
              <li><ChevronRight size={12} /></li>
              <li className="text-white/80 font-medium">{p.breadcrumb}</li>
            </ol>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15
                flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={22} className="text-[#C41E3A]" />
              </div>
              <div>
                <p className="text-white/50 text-[12px] font-semibold tracking-widest uppercase mb-1">
                  {p.heroTag}
                </p>
                <h1 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {p.heroTitle}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-[1380px] mx-auto px-3 sm:px-4 lg:px-6 py-12">

        {/* Intro card */}
        <motion.div
          custom={0}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`${cardClass} px-8 sm:px-12 py-8 mb-8`}
        >
          <p className="text-[15px] text-cx-body leading-[1.85] max-w-4xl">
            {p.introPart1}
            <span className="font-semibold text-cx-base">{p.introLaw}</span>
            {p.introPart2}
          </p>
        </motion.div>

        {/* Sections — data-driven */}
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <motion.div
              key={section.num}
              custom={section.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: section.num * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={cardClass}
            >
              <div className="flex items-center gap-4 px-8 sm:px-12 pt-7 pb-5 border-b border-cx-line">
                <span className="w-8 h-8 rounded-xl bg-[#C41E3A]/10 text-[#C41E3A] text-[13px] font-extrabold
                  flex items-center justify-center flex-shrink-0">
                  {section.num}
                </span>
                <h2 className="text-[17px] font-extrabold text-cx-base tracking-tight">
                  {section.title}
                </h2>
              </div>
              <SectionBody body={section.body} />
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}
