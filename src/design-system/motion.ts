import type { Variants } from 'motion/react'
import { tokens } from './tokens'

const s = (ms: number) => ms / 1000

export const springs = {
  snappy: { type: 'spring', stiffness: 420, damping: 32, mass: 0.8 },
  soft: { type: 'spring', stiffness: 180, damping: 26, mass: 1 },
} as const

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: s(tokens.duration.base), ease: tokens.easing.outExpo },
  },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: s(tokens.duration.base), ease: tokens.easing.outExpo },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: s(tokens.duration.base), ease: tokens.easing.outExpo },
  },
}

// blurIn é o único preset que toca `filter`, quebrando de propósito a regra de
// animar só transform e opacity. Roda uma vez na entrada da seção, nunca em
// loop, o que está dentro da permissão da spec de motion.
export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 16 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: s(tokens.duration.slow), ease: tokens.easing.outExpo },
  },
}

export const revealText: Variants = {
  hidden: { opacity: 0, y: '0.6em' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: s(tokens.duration.slow), ease: tokens.easing.outExpo },
  },
}

export function stagger(step = 0.06, delay = 0) {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: step, delayChildren: delay } },
  } satisfies Variants
}

export const viewportOnce = { once: true, amount: 0.25 } as const

// anime.js (the imperative layer: glyph field, Process arc, shared timelines)
// takes durations in milliseconds natively — the same unit `tokens.duration`
// already uses — so it reads `tokens.duration.base` etc. directly, no
// conversion helper. Import it only by subpath (e.g. `animejs/timeline`,
// `animejs/text`, `animejs/svg`, `animejs/scope`, `animejs/events` for
// `onScroll`), never from the package root, so the whole library isn't
// pulled into the bundle.
