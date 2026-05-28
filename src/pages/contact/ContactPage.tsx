import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ChevronRight, Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react'
import { useLang } from '../../contexts/LangContext'

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

const EMPTY: FormState = { name: '', email: '', subject: '', message: '' }

export default function ContactPage() {
  const { t } = useLang()
  const [form, setForm]   = useState<FormState>(EMPTY)
  const [sent, setSent]   = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    setSent(true)
    setForm(EMPTY)
  }

  const contactItems = [
    { icon: Phone,  label: t.contact.phoneLabel,   value: '(581) 992-9952',        href: 'tel:5819929952' },
    { icon: Mail,   label: t.contact.emailLabel,   value: 'info@cuisinexpress.ca', href: 'mailto:info@cuisinexpress.ca' },
    { icon: MapPin, label: t.contact.addressLabel, value: 'Québec, Canada',        href: '#' },
  ]

  return (
    <div className="min-h-screen bg-cx-page transition-colors duration-300">

      {/* Hero banner */}
      <div className="relative w-full h-52 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80"
          alt="Contact"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/20" />
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

      <div className="max-w-[1380px] mx-auto px-3 sm:px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Contact info sidebar ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <h2 className="text-[16px] font-extrabold text-cx-base">
              {t.contact.infoTitle}
            </h2>

            {contactItems.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-start gap-4 p-4 bg-cx-card rounded-2xl border border-cx-line
                  shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:border-[#C41E3A]/20
                  hover:shadow-[0_4px_20px_rgba(196,30,58,0.08)] transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#C41E3A]/10 flex items-center justify-center
                  flex-shrink-0 group-hover:bg-[#C41E3A] transition-colors">
                  <Icon size={17} className="text-[#C41E3A] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[11.5px] text-cx-soft font-semibold uppercase tracking-wide">{label}</p>
                  <p className="text-[14px] font-semibold text-cx-base mt-0.5">{value}</p>
                </div>
              </a>
            ))}
          </motion.div>

          {/* ── Contact form ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-cx-card rounded-2xl border border-cx-line
              shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden">

              <div className="h-1 w-full bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

              <div className="px-7 py-7">
                <h2 className="text-[16px] font-extrabold text-cx-base mb-5 flex items-center gap-2">
                  <Mail size={16} className="text-[#C41E3A]" />
                  {t.contact.formTitle}
                </h2>

                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-8 gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 size={32} className="text-green-500" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-extrabold text-cx-base mb-1">{t.contact.successTitle}</h3>
                      <p className="text-cx-soft text-[13.5px]">{t.contact.successBody}</p>
                    </div>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-2 text-[13px] text-[#C41E3A] font-semibold hover:underline underline-offset-2"
                    >
                      {t.contact.sendAnother}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12.5px] font-semibold text-cx-sub">{t.contact.nameLabel}</label>
                        <input
                          required
                          value={form.name}
                          onChange={set('name')}
                          placeholder={t.contact.namePlaceholder}
                          className="w-full px-4 py-3 rounded-xl border border-cx-edge text-[14px]
                            bg-cx-fill outline-none transition-all placeholder:text-cx-faint
                            focus:bg-cx-card focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12.5px] font-semibold text-cx-sub">{t.contact.emailFormLabel}</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={set('email')}
                          placeholder="marie@email.com"
                          className="w-full px-4 py-3 rounded-xl border border-cx-edge text-[14px]
                            bg-cx-fill outline-none transition-all placeholder:text-cx-faint
                            focus:bg-cx-card focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12.5px] font-semibold text-cx-sub">{t.contact.subjectLabel}</label>
                      <input
                        required
                        value={form.subject}
                        onChange={set('subject')}
                        placeholder={t.contact.subjectPlaceholder}
                        className="w-full px-4 py-3 rounded-xl border border-cx-edge text-[14px]
                          bg-cx-fill outline-none transition-all placeholder:text-cx-faint
                          focus:bg-cx-card focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12.5px] font-semibold text-cx-sub">{t.contact.messageLabel}</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={set('message')}
                        placeholder={t.contact.messagePlaceholder}
                        className="w-full px-4 py-3 rounded-xl border border-cx-edge text-[14px]
                          bg-cx-fill outline-none transition-all resize-none placeholder:text-cx-faint
                          focus:bg-cx-card focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-1 self-end flex items-center gap-2 bg-[#C41E3A] hover:bg-[#a01830]
                        disabled:bg-cx-muted text-white font-bold text-[13.5px] tracking-wide
                        px-8 py-3 rounded-xl transition-all duration-200
                        hover:shadow-[0_4px_20px_rgba(196,30,58,0.35)] hover:-translate-y-0.5
                        active:translate-y-0"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>{t.contact.sending}</span>
                        </span>
                      ) : (
                        <>
                          <Send size={14} />
                          <span>{t.contact.send}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
