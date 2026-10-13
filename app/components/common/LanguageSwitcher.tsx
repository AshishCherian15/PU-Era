'use client'

import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'

type Language = 'en' | 'kn' | 'hi'

const LANGUAGES: Record<Language, { nativeName: string }> = {
  en: { nativeName: 'English' },
  kn: { nativeName: 'ಕನ್ನಡ' },
  hi: { nativeName: 'हिंदी' },
}

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState<Language>('en')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved && LANGUAGES[saved]) setLanguage(saved)
  }, [])

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang)
    localStorage.setItem('language', newLang)
    setIsOpen(false)
    window.location.reload()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-brand-green transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span>{LANGUAGES[language].nativeName}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
            {(Object.entries(LANGUAGES) as [Language, { nativeName: string }][]).map(([code, cfg]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                  language === code ? 'bg-emerald-50 text-brand-green' : 'text-slate-700'
                }`}
              >
                {cfg.nativeName}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
