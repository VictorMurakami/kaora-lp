// Shared shapes for the ripple wave engine (engine.ts) and its two
// renderers — GlyphField's 2D canvas ring and GlitchText's 1D hover/inview
// text surfaces (useRipple.ts). Plain data only, same discipline as
// glyph-field/types.ts: no DOM, no canvas, no anime.js, so engine.ts stays
// pure and testable without a browser (see tests/unit/ripple.test.ts).
//
// This file — and engine.ts — is the one thing task-23-brief.md means by
// "um motor, três superfícies": a wave doesn't know or care whether `at` is
// a character index or a grid cell. It only needs `distanceBetween` (in
// engine.ts) to make sense of whatever shape it's given, consistently.

/** A position on the 1D surfaces: a plain character index. */
export type Position1D = number
/** A position on the 2D surface: a [col, row] pair in the canvas grid. */
export type Position2D = readonly [number, number]
export type Position = Position1D | Position2D

export type WaveFieldConfig = {
  /** How long a wave lives, in ms, from spawn to expiry. */
  dur: number
  /**
   * How far (in position-units — character indices, or grid cells) the
   * wave's front travels over its full `dur`, as a multiple of the
   * engine's own internal reach scale (see `REACH_PER_SPREAD_UNIT` in
   * engine.ts). A surface with a much larger coordinate space (the 40x24
   * canvas grid vs. an 8-character nav link) passes a larger `spread` so
   * its wave still crosses its own space in one lifetime.
   */
  spread: number
  /**
   * Width, in position-units, of the scrambling band trailing the wave's
   * current radius. This is the whole effect: narrow it and a pulse
   * travels through material; widen it toward the radius itself and it's
   * just a blur following the cursor (task-23-brief.md says this
   * explicitly — "sem ela vira um borrão que segue o mouse"). Defaults to
   * `DEFAULT_FRONT_WIDTH` (engine.ts) when omitted.
   */
  frontWidth?: number
  /**
   * 1 (default) or 2. Documentation only — `distanceBetween` (engine.ts)
   * auto-detects from the actual shape of the positions passed to
   * `spawn`/`sample`, so this never changes engine behaviour. It exists so
   * a config literal reads as a decision, not an accident.
   */
  dims?: 1 | 2
}

export type SpawnInput = { at: Position; now: number }
export type SampleInput = { at: Position; now: number }

export type SampleResult = {
  /** The wave's front has swept as far as this position, at least once. */
  reached: boolean
  /**
   * This position is currently inside the narrow scrambling band — the
   * one flag every renderer actually branches on. `reached` alone would
   * make the interior (already passed, long since back at rest) keep
   * showing glitch output forever, which is exactly the "heating" model
   * this engine replaces.
   */
  scrambling: boolean
  /**
   * 0 at the trailing edge of the scrambling band, up to 1 at the leading
   * edge (the front itself). Always 0 when `scrambling` is false. For a
   * renderer that wants to fade a glyph in rather than switch it on like a
   * light (GlyphField's alpha/wobble, e.g.).
   */
  intensity: number
  /**
   * A single deterministic pick from `GLITCH_CHARS` for this exact
   * (position, instant) pair. Same inputs always give the same character
   * (tests/unit/ripple.test.ts, "não é aleatório") — without that, a
   * re-render (or two renderers sampling the same wave) would flicker
   * between frames that shouldn't disagree.
   */
  char: string
}

// The scramble pool for the wave front — unordered, on purpose: chaos, not a
// scale. Kept to plain ASCII punctuation and digits, which every font covers,
// so a scrambling letter never falls back to another font mid-word. Digits
// read as terminal output, which is the point.
export const GLITCH_CHARS = '.,·-~+:;=*"!?&#$@0123456789' as const
