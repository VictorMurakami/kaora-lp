import { defaultLocale, isLocale, locales, type Locale } from './config'

export const LOCALE_COOKIE = 'kaora-locale'
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/** Picks the best supported locale from an Accept-Language header. */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale

  const preferred = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, qValue] = part.trim().split(';q=')
      return { tag: tag.trim(), quality: qValue ? Number(qValue) : 1 }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const { tag } of preferred) {
    const exact = locales.find((locale) => locale.toLowerCase() === tag.toLowerCase())
    if (exact) return exact

    const language = tag.split('-')[0]?.toLowerCase()
    const partial = locales.find((locale) => locale.split('-')[0].toLowerCase() === language)
    if (partial) return partial
  }

  return defaultLocale
}

/** A saved choice wins over the browser language. */
export function resolveLocale(
  saved: string | null | undefined,
  acceptLanguage: string | null | undefined,
): Locale {
  return saved && isLocale(saved) ? saved : negotiateLocale(acceptLanguage)
}
