import { useLang } from '../contexts/LangContext'
import type { Lang } from '../i18n/translations'

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLang()

  return (
    <div className={`flex items-center bg-cx-fill border border-cx-edge
      rounded-xl overflow-hidden text-[12.5px] font-bold tracking-wide
      ${className ?? ''}`}>
      {(['fr', 'en'] as Lang[]).map((l, i) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-3 py-1.5 transition-all duration-200 uppercase
            ${lang === l
              ? 'bg-[#7B2535] text-white shadow-inner'
              : 'text-cx-soft hover:text-[#7B2535] hover:bg-cx-muted'
            } ${i === 0 ? '' : 'border-l border-cx-edge'}`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
