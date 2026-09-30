import { describe, it, expect } from 'vitest'
import { fadeUp, blurIn, stagger, springs } from '@/design-system/motion'
import { tokens } from '@/design-system/tokens'

describe('presets de motion', () => {
  it('todo preset tem hidden e visible', () => {
    for (const preset of [fadeUp, blurIn]) {
      expect(preset).toHaveProperty('hidden')
      expect(preset).toHaveProperty('visible')
    }
  })

  it('as durações saem dos tokens e não de números soltos', () => {
    const visible = fadeUp.visible as { transition: { duration: number } }
    expect(visible.transition.duration).toBe(tokens.duration.base / 1000)
  })

  it('fadeUp anima só transform e opacity', () => {
    const keys = Object.keys(fadeUp.hidden as object)
    expect(keys.sort()).toEqual(['opacity', 'y'])
  })

  it('stagger devolve transição com delayChildren', () => {
    expect(stagger(0.08).visible.transition.staggerChildren).toBe(0.08)
  })

  it('springs têm stiffness e damping definidos', () => {
    expect(springs.snappy).toMatchObject({ type: 'spring' })
    expect(typeof springs.snappy.stiffness).toBe('number')
    expect(typeof springs.snappy.damping).toBe('number')
  })
})
