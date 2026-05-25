import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ChevronRight, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react'
import { useLang } from '../../contexts/LangContext'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

export default function PrivacyPage() {
  const { t } = useLang()
  const p = t.privacy

  const contactItems = [
    { icon: MapPin, label: p.s6AddressLabel, value: '1309 Rue Arthur-Dupéré, Québec (QC) G1C 0M1', href: undefined },
    { icon: Mail,   label: p.s6EmailLabel,   value: 'info@cuisinexpressrepas.ca', href: 'mailto:info@cuisinexpressrepas.ca' },
    { icon: Phone,  label: p.s6PhoneLabel,   value: '581-992-9952', href: 'tel:5819929952' },
  ]

  return (
    <div className="min-h-screen bg-cx-page transition-colors duration-300">

      {/* ── Hero banner ── */}
      <div className="relative w-full h-52 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1a0608] to-[#7B2535]" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #C41E3A 0%, transparent 60%), radial-gradient(circle at 80% 50%, #7B2535 0%, transparent 60%)' }} />
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Intro card */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-cx-card rounded-2xl border border-cx-line
            shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] px-8 sm:px-12 py-8 mb-8"
        >
          <p className="text-[15px] text-cx-body leading-[1.85] max-w-4xl">
            {p.introPart1}<span className="font-semibold text-cx-base">{p.introLaw}</span>{p.introPart2}
          </p>
        </motion.div>

        {/* Sections */}
        <div className="flex flex-col gap-6">

          {/* Section 1 */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 sm:px-12 pt-7 pb-5 border-b border-cx-line">
              <span className="w-8 h-8 rounded-xl bg-[#C41E3A]/10 text-[#C41E3A] text-[13px] font-extrabold
                flex items-center justify-center flex-shrink-0">1</span>
              <h2 className="text-[17px] font-extrabold text-cx-base tracking-tight">{p.s1Title}</h2>
            </div>
            <div className="px-8 sm:px-12 py-6 flex flex-col gap-5">
              <p className="text-[14px] text-cx-soft leading-relaxed">{p.s1Intro}</p>
              <div className="rounded-xl border border-cx-line overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[540px] text-[13.5px]">
                  <thead>
                    <tr className="bg-cx-fill">
                      <th className="text-left px-5 py-3.5 font-semibold text-cx-base border-b border-cx-line w-1/4">{p.s1ColCategory}</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-cx-base border-b border-cx-line w-1/3">{p.s1ColExamples}</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-cx-base border-b border-cx-line">{p.s1ColPurposes}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cx-line">
                    <tr className="align-top">
                      <td className="px-5 py-4 font-semibold text-cx-base">{p.s1Row1Category}</td>
                      <td className="px-5 py-4 text-cx-soft">{p.s1Row1Examples}</td>
                      <td className="px-5 py-4 text-cx-soft">
                        <ul className="list-disc list-inside space-y-1">
                          {p.s1Row1Purposes.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      </td>
                    </tr>
                    <tr className="align-top bg-cx-fill">
                      <td className="px-5 py-4 font-semibold text-cx-base">{p.s1Row2Category}</td>
                      <td className="px-5 py-4 text-cx-soft">{p.s1Row2Examples}</td>
                      <td className="px-5 py-4 text-cx-soft">{p.s1Row2Purposes}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[13px] text-cx-soft italic">{p.s1Footnote}</p>
            </div>
          </motion.div>

          {/* Section 2 */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 sm:px-12 pt-7 pb-5 border-b border-cx-line">
              <span className="w-8 h-8 rounded-xl bg-[#C41E3A]/10 text-[#C41E3A] text-[13px] font-extrabold
                flex items-center justify-center flex-shrink-0">2</span>
              <h2 className="text-[17px] font-extrabold text-cx-base tracking-tight">{p.s2Title}</h2>
            </div>
            <div className="px-8 sm:px-12 py-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              {p.s2Cards.map(({ title, body }) => (
                <div key={title} className="rounded-xl bg-cx-fill border border-cx-line px-5 py-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A] flex-shrink-0" />
                    <p className="text-[14px] font-bold text-cx-base">{title}</p>
                  </div>
                  <p className="text-[13px] text-cx-soft leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 3 */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 sm:px-12 pt-7 pb-5 border-b border-cx-line">
              <span className="w-8 h-8 rounded-xl bg-[#C41E3A]/10 text-[#C41E3A] text-[13px] font-extrabold
                flex items-center justify-center flex-shrink-0">3</span>
              <h2 className="text-[17px] font-extrabold text-cx-base tracking-tight">{p.s3Title}</h2>
            </div>
            <div className="px-8 sm:px-12 py-6 flex flex-col gap-3">
              {p.s3Points.map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C41E3A]/50 flex-shrink-0" />
                  <p className="text-[14px] text-cx-soft leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 4 */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 sm:px-12 pt-7 pb-5 border-b border-cx-line">
              <span className="w-8 h-8 rounded-xl bg-[#C41E3A]/10 text-[#C41E3A] text-[13px] font-extrabold
                flex items-center justify-center flex-shrink-0">4</span>
              <h2 className="text-[17px] font-extrabold text-cx-base tracking-tight">{p.s4Title}</h2>
            </div>
            <div className="px-8 sm:px-12 py-6">
              <p className="text-[14px] text-cx-soft leading-relaxed">{p.s4Body}</p>
            </div>
          </motion.div>

          {/* Section 5 */}
          <motion.div custom={5} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 sm:px-12 pt-7 pb-5 border-b border-cx-line">
              <span className="w-8 h-8 rounded-xl bg-[#C41E3A]/10 text-[#C41E3A] text-[13px] font-extrabold
                flex items-center justify-center flex-shrink-0">5</span>
              <h2 className="text-[17px] font-extrabold text-cx-base tracking-tight">{p.s5Title}</h2>
            </div>
            <div className="px-8 sm:px-12 py-6 flex flex-col gap-5">
              <p className="text-[14px] text-cx-soft leading-relaxed">{p.s5p1}</p>
              <p className="text-[14px] text-cx-soft leading-relaxed">
                {p.s5p2part1}<span className="font-semibold text-cx-base">{p.s5p2bold}</span>{p.s5p2part2}
              </p>
              <div className="rounded-xl bg-cx-fill border border-cx-line px-6 py-5">
                <p className="text-[13px] font-semibold text-cx-base mb-3">{p.s5InfoTitle}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                  {p.s5Items.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="mt-[7px] w-1 h-1 rounded-full bg-[#C41E3A]/60 flex-shrink-0" />
                      <span className="text-[13px] text-cx-soft">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 6 */}
          <motion.div custom={6} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 sm:px-12 pt-7 pb-5 border-b border-cx-line">
              <span className="w-8 h-8 rounded-xl bg-[#C41E3A]/10 text-[#C41E3A] text-[13px] font-extrabold
                flex items-center justify-center flex-shrink-0">6</span>
              <h2 className="text-[17px] font-extrabold text-cx-base tracking-tight">{p.s6Title}</h2>
            </div>
            <div className="px-8 sm:px-12 py-6 flex flex-col gap-5">
              <p className="text-[14px] text-cx-soft leading-relaxed">
                {p.s6p1part1}<span className="font-semibold text-cx-base">{p.s6p1person}</span>{p.s6p1part2}
              </p>
              <p className="text-[14px] text-cx-soft leading-relaxed">{p.s6p2}</p>

              {/* Contact card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
                {contactItems.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3 rounded-xl bg-cx-fill
                    border border-cx-line px-5 py-4">
                    <div className="w-9 h-9 rounded-lg bg-[#C41E3A]/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-[#C41E3A]" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-cx-soft uppercase tracking-wide mb-0.5">{label}</p>
                      {href
                        ? <a href={href} className="text-[13px] font-semibold text-[#C41E3A] hover:underline underline-offset-2">{value}</a>
                        : <p className="text-[13px] font-semibold text-cx-base leading-snug">{value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Section 7 */}
          <motion.div custom={7} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 sm:px-12 pt-7 pb-5 border-b border-cx-line">
              <span className="w-8 h-8 rounded-xl bg-[#C41E3A]/10 text-[#C41E3A] text-[13px] font-extrabold
                flex items-center justify-center flex-shrink-0">7</span>
              <h2 className="text-[17px] font-extrabold text-cx-base tracking-tight">{p.s7Title}</h2>
            </div>
            <div className="px-8 sm:px-12 py-6">
              <p className="text-[14px] text-cx-soft leading-relaxed">{p.s7Body}</p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
