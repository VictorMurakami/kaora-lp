import { GLITCH_CHARS } from './types'
import type {
  Position,
  Position2D,
  SampleInput,
  SampleResult,
  SpawnInput,
  WaveFieldConfig,
} from './types'

// The one mechanism behind all three ripple surfaces (task-23-brief.md,
// "Um motor, três superfícies"): a list of waves, each with its own origin
// and spawn instant, that a renderer can ask "what's happening at this
// position, right now". Nothing below touches the DOM, a canvas, or
// `Date.now()` — `now` always arrives as a parameter, which is what keeps
// tests/unit/ripple.test.ts deterministic. A real clock would make "same
// position and instant give the same character" unfalsifiable.
//
// This replaces the glyph field's old proximity -> energy -> per-cell
// advance-and-retreat model (glyph-field/cursor.ts, now gutted). That model
// answered "how warm is this cell" as a continuous function of distance —
// which is exactly why it read as heating, not glitch. This one instead
// tracks discrete, expiring waves and answers a binary "is the front here
// right now", narrowed to `frontWidth`. Widening that band back out toward
// the wave's own radius would quietly reintroduce the old blur; the
// narrowness is not a tuning knob, it's the whole effect.

type Wave = { origin: Position; startAt: number }

// Default width, in position-units, of the scrambling band trailing a
// wave's front, for a caller that doesn't supply its own
// (`WaveFieldConfig.frontWidth`). Every ripple.test.ts case that cares
// about the band passes this same value explicitly — this is just what a
// caller gets who has no opinion of their own.
export const DEFAULT_FRONT_WIDTH = 3

// One unit of `spread` (WaveFieldConfig) means "the wave's front travels
// this many position-units by the time it fully expires (`dur` ms after
// spawn)". `spread` is a plain multiplier on top of this fixed scale — an
// 8-character nav link and a 40x24 canvas grid each pick a `spread` sized
// to their own coordinate space, without this engine needing to know which
// is which.
const REACH_PER_SPREAD_UNIT = 20

function distanceBetween(a: Position, b: Position): number {
  if (Array.isArray(a) || Array.isArray(b)) {
    const [ax, ay] = a as Position2D
    const [bx, by] = b as Position2D
    return Math.hypot(ax - bx, ay - by)
  }
  return Math.abs((a as number) - (b as number))
}

function elapsedOf(wave: Wave, now: number): number {
  return now - wave.startAt
}

function isAlive(wave: Wave, dur: number, now: number): boolean {
  const elapsed = elapsedOf(wave, now)
  return elapsed >= 0 && elapsed <= dur
}

// The wave's current radius: 0 at spawn, growing linearly to
// `spread * REACH_PER_SPREAD_UNIT` right as it expires. Linear, not
// eased — this is a physical front moving at a constant rate, not an
// entrance animation easing toward a resting pose.
function radiusOf(wave: Wave, spread: number, dur: number, now: number): number {
  const elapsed = elapsedOf(wave, now)
  if (elapsed <= 0) return 0
  return (elapsed / dur) * spread * REACH_PER_SPREAD_UNIT
}

// FNV-1a-ish mix with a murmur-style finalizer — deterministic and well
// distributed, no `Math.random()` anywhere near it (same discipline as
// glyph-field/patterns.ts's `hashCell`, just folding N numbers instead of
// two). Only determinism and avalanche matter here; this is not
// cryptographic, and it never needs to be reversed.
function hashNumbers(values: readonly number[]): number {
  let h = 0x811c9dc5
  for (const v of values) {
    h = (h ^ Math.floor(v)) >>> 0
    h = Math.imul(h, 0x01000193) >>> 0
  }
  h ^= h >>> 16
  h = Math.imul(h, 0x85ebca6b) >>> 0
  h ^= h >>> 13
  return (h >>> 0) / 4294967296
}

// A pure function of (position, instant) — ripple.test.ts's sixth case
// ("não é aleatório") pins this: the same pair must always pick the same
// character, and a different `now` almost always picks a different one.
// Deliberately independent of *which* wave is scrambling this position: with
// several waves overlapping, the character a cell shows shouldn't flip
// depending on which wave happens to be first in an internal array.
function charAt(at: Position, now: number): string {
  const values = Array.isArray(at) ? [at[0], at[1], now] : [at as number, now]
  const h = hashNumbers(values)
  const index = Math.floor(h * GLITCH_CHARS.length) % GLITCH_CHARS.length
  return GLITCH_CHARS[index]
}

export function createWaveField(config: WaveFieldConfig) {
  const { dur, spread, frontWidth = DEFAULT_FRONT_WIDTH } = config
  const waves: Wave[] = []

  function spawn({ at, now }: SpawnInput): void {
    waves.push({ origin: at, startAt: now })
  }

  function sample({ at, now }: SampleInput): SampleResult {
    let reached = false
    let scrambling = false
    let intensity = 0

    for (const wave of waves) {
      if (!isAlive(wave, dur, now)) continue
      const dist = distanceBetween(wave.origin, at)
      const radius = radiusOf(wave, spread, dur, now)
      if (dist > radius) continue
      reached = true

      // How far behind the front this position currently sits: 0 is
      // "right at the leading edge", growing means "further into the
      // interior, closer to having already returned to the base
      // character". Only positions within `frontWidth` of the front are
      // the scrambling band.
      const depthIntoFront = radius - dist
      if (depthIntoFront <= frontWidth) {
        scrambling = true
        const localIntensity = 1 - depthIntoFront / frontWidth
        if (localIntensity > intensity) intensity = localIntensity
      }
    }

    return { reached, scrambling, intensity, char: charAt(at, now) }
  }

  // Mutates the store: drops waves that are provably done, so the array
  // (and, upstream, a renderer's rAF loop driven by `active(now) === 0`)
  // doesn't hold onto — or keep animating for — a wave that already died.
  function prune(now: number): void {
    for (let i = waves.length - 1; i >= 0; i--) {
      if (!isAlive(waves[i], dur, now)) waves.splice(i, 1)
    }
  }

  // A pure read: how many waves are alive at this instant, computed live —
  // never relies on `prune` having been called first (tests/unit/
  // ripple.test.ts's overlap case checks `active` right after two spawns,
  // with no prune in between).
  function active(now: number): number {
    let count = 0
    for (const wave of waves) if (isAlive(wave, dur, now)) count++
    return count
  }

  return { spawn, sample, prune, active }
}

export type WaveField = ReturnType<typeof createWaveField>
