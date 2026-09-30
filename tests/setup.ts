import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement `window.matchMedia` — real browsers do, and
// that's what `useReducedMotion` (src/hooks/use-reduced-motion.ts) reads to
// decide whether anything should animate. Task 23 is the first time a
// component under `tests/unit/*.test.tsx` (Header, via the new
// `GlitchText` nav links) renders something that calls it, so nothing
// needed this before. Defaulting `matches` to `false` — "no reduced-motion
// preference" — is the permissive default: it's what lets these component
// tests render their normal, animated tree instead of silently exercising
// only the reduced-motion branch.
// Same story for `IntersectionObserver` — `motion/react`'s `useInView`
// (which `useRipple.ts` uses for the section-heading `trigger="inview"`
// surface, but sets up unconditionally regardless of which trigger a given
// `GlitchText` actually uses) needs one to exist just to mount, even for a
// `trigger="hover"` link like the header nav's that never uses it.
if (typeof globalThis.IntersectionObserver !== 'function') {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null
    readonly rootMargin = ''
    readonly thresholds: ReadonlyArray<number> = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }
  globalThis.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver
}

// Task 25's `OrbitField` (src/components/effects/orbit/OrbitField.tsx)
// observes its own canvas with `ResizeObserver` instead of `window`'s
// resize event, on purpose (a container-driven size change — a font swap
// reflowing Hero's height, say — isn't a viewport resize, and would
// otherwise leave a stale bitmap). jsdom has no `ResizeObserver` at all;
// same reasoning as `IntersectionObserver` above — this only needs to
// exist so mounting doesn't throw, not to actually report real sizes.
if (typeof globalThis.ResizeObserver !== 'function') {
  class MockResizeObserver implements ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver
}

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = function matchMedia(query: string): MediaQueryList {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as unknown as MediaQueryList
  }
}
