import type { Locale } from '@/i18n/config'
import ptBR from './pt-BR'
import en from './en'
import es from './es'
import type { Dictionary } from './pt-BR'

const dictionaries: Record<Locale, Dictionary> = {
  'pt-BR': ptBR,
  en,
  es,
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

export type { Dictionary }
