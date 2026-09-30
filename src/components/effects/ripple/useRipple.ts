'use client'

import * as React from 'react'
import { useInView } from 'motion/react'
import { tokens } from '@/design-system/tokens'
import { viewportOnce } from '@/design-system/motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { createWaveField } from './engine'

export type RippleTrigger = 'hover' | 'inview'

// Shared by every 1D text surface this hook drives (nav links via
// GlitchText's `trigger="hover"`, section headings via `trigger="inview"`):
// text is a small, bounded coordinate space — a handful to a few dozen
// characters — so one dur/spread/frontWidth serves both. GlyphField.tsx's
// 2D canvas ring is a much larger coordinate space and tunes its own
// `createWaveField` config to match.
const WAVE_DUR_MS = tokens.duration.slow
const WAVE_SPREAD = 1
const WAVE_FRONT_WIDTH = 3

// A module-level counter, not per-hook state: several GlitchText instances
// can each be mid-wave at once (hovering one nav link while a heading's
// `inview` wave is still finishing), and `window.__rippleLoopActive` is a
// single global tests/e2e/ripple.spec.ts reads — "is *any* ripple loop
// still running", not "is this one instance's". That test ("o loop para
// quando as ondas expiram") is the entire reason this flag exists: without
// it, a test has no way to tell a stopped rAF loop apart from one that's
// merely between frames.
let activeLoopCount = 0
function markLoop(active: boolean): void {
  activeLoopCount += active ? 1 : -1
  if (typeof window !== 'undefined') {
    ;(window as unknown as { __rippleLoopActive?: boolean }).__rippleLoopActive =
      activeLoopCount > 0
  }
}

export type UseRippleResult = {
  /** What to render in the visual (aria-hidden) layer right now. */
  display: string
  /** Attach to the surface's root DOM node — pointer bounding-rect math and
   * the `inview` observer both need it. */
  elementRef: React.RefObject<HTMLElement | null>
  /** Resting width, in px, captured the instant a wave spawns and released
   * (back to `null`) the instant the loop stops — GlitchText pins the
   * element's CSS width to this while it's non-null, so the scramble never
   * shifts layout. */
  width: number | null
  /** Event handlers to spread onto the root node — only populated for
   * `trigger === 'hover'`; `inview` needs no handlers, just the ref. */
  bind: Pick<React.HTMLAttributes<HTMLElement>, 'onPointerEnter' | 'onPointerMove'>
}

export function useRipple(text: string, trigger: RippleTrigger): UseRippleResult {
  const reduced = useReducedMotion()
  const elementRef = React.useRef<HTMLElement | null>(null)

  // One wave field per mounted instance, created once and reused for the
  // component's whole lifetime — same discipline as GlyphField.tsx's own
  // `gridRef`: engine state lives in a ref, not React state, because it
  // mutates every animation frame and none of that belongs in a re-render.
  const fieldRef = React.useRef<ReturnType<typeof createWaveField> | null>(null)
  if (fieldRef.current === null) {
    fieldRef.current = createWaveField({
      dur: WAVE_DUR_MS,
      spread: WAVE_SPREAD,
      frontWidth: WAVE_FRONT_WIDTH,
    })
  }

  const [display, setDisplay] = React.useState(text)
  const [width, setWidth] = React.useState<number | null>(null)

  const rafRef = React.useRef<number | null>(null)
  const loopingRef = React.useRef(false)
  const lastOriginRef = React.useRef<number | null>(null)
  const firedOnceRef = React.useRef(false)

  // The text prop itself can change (locale switch, a dictionary edit) —
  // resync the resting display whenever it does, as long as nothing is
  // mid-animation right now (a running loop already owns `display` every
  // frame; stomping on it here would just be a race).
  React.useEffect(() => {
    if (!loopingRef.current) setDisplay(text)
  }, [text])

  const stopLoop = React.useCallback(() => {
    if (!loopingRef.current) return
    loopingRef.current = false
    markLoop(false)
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    setWidth(null)
  }, [])

  const startLoop = React.useCallback(() => {
    if (loopingRef.current) return
    const field = fieldRef.current!

    // Pin the width to whatever it is right now — before this frame's
    // scramble has drawn a single character — so there is nothing for the
    // browser to reflow around once GLITCH_CHARS characters (which don't
    // share CHARSET/GLITCH_CHARS's font-measured advance width with every
    // letter in `text`) start appearing.
    const el = elementRef.current
    if (el) setWidth(el.getBoundingClientRect().width)

    loopingRef.current = true
    markLoop(true)

    function tick() {
      const now = performance.now()
      field.prune(now)
      if (field.active(now) === 0) {
        setDisplay(text)
        stopLoop()
        return
      }
      let next = ''
      for (let i = 0; i < text.length; i++) {
        const sample = field.sample({ at: i, now })
        next += sample.scrambling ? sample.char : text[i]
      }
      setDisplay(next)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [stopLoop, text])

  const spawnAt = React.useCallback(
    (index: number) => {
      if (reduced) return
      fieldRef.current!.spawn({ at: index, now: performance.now() })
      startLoop()
    },
    [reduced, startLoop],
  )

  // Where along `text` a clientX pointer position falls, as a character
  // index — the wave's origin for the hover surface (task-23-brief.md:
  // "pulso do ponto do cursor").
  const originIndexFromPointer = React.useCallback(
    (clientX: number): number => {
      const el = elementRef.current
      if (!el || text.length === 0) return 0
      const rect = el.getBoundingClientRect()
      const fraction = rect.width === 0 ? 0 : (clientX - rect.left) / rect.width
      return Math.round(Math.min(1, Math.max(0, fraction)) * (text.length - 1))
    },
    [text],
  )

  const onPointerEnter = React.useCallback(
    (e: React.PointerEvent) => {
      if (trigger !== 'hover' || reduced) return
      const index = originIndexFromPointer(e.clientX)
      lastOriginRef.current = index
      spawnAt(index)
    },
    [trigger, reduced, originIndexFromPointer, spawnAt],
  )

  // A new wave only when the pointer has actually moved to a different
  // character — same "only when the cell changes" discipline GlyphField.tsx
  // applies to the 2D grid, so dragging across the link doesn't spawn a
  // wave every pixel.
  const onPointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (trigger !== 'hover' || reduced) return
      const index = originIndexFromPointer(e.clientX)
      if (lastOriginRef.current === index) return
      lastOriginRef.current = index
      spawnAt(index)
    },
    [trigger, reduced, originIndexFromPointer, spawnAt],
  )

  // `inview`: the section-heading surface, "pulso da esquerda, uma vez".
  // Reuses `viewportOnce` (`{ once: true, amount: 0.25 }`) and
  // `motion/react`'s `useInView` — the exact pair Section.tsx already
  // drives its own entrance animation with, so there's one mechanism in
  // the codebase for "has this scrolled into view yet", not two.
  const inView = useInView(elementRef as React.RefObject<HTMLElement>, viewportOnce)
  React.useEffect(() => {
    if (trigger !== 'inview' || reduced || firedOnceRef.current || !inView) return
    firedOnceRef.current = true
    spawnAt(0)
  }, [trigger, reduced, inView, spawnAt])

  React.useEffect(() => stopLoop, [stopLoop])

  const bind = trigger === 'hover' ? { onPointerEnter, onPointerMove } : {}

  return {
    display: reduced ? text : display,
    elementRef,
    width,
    bind,
  }
}
