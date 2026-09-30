import { tokens } from './tokens'

export const interaction = {
  duration: {
    fast: tokens.duration.fast / 1000,
    base: tokens.duration.base / 1000,
    slow: tokens.duration.slow / 1000,
  },
  ease: tokens.easing.outExpo,
  revealDistance: 24,
  stagger: 0.06,
  tilt: { x: 12, y: 16 },
  sculpture: {
    pointerDuration: 700,
    scrollDuration: 450,
    morphDuration: 1400,
    strandDelay: 7,
  },
  workspace: { rotation: -2, entrance: 48 },
} as const
