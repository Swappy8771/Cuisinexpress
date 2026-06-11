import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home, ChevronRight, Phone, Mail, MapPin, Clock,
  Send, CheckCircle2, Navigation, AlertCircle, MessageSquare,
} from 'lucide-react'
import { useLang } from '../../contexts/LangContext'
import woodTexture from '../../assets/wooden-texture.png'

interface FormState {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const EMPTY: FormState = { name: '', email: '', phone: '', subject: '', message: '' }

const SUBJECTS_FR = [
  'Question sur une commande',
  'Problème de livraison',
  'Demande de partenariat école',
  'Facturation / paiement',
  'Autre demande',
]
const SUBJECTS_EN = [
  'Order question',
  'Delivery issue',
  'School partnership inquiry',
  'Billing / payment',
  'Other request',
]

const inputCls = `w-full px-4 py-3 rounded-xl border border-cx-edge text-[15px]
  bg-cx-fill text-cx-base outline-none transition-all placeholder:text-cx-soft
  focus:bg-cx-card focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]`

const labelCls = 'text-[14px] font-semibold text-cx-base'

export default function ContactPage() {
  const { t, lang } = useLang()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [sent, setSent]   = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    setSent(true)
    setForm(EMPTY)
  }

  const subjects = lang === 'en' ? SUBJECTS_EN : SUBJECTS_FR

  const infoCards = [
    {
      icon: Phone,
      title: t.contact.phoneLabel,
      value: '(581) 992-9952',
      sub: lang === 'en' ? 'Call us during business hours' : 'Appelez-nous pendant les heures d\'ouverture',
      href: 'tel:5819929952',
    },
    {
      icon: Mail,
      title: t.contact.emailLabel,
      value: 'info@cuisinexpress.ca',
      sub: lang === 'en' ? 'We\'ll respond within 24 hours' : 'Réponse sous 24 heures',
      href: 'mailto:info@cuisinexpress.ca',
    },
    {
      icon: MapPin,
      title: t.contact.addressLabel,
      value: 'Québec, Canada',
      sub: lang === 'en' ? 'Visit our location' : 'Venez nous rendre visite',
      href: '#',
    },
    {
      icon: Clock,
      title: lang === 'en' ? 'Business Hours' : 'Heures d\'ouverture',
      value: 'Lun–Ven: 8h00 – 18h00',
      sub: 'Sam–Dim: 9h00 – 16h00',
      href: null,
    },
  ]

  return (
    <div className="min-h-screen bg-cx-page transition-colors duration-300">

      {/* ── Wood hero banner ── */}
      <div className="relative w-full h-36 sm:h-44 md:h-52 overflow-hidden">
        <img
          src={woodTexture}
          alt="Contact"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="max-w-[1380px] mx-auto w-full px-3 sm:px-4 lg:px-6">
            <ol className="flex items-center gap-1.5 text-[13px] text-white/60 mb-3">
              <li>
                <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
                  <Home size={13} />
                  <span>{t.common.home}</span>
                </Link>
              </li>
              <li><ChevronRight size={12} /></li>
              <li className="text-white font-medium">{t.contact.breadcrumb}</li>
            </ol>
            <h1 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t.contact.title}
            </h1>
            <p className="text-white/70 text-[15px] mt-2">
              {t.contact.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* ── 4 Info cards row ── */}
      <div className="bg-cx-card border-b border-cx-line">
        <div className="max-w-[1380px] mx-auto px-3 sm:px-4 lg:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {infoCards.map(({ icon: Icon, title, value, sub, href }, i) => {
              const inner = (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl
                    bg-cx-fill border border-cx-line
                    hover:border-[#C41E3A]/30 hover:shadow-[0_4px_20px_rgba(196,30,58,0.08)]
                    transition-all duration-200 group h-full"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#C41E3A]/10 flex items-center justify-center
                    group-hover:bg-[#C41E3A] transition-colors duration-200 flex-shrink-0">
                    <Icon size={22} className="text-[#C41E3A] group-hover:text-white transition-colors duration-200" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-cx-soft uppercase tracking-wide mb-1">{title}</p>
                    <p className="text-[16px] font-bold text-cx-base leading-snug">{value}</p>
                    <p className="text-[13px] text-cx-soft mt-1">{sub}</p>
                  </div>
                </motion.div>
              )
              return href
                ? <a key={title} href={href}>{inner}</a>
                : <div key={title}>{inner}</div>
            })}
          </div>
        </div>
      </div>

      {/* ── Form + Right column ── */}
      <div className="max-w-[1380px] mx-auto px-3 sm:px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Message form (2/3 width) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-cx-card rounded-2xl border border-cx-line
              shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

              <div className="px-6 sm:px-8 py-8">
                <h2 className="text-[20px] font-extrabold text-cx-base mb-1 flex items-center gap-2.5">
                  <MessageSquare size={20} className="text-[#C41E3A]" />
                  {t.contact.formTitle}
                </h2>
                <p className="text-[14px] text-cx-soft mb-7">
                  {lang === 'en'
                    ? 'Fill out the form and we\'ll get back to you shortly.'
                    : 'Remplissez le formulaire et nous vous répondrons rapidement.'}
                </p>

                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-12 gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 size={32} className="text-green-500" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-extrabold text-cx-base mb-1">{t.contact.successTitle}</h3>
                      <p className="text-cx-soft text-[15px]">{t.contact.successBody}</p>
                    </div>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-2 text-[14px] text-[#C41E3A] font-semibold hover:underline underline-offset-2"
                    >
                      {t.contact.sendAnother}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Row 1: Full Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className={labelCls}>
                          {t.contact.nameLabel} <span className="text-[#C41E3A]">*</span>
                        </label>
                        <input
                          required
                          value={form.name}
                          onChange={set('name')}
                          placeholder={t.contact.namePlaceholder}
                          className={inputCls}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className={labelCls}>
                          {t.contact.emailFormLabel} <span className="text-[#C41E3A]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={set('email')}
                          placeholder="marie@email.com"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    {/* Row 2: Phone + Subject */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className={labelCls}>
                          {lang === 'en' ? 'Phone Number' : 'Numéro de téléphone'}
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={set('phone')}
                          placeholder="(581) 000-0000"
                          className={inputCls}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className={labelCls}>
                          {t.contact.subjectLabel} <span className="text-[#C41E3A]">*</span>
                        </label>
                        <select
                          required
                          value={form.subject}
                          onChange={set('subject')}
                          className={`${inputCls} cursor-pointer`}
                        >
                          <option value="">
                            {lang === 'en' ? 'Select a subject' : 'Sélectionnez un sujet'}
                          </option>
                          {subjects.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-2">
                      <label className={labelCls}>
                        {t.contact.messageLabel} <span className="text-[#C41E3A]">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={set('message')}
                        placeholder={t.contact.messagePlaceholder}
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="self-end flex items-center gap-2.5 bg-[#C41E3A] hover:bg-[#a01830]
                        disabled:bg-cx-muted text-white font-bold text-[15px] tracking-wide
                        px-8 py-3.5 rounded-xl transition-all duration-200
                        hover:shadow-[0_4px_20px_rgba(196,30,58,0.35)] hover:-translate-y-0.5
                        active:translate-y-0"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>{t.contact.sending}</span>
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>{t.contact.send}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Right column ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col gap-5"
          >

            {/* Find Us Here */}
            <div className="bg-cx-card rounded-2xl border border-cx-line
              shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />
              <div className="px-6 py-7 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#C41E3A]/10 flex items-center justify-center">
                  <MapPin size={24} className="text-[#C41E3A]" />
                </div>
                <div>
                  <h3 className="text-[18px] font-extrabold text-cx-base mb-1">
                    {lang === 'en' ? 'Find Us Here' : 'Notre emplacement'}
                  </h3>
                  <p className="text-[15px] text-cx-soft leading-snug">
                    Québec, Canada
                  </p>
                </div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-full justify-center
                    bg-[#C41E3A] hover:bg-[#a01830] text-white font-bold text-[15px]
                    py-3 rounded-xl transition-all duration-200
                    hover:shadow-[0_4px_20px_rgba(196,30,58,0.35)]"
                >
                  <Navigation size={15} />
                  {lang === 'en' ? 'Get Directions' : 'Itinéraire'}
                </a>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-cx-card rounded-2xl border border-cx-line
              shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-[#7B2535] via-[#C41E3A] to-[#7B2535]" />
              <div className="px-6 py-6 flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <AlertCircle size={18} className="text-[#C41E3A] flex-shrink-0" />
                  <h3 className="text-[17px] font-extrabold text-cx-base">
                    {lang === 'en' ? 'Emergency Contact' : 'Contact urgent'}
                  </h3>
                </div>
                <p className="text-[14px] text-cx-body leading-relaxed">
                  {lang === 'en'
                    ? "For urgent matters regarding your child's meal delivery, please call our emergency hotline:"
                    : 'Pour toute urgence concernant la livraison des repas de votre enfant, appelez notre ligne d\'urgence :'}
                </p>
                <a
                  href="tel:5819929952"
                  className="flex items-center gap-3 mt-1 p-3 rounded-xl bg-[#C41E3A]/8
                    border border-[#C41E3A]/20 hover:bg-[#C41E3A]/15 transition-colors"
                >
                  <Phone size={16} className="text-[#C41E3A] flex-shrink-0" />
                  <span className="text-[16px] font-bold text-[#C41E3A]">(581) 992-9952</span>
                </a>
                <p className="text-[13px] text-cx-soft">
                  {lang === 'en' ? 'Available Mon–Fri, 8:00 AM – 6:00 PM' : 'Disponible Lun–Ven, 8h00 – 18h00'}
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  )
}
