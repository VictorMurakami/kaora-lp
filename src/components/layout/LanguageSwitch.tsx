'use client'

import { locales } from '@/i18n/config'
import { useLocale } from '@/i18n/LocaleProvider'

const localeLabels = { 'pt-BR': 'PT', en: 'EN', es: 'ES' }

/** Switches the page language in place; the choice is kept for the next visit. */
export function LanguageSwitch({ label }: { label?: string }) {
  const { dict, locale, setLocale } = useLocale()
  return (
    <div className="language-switch" role="group" aria-label={label ?? dict.studio.language}>
      {locales.map((language) => (
        <button
          key={language}
          type="button"
          lang={language}
          aria-pressed={language === locale}
          onClick={() => setLocale(language)}
        >
          {localeLabels[language]}
        </button>
      ))}
    </div>
  )
}
