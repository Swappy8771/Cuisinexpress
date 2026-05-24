import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, ChevronRight, ShieldCheck, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

type Consent = 'accept' | 'refuse'

interface Category {
  id: string
  name: string
  description: string
  required: boolean
  default: Consent
}

const CATEGORIES: Category[] = [
  {
    id: 'essential',
    name: 'Essential',
    description: 'Essential cookies and scripts are crucial for the operation of our website. They enable visitors to navigate our website and use its basic features, such as accessing secure areas of the website, opening navigation, and displaying content. You cannot disable essential cookies.',
    required: true,
    default: 'accept',
  },
  {
    id: 'customization',
    name: 'Customization',
    description: 'Allow the website to remember the choices you make (such as your username, language, or region) and offer enhanced, more personalized features. For example, a website can provide you with local weather forecasts or traffic information by storing data about your general location.',
    required: false,
    default: 'refuse',
  },
  {
    id: 'advertising',
    name: 'Targeted advertising',
    description: 'Used to deliver ads that are more relevant to you and your interests. It can also be used to limit the number of times you see an ad and to measure the effectiveness of advertising campaigns. Ad networks usually place them with the website operator\'s permission.',
    required: false,
    default: 'refuse',
  },
  {
    id: 'analytics',
    name: 'Analyses',
    description: 'Analytics allow us to count visits and traffic sources to the website, so we can measure and improve its performance. Analytics help us understand which pages are the most and least popular and how visitors navigate the site. All information collected from analytics cookies is aggregated and anonymous.',
    required: false,
    default: 'refuse',
  },
]

export default function CookiePreferencesPage() {
  const navigate = useNavigate()
  const [consents, setConsents] = useState<Record<string, Consent>>(
    Object.fromEntries(CATEGORIES.map((c) => [c.id, c.default]))
  )
  const [expanded, setExpanded] = useState<string | null>(null)

  const reset = () =>
    setConsents(Object.fromEntries(CATEGORIES.map((c) => [c.id, c.default])))

  const save = () => {
    localStorage.setItem('cx-privacy', JSON.stringify(consents))
    toast.success('Preferences saved.')
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">

      {/* Breadcrumb bar */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1.5 text-[13px] text-gray-400">
            <li>
              <Link to="/" className="flex items-center gap-1 hover:text-[#C41E3A] transition-colors">
                <Home size={13} />
                Accueil
              </Link>
            </li>
            <li><ChevronRight size={12} /></li>
            <li className="text-[#0A0A0A] font-medium">Préférences de confidentialité</li>
          </ol>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-white rounded-2xl border border-gray-100
              shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden"
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

            <div className="px-6 sm:px-8 py-7">

              {/* Heading */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0F2] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={18} className="text-[#C41E3A]" />
                </div>
                <h1 className="text-[20px] font-extrabold text-[#0A0A0A] tracking-tight">
                  Préférences de confidentialité
                </h1>
              </div>

              <div className="h-px bg-gray-100 mb-5" />

              {/* Intro */}
              <p className="text-[13.5px] text-gray-500 leading-relaxed mb-3">
                When you visit websites, they may store or retrieve data about you using cookies and
                similar technologies. Cookies may be necessary for the basic functionality of the website
                as well as for other purposes. You have the option to disable certain types of cookies,
                although this may impact your experience on the website.
              </p>
              <p className="text-[13.5px] text-gray-500 leading-relaxed mb-6">
                Your selection can be modified at any time, see{' '}
                <Link to="/politique" className="text-[#C41E3A] hover:underline underline-offset-2 font-medium">
                  our data management policy
                </Link>.
              </p>

              <div className="h-px bg-gray-100 mb-2" />

              {/* Categories */}
              <div className="flex flex-col divide-y divide-gray-100">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between py-4 gap-4">
                      {/* Clickable heading toggle */}
                      <button
                        onClick={() => setExpanded((p) => (p === cat.id ? null : cat.id))}
                        className="flex items-center gap-2.5 text-left group flex-1 min-w-0"
                      >
                        <ChevronDown
                          size={15}
                          className={`flex-shrink-0 text-gray-400 group-hover:text-[#C41E3A]
                            transition-all duration-200 ${expanded === cat.id ? 'rotate-180' : ''}`}
                        />
                        <span className="text-[14px] font-bold text-[#0A0A0A]
                          group-hover:text-[#C41E3A] transition-colors duration-200">
                          {cat.name}
                        </span>
                      </button>

                      {/* Controls */}
                      {cat.required ? (
                        <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1
                          bg-gray-50 rounded-full text-[12px] font-semibold text-gray-400 border border-gray-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A]" />
                          Accept
                        </span>
                      ) : (
                        <div className="flex items-center gap-4 flex-shrink-0">
                          {(['refuse', 'accept'] as Consent[]).map((val) => (
                            <label key={val} className="flex items-center gap-1.5 cursor-pointer group/radio">
                              <div className="relative">
                                <input
                                  type="radio"
                                  name={cat.id}
                                  value={val}
                                  checked={consents[cat.id] === val}
                                  onChange={() => setConsents((s) => ({ ...s, [cat.id]: val }))}
                                  className="sr-only"
                                />
                                <div className={`w-4 h-4 rounded-full border-2 transition-colors flex items-center justify-center
                                  ${consents[cat.id] === val ? 'border-[#7B2535]' : 'border-gray-300'}`}>
                                  {consents[cat.id] === val && (
                                    <div className="w-2 h-2 rounded-full bg-[#7B2535]" />
                                  )}
                                </div>
                              </div>
                              <span className={`text-[12.5px] font-semibold capitalize transition-colors
                                ${consents[cat.id] === val ? 'text-[#7B2535]' : 'text-gray-400 group-hover/radio:text-gray-600'}`}>
                                {val === 'accept' ? 'Accept' : 'Refuse'}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Collapsible description */}
                    <AnimatePresence initial={false}>
                      {expanded === cat.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="pb-4 pl-7 text-[13px] text-gray-400 leading-relaxed">
                            {cat.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-100 mt-2 mb-6" />

              {/* Actions */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={reset}
                  className="px-5 py-2.5 rounded-full border-2 border-[#7B2535] text-[#7B2535]
                    text-[13px] font-bold hover:bg-[#7B2535] hover:text-white
                    transition-all duration-200"
                >
                  Reset
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-5 py-2.5 rounded-full border-2 border-gray-300 text-gray-500
                      text-[13px] font-bold hover:border-gray-400 hover:text-gray-700
                      transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={save}
                    className="px-6 py-2.5 rounded-full bg-[#7B2535] hover:bg-[#9B3045]
                      text-white text-[13px] font-bold transition-all duration-200
                      hover:shadow-[0_4px_16px_rgba(123,37,53,0.35)]"
                  >
                    Save
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
