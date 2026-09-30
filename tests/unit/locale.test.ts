import { describe, expect, it } from 'vitest'
import { negotiateLocale, resolveLocale } from '@/i18n/negotiate'

describe('negociação de idioma', () => {
  it('usa o idioma do navegador na primeira visita', () => {
    expect(negotiateLocale('en-US,en;q=0.9')).toBe('en')
    expect(negotiateLocale('es-AR,es;q=0.8,en;q=0.5')).toBe('es')
    expect(negotiateLocale('pt-PT,pt;q=0.9')).toBe('pt-BR')
  })

  it('respeita a ordem de preferência', () => {
    expect(negotiateLocale('fr;q=1,es;q=0.4,en;q=0.7')).toBe('en')
  })

  it('cai no português quando nada combina ou não há cabeçalho', () => {
    expect(negotiateLocale('fr-FR,de;q=0.8')).toBe('pt-BR')
    expect(negotiateLocale(null)).toBe('pt-BR')
  })

  it('a escolha salva vence o navegador, e valor inválido é ignorado', () => {
    expect(resolveLocale('es', 'en-US')).toBe('es')
    expect(resolveLocale('fr', 'en-US')).toBe('en')
    expect(resolveLocale(undefined, 'es')).toBe('es')
  })
})
