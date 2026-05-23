import { createContext, useContext, useState, useCallback } from 'react'
import translations, { type Lang, type Translations } from '../i18n/translations'

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const LangContext = createContext<LangContextValue>({
  lang: 'fr',
  setLang: () => {},
  t: translations.fr,
})

function getInitialLang(): Lang {
  const stored = localStorage.getItem('cx-lang')
  if (stored === 'fr' || stored === 'en') return stored
  // Respect browser locale — default to French for Quebec
  const browser = navigator.language.toLowerCase()
  return browser.startsWith('en') ? 'en' : 'fr'
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('cx-lang', l)
    document.documentElement.lang = l
  }, [])

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  return useContext(LangContext)
}
