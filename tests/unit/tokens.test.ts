import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { tokens, contrastRatio, cssEasing } from '@/design-system/tokens'

describe('tokens de cor da marca', () => {
  it('usa o laranja exato extraído do asset', () => {
    expect(tokens.color.brand[500]).toBe('#DE4E00')
  })

  it('brand-500 como texto sobre o fundo passa AA', () => {
    expect(contrastRatio(tokens.color.brand[500], tokens.color.semantic.bg)).toBeGreaterThanOrEqual(
      4.5,
    )
  })

  it('ink sobre o campo laranja passa AA, que é a base da estratégia Committed', () => {
    expect(
      contrastRatio(tokens.color.semantic.ink, tokens.color.semantic.field),
    ).toBeGreaterThanOrEqual(4.5)
  })

  it('texto branco sobre laranja reprova, por isso o campo usa ink e nunca branco', () => {
    expect(contrastRatio('#FFFFFF', tokens.color.brand[500])).toBeLessThan(4.5)
  })

  it('brand-600 existe para o caso que precise de label branco', () => {
    expect(contrastRatio('#FFFFFF', tokens.color.brand[600])).toBeGreaterThanOrEqual(4.5)
  })

  it('texto silenciado sobre o fundo passa AA', () => {
    expect(
      contrastRatio(tokens.color.semantic.textMuted, tokens.color.semantic.bg),
    ).toBeGreaterThanOrEqual(4.5)
  })
})

describe('sincronia entre tokens.ts e tokens.css', () => {
  const css = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf-8')

  function cssCubicBezier(varName: string): number[] {
    const match = css.match(new RegExp(`${varName}\\s*:\\s*cubic-bezier\\(([^)]+)\\)`))
    if (!match) throw new Error(`${varName} não encontrado em tokens.css`)
    // Normaliza espaço em branco e estilo de zero à esquerda (.16 vs 0.16)
    // comparando os valores numéricos, não as strings brutas.
    return match[1].split(',').map((n) => parseFloat(n.trim()))
  }

  it('--ease-out-expo no CSS não diverge de tokens.easing.outExpo', () => {
    expect(cssCubicBezier('--ease-out-expo')).toEqual([...tokens.easing.outExpo])
    // cssEasing gera a forma canônica (com zero à esquerda); confirma que ela
    // também é uma cubic-bezier válida com os mesmos quatro valores.
    expect(cssCubicBezier('--ease-out-expo')).toEqual(
      cssEasing(tokens.easing.outExpo)
        .replace(/cubic-bezier\(|\)/g, '')
        .split(',')
        .map((n) => parseFloat(n.trim())),
    )
  })

  it('--ease-in-out-quart no CSS não diverge de tokens.easing.inOutQuart', () => {
    expect(cssCubicBezier('--ease-in-out-quart')).toEqual([...tokens.easing.inOutQuart])
  })
})
