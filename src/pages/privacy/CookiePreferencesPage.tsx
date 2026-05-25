import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, ChevronRight, ShieldCheck, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { useLang } from '../../contexts/LangContext'

type Consent = 'accept' | 'refuse'

type CategoryId = 'essential' | 'customization' | 'advertising' | 'analytics'

const CATEGORY_IDS: CategoryId[] = ['essential', 'customization', 'advertising', 'analytics']
const CATEGORY_DEFAULTS: Record<CategoryId, Consent> = {
  essential: 'accept',
  customization: 'refuse',
  advertising: 'refuse',
  analytics: 'refuse',
}

export default function CookiePreferencesPage() {
  const navigate = useNavigate()
  const { t } = useLang()
  const c = t.cookies

  const [consents, setConsents] = useState<Record<string, Consent>>(
    Object.fromEntries(CATEGORY_IDS.map((id) => [id, CATEGORY_DEFAULTS[id]]))
  )
  const [expanded, setExpanded] = useState<string | null>(null)

  const reset = () =>
    setConsents(Object.fromEntries(CATEGORY_IDS.map((id) => [id, CATEGORY_DEFAULTS[id]])))

  const save = () => {
    localStorage.setItem('cx-privacy', JSON.stringify(consents))
    toast.success(c.savedMessage)
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-cx-page transition-colors duration-300">

      {/* Breadcrumb bar */}
      <div className="w-full bg-cx-card border-b border-cx-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1.5 text-[13px] text-cx-soft">
            <li>
              <Link to="/" className="flex items-center gap-1 hover:text-[#C41E3A] transition-colors">
                <Home size={13} />
                {t.common.home}
              </Link>
            </li>
            <li><ChevronRight size={12} /></li>
            <li className="text-cx-base font-medium">{c.breadcrumb}</li>
          </ol>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-cx-card rounded-2xl border border-cx-line
              shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden"
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

            <div className="px-6 sm:px-8 py-7">

              {/* Heading */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#C41E3A]/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={18} className="text-[#C41E3A]" />
                </div>
                <h1 className="text-[20px] font-extrabold text-cx-base tracking-tight">
                  {c.title}
                </h1>
              </div>

              <div className="h-px bg-cx-line mb-5" />

              {/* Intro */}
              <p className="text-[13.5px] text-cx-soft leading-relaxed mb-3">{c.intro1}</p>
              <p className="text-[13.5px] text-cx-soft leading-relaxed mb-6">
                {c.intro2}{' '}
                <Link to="/politique" className="text-[#C41E3A] hover:underline underline-offset-2 font-medium">
                  {c.policyLinkText}
                </Link>.
              </p>

              <div className="h-px bg-cx-line mb-2" />

              {/* Categories */}
              <div className="flex flex-col divide-y divide-cx-line">
                {CATEGORY_IDS.map((id) => {
                  const cat = c[id]
                  const required = id === 'essential'
                  return (
                    <div key={id}>
                      <div className="flex items-center justify-between py-4 gap-4">
                        <button
                          onClick={() => setExpanded((p) => (p === id ? null : id))}
                          className="flex items-center gap-2.5 text-left group flex-1 min-w-0"
                        >
                          <ChevronDown
                            size={15}
                            className={`flex-shrink-0 text-cx-soft group-hover:text-[#C41E3A]
                              transition-all duration-200 ${expanded === id ? 'rotate-180' : ''}`}
                          />
                          <span className="text-[14px] font-bold text-cx-base
                            group-hover:text-[#C41E3A] transition-colors duration-200">
                            {cat.name}
                          </span>
                        </button>

                        {required ? (
                          <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1
                            bg-cx-fill rounded-full text-[12px] font-semibold text-cx-soft border border-cx-edge">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A]" />
                            {c.requiredLabel}
                          </span>
                        ) : (
                          <div className="flex items-center gap-4 flex-shrink-0">
                            {(['refuse', 'accept'] as Consent[]).map((val) => (
                              <label key={val} className="flex items-center gap-1.5 cursor-pointer group/radio">
                                <div className="relative">
                                  <input
                                    type="radio"
                                    name={id}
                                    value={val}
                                    checked={consents[id] === val}
                                    onChange={() => setConsents((s) => ({ ...s, [id]: val }))}
                                    className="sr-only"
                                  />
                                  <div className={`w-4 h-4 rounded-full border-2 transition-colors flex items-center justify-center
                                    ${consents[id] === val ? 'border-[#7B2535]' : 'border-cx-edge'}`}>
                                    {consents[id] === val && (
                                      <div className="w-2 h-2 rounded-full bg-[#7B2535]" />
                                    )}
                                  </div>
                                </div>
                                <span className={`text-[12.5px] font-semibold capitalize transition-colors
                                  ${consents[id] === val ? 'text-[#7B2535]' : 'text-cx-soft group-hover/radio:text-cx-body'}`}>
                                  {val === 'accept' ? c.accept : c.refuse}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      <AnimatePresence initial={false}>
                        {expanded === id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <p className="pb-4 pl-7 text-[13px] text-cx-soft leading-relaxed">
                              {cat.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>

              <div className="h-px bg-cx-line mt-2 mb-6" />

              {/* Actions */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={reset}
                  className="px-5 py-2.5 rounded-full border-2 border-[#7B2535] text-[#7B2535]
                    text-[13px] font-bold hover:bg-[#7B2535] hover:text-white
                    transition-all duration-200"
                >
                  {c.reset}
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-5 py-2.5 rounded-full border-2 border-cx-edge text-cx-soft
                      text-[13px] font-bold hover:border-cx-muted hover:text-cx-body
                      transition-all duration-200"
                  >
                    {c.cancel}
                  </button>
                  <button
                    onClick={save}
                    className="px-6 py-2.5 rounded-full bg-[#7B2535] hover:bg-[#9B3045]
                      text-white text-[13px] font-bold transition-all duration-200
                      hover:shadow-[0_4px_16px_rgba(123,37,53,0.35)]"
                  >
                    {c.save}
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
