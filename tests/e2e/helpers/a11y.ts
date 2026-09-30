import type { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// wcag22aa is the newest tag axe-core ships; keeping all three explicit
// (rather than relying on axe's own "latest" alias) means the set we audit
// against is pinned here, not wherever axe-core's defaults drift to next.
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag22aa']

export type AuditA11yOptions = {
  /**
   * CSS selector(s) to scope the audit to (forwarded to `AxeBuilder#include`).
   * Omit to audit the whole page.
   */
  include?: string[]
  /**
   * Upper bound, in ms, on how long `settleAnimations` will wait for
   * in-flight animations to finish before giving up and auditing whatever
   * is on screen. Needs to comfortably clear the slowest entrance preset
   * (`tokens.duration.slower`, currently 1200ms) plus stagger delay, not
   * the length of any ambient/looping animation — those never finish, so
   * this is a "stop waiting" bound, not a "wait this long" one.
   */
  settleTimeout?: number
}

/**
 * Waits for the page's entrance animations to reach their resting state,
 * then runs an axe audit for WCAG 2 A/AA + WCAG 2.2 AA and returns the
 * violations for the caller to assert on.
 *
 * Every future section spec should reach for this instead of hand-rolling
 * `new AxeBuilder({ page }).analyze()`: axe composites colours against
 * whatever is on screen at the instant it runs, so an audit taken mid
 * fade/stagger measures a blended, transient colour pair instead of the
 * resting-state pair WCAG 1.4.3 is actually about. Settling first is what
 * makes the result deterministic and meaningful.
 */
export async function auditA11y(page: Page, options: AuditA11yOptions = {}) {
  await settleAnimations(page, options.settleTimeout)

  let builder = new AxeBuilder({ page }).withTags(WCAG_TAGS)
  for (const selector of options.include ?? []) {
    builder = builder.include(selector)
  }

  const results = await builder.analyze()
  return results.violations
}

/**
 * Waits until the page stops visibly changing, using two independent
 * signals combined, because either one alone has a blind spot:
 *
 *   - `document.getAnimations()` (filtered to *finite* animations — see
 *     below) catches Motion's entrance transitions directly, the same way
 *     it would catch a plain CSS transition.
 *   - A `MutationObserver` on `style`/`class` attributes catches everything
 *     else. This turned out to be load-bearing, not defensive dressing:
 *     `staggerChildren` gives each child its own delay, and Motion doesn't
 *     appear to create/register a child's `Animation` until that child's
 *     delay actually elapses. Checking `getAnimations()` alone can hit
 *     three quiet frames while a later-staggered child's animation simply
 *     hasn't been created *yet*, declare victory, and let axe run into the
 *     exact mid-fade blended-colour race this helper exists to prevent —
 *     confirmed empirically: the first version of this helper (animations-
 *     only) still flaked, and always on the last-staggered items. Motion
 *     mirrors its animated values onto the element's inline `style` on
 *     every tick regardless of whether the animation itself is
 *     WAAPI-accelerated, so the mutation observer sees a late-starting
 *     stagger child the instant it actually begins, even before it has an
 *     `Animation` object to query.
 *
 * "Finite" is the load-bearing word for the animations check: the design
 * system page (like any animation-heavy page) legitimately hosts
 * `iterations: Infinity` animations — a spinner, an idle glyph-field loop —
 * that are never going to reach a finished state by design. Waiting on
 * those would degrade this into a fixed `timeout` sleep on any page that
 * has one running, regardless of how quickly the entrance itself settles.
 *
 * The loop exits once neither signal has fired for a few consecutive
 * frames, or `timeout` is hit as a last-resort safety net — not the normal
 * exit path.
 */
async function settleAnimations(page: Page, timeout = 4000): Promise<void> {
  await page.evaluate(async (timeoutMs) => {
    const deadline = performance.now() + timeoutMs
    const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    const isFinite = (animation: Animation) => animation.effect?.getTiming().iterations !== Infinity
    const hasFiniteAnimationInFlight = () =>
      document
        .getAnimations()
        .some(
          (animation) =>
            isFinite(animation) && (animation.playState === 'running' || animation.pending),
        )

    let mutated = false
    const observer = new MutationObserver(() => {
      mutated = true
    })
    observer.observe(document.documentElement, {
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: true,
    })

    let quietFrames = 0
    while (quietFrames < 3 && performance.now() < deadline) {
      mutated = false
      await frame()
      if (mutated || hasFiniteAnimationInFlight()) {
        quietFrames = 0
      } else {
        quietFrames++
      }
    }

    observer.disconnect()
  }, timeout)
}
