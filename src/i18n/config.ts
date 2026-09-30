// Locales suportados pela landing page. A ordem é irrelevante para o
// roteamento, mas pt-BR vem primeiro porque é o idioma de origem do copy
// e o padrão quando o Accept-Language não
// corresponde a nenhum dos três.
export const locales = ['pt-BR', 'en', 'es'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'pt-BR'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
