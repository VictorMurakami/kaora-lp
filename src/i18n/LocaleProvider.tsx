'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getDictionary, type Dictionary } from '@/content'
import { defaultLocale, type Locale } from './config'
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from './negotiate'

type LocaleContextValue = {
  locale: Locale
  dict: Dictionary
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  initialLocale = defaultLocale,
  children,
}: {
  initialLocale?: Locale
  children: React.ReactNode
}) {
  const [locale, setLocaleState] = useState(initialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo(
    () => ({ locale, dict: getDictionary(locale), setLocale }),
    [locale, setLocale],
  )
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const value = useContext(LocaleContext)
  if (!value) throw new Error('useLocale must be used inside LocaleProvider')
  return value
}
