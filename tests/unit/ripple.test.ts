import { describe, it, expect } from 'vitest'
import { createWaveField } from '@/components/effects/ripple/engine'
import { GLITCH_CHARS } from '@/components/effects/ripple/types'

describe('motor de ondas', () => {
  it('uma onda expande com o tempo', () => {
    const f = createWaveField({ dur: 600, spread: 1 })
    f.spawn({ at: 0, now: 0 })
    const r1 = f.sample({ at: 5, now: 100 })
    const r2 = f.sample({ at: 5, now: 400 })
    expect(r2.reached).toBe(true)
    expect(r1.reached).toBe(false)
  })

  it('só a frente da onda embaralha; o miolo volta ao original', () => {
    const f = createWaveField({ dur: 600, spread: 1, frontWidth: 3 })
    f.spawn({ at: 0, now: 0 })
    const frente = f.sample({ at: 10, now: 300 })
    const miolo = f.sample({ at: 1, now: 300 })
    expect(frente.scrambling).toBe(true)
    expect(miolo.scrambling).toBe(false)
  })

  it('ondas expiram e o campo esvazia', () => {
    const f = createWaveField({ dur: 600, spread: 1 })
    f.spawn({ at: 0, now: 0 })
    expect(f.active(100)).toBe(1)
    f.prune(700)
    expect(f.active(700)).toBe(0)
  })

  it('várias ondas coexistem e se sobrepõem', () => {
    const f = createWaveField({ dur: 600, spread: 1 })
    f.spawn({ at: 0, now: 0 })
    f.spawn({ at: 20, now: 50 })
    expect(f.active(100)).toBe(2)
  })

  it('funciona em 2D: a onda alcança por distância euclidiana', () => {
    const f = createWaveField({ dur: 600, spread: 1, dims: 2 })
    f.spawn({ at: [0, 0], now: 0 })
    const perto = f.sample({ at: [3, 4], now: 300 }) // dist 5
    const longe = f.sample({ at: [30, 40], now: 300 }) // dist 50
    expect(perto.reached).toBe(true)
    expect(longe.reached).toBe(false)
  })

  it('o caractere na frente depende da distância e do tempo, não é aleatório', () => {
    const f = createWaveField({ dur: 600, spread: 1, frontWidth: 3 })
    f.spawn({ at: 0, now: 0 })
    const a = f.sample({ at: 10, now: 300 })
    const b = f.sample({ at: 10, now: 300 })
    expect(a.char).toBe(b.char)
    const c = f.sample({ at: 10, now: 340 })
    expect(c.char).not.toBe(a.char)
  })

  it('todo caractere do poço de glitch é monoespaçado na fonte do projeto', () => {
    expect(GLITCH_CHARS).not.toMatch(/[─π┐┌┘┴┬╗╔╝╚╬╠╣╩╦║░▒▓█▄▀▌▐■]/)
  })
})
