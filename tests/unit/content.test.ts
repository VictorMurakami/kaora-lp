import { describe, it, expect } from 'vitest'
import ptBR from '@/content/pt-BR'
import en from '@/content/en'
import es from '@/content/es'

function paths(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [prefix]
  return Object.entries(obj).flatMap(([k, v]) => paths(v, prefix ? `${prefix}.${k}` : k))
}

describe('dicionários', () => {
  it('EN tem exatamente as mesmas chaves que pt-BR', () => {
    expect(paths(en).sort()).toEqual(paths(ptBR).sort())
  })

  it('ES tem exatamente as mesmas chaves que pt-BR', () => {
    expect(paths(es).sort()).toEqual(paths(ptBR).sort())
  })

  it('nenhum texto usa travessão, nos três idiomas', () => {
    for (const dict of [ptBR, en, es]) {
      const all = JSON.stringify(dict)
      expect(all).not.toMatch(/[—–]/)
    }
  })

  it('nenhum texto ficou vazio', () => {
    for (const dict of [ptBR, en, es]) {
      const empty = paths(dict).filter(
        (p) =>
          String(
            p
              .split('.')
              .reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], dict) ??
              '',
          ).trim() === '',
      )
      expect(empty).toEqual([])
    }
  })

  it('a headline do hero cabe no limite de 8 palavras', () => {
    for (const dict of [ptBR, en, es]) {
      expect(dict.hero.headline.split(/\s+/).length).toBeLessThanOrEqual(8)
    }
  })
})
