import type { Locale } from '@/i18n/config'

export const SITE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kaorabr.com')
export const SITE_NAME = 'Kaora'
export const THEME_COLOR = '#0a0a0b'

export const OG_LOCALES: Record<Locale, string> = {
  'pt-BR': 'pt_BR',
  en: 'en_US',
  es: 'es_ES',
}
