import { useState, useEffect } from 'react'

type Lang = 'fr' | 'en'

function getCombo(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>('.goog-te-combo')
}

function fireChange(el: HTMLSelectElement) {
  el.dispatchEvent(new Event('change'))
}

function currentLang(): Lang {
  const combo = getCombo()
  if (!combo) return 'fr'
  return combo.value === 'en' ? 'en' : 'fr'
}

export default function LanguageSwitcher({ className }: { className?: string }) {
  const [lang, setLang] = useState<Lang>('fr')
  const [ready, setReady] = useState(false)

  // Poll until the GT combo select is injected into the DOM
  useEffect(() => {
    const id = setInterval(() => {
      if (getCombo()) {
        setReady(true)
        setLang(currentLang())
        clearInterval(id)
      }
    }, 300)
    return () => clearInterval(id)
  }, [])

  const switchTo = (target: Lang) => {
    const combo = getCombo()
    if (!combo) return
    if (target === 'en') {
      combo.value = 'en'
      fireChange(combo)
    } else {
      // Restore original French — GT uses empty string or a special "Show original" action
      combo.value = ''
      fireChange(combo)
      // Fallback: click the "Show original" link that GT injects
      const showOriginal = document.querySelector<HTMLElement>('.goog-te-menu-value')
      if (showOriginal) showOriginal.click()
    }
    setLang(target)
  }

  return (
    <div className={`flex items-center bg-gray-50 border border-gray-200
      rounded-xl overflow-hidden text-[12.5px] font-bold tracking-wide
      ${!ready ? 'opacity-50 pointer-events-none' : ''} ${className ?? ''}`}>
      {(['fr', 'en'] as Lang[]).map((l, i) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={`px-3 py-1.5 transition-all duration-200 uppercase
            ${lang === l
              ? 'bg-[#7B2535] text-white shadow-inner'
              : 'text-gray-400 hover:text-[#7B2535] hover:bg-gray-100'
            } ${i === 0 ? '' : 'border-l border-gray-200'}`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
