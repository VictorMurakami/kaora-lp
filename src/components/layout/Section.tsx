'use client'
import * as React from 'react'
import { motion, useInView } from 'motion/react'
import { cn } from '@/lib/utils'
import { stagger, viewportOnce } from '@/design-system/motion'

export type SectionProps = {
  id?: string
  className?: string
  children: React.ReactNode
}

// Progressive enhancement, not a runtime preference check, is what keeps this
// SSR-safe. `stagger()`'s own `hidden`/`visible` values carry no opacity or
// transform (they only orchestrate `staggerChildren` timing) — the actual
// fade/slide lives on each child's own variants (e.g. `fadeUp`), inherited
// from whichever state this section is in via Motion's variant propagation.
// That propagated state is controlled by `animate`, and:
//
//   - `initial={false}` means Motion never applies a "hidden" pose at mount.
//     SSR, no-JS, and the very first hydrated paint all render children in
//     whatever `animate` resolves to at that instant — which starts as
//     `'visible'`, a plain `useState` default with no server/client branch,
//     so there's nothing here for hydration to "correct" and no flash.
//   - Only after mount does an effect decide whether to arm the entrance:
//     if the user has NOT asked for reduced motion AND the section is not
//     already inside the viewport, it flips to `'hidden'`. That flip is
//     invisible by construction — the section is off-screen — so it doesn't
//     matter that it happens after paint or that the transition briefly
//     "animates" toward invisible.
//   - `useInView` (once: true) then reports `true` for real, exactly when the
//     visitor scrolls the section into view, and the render below turns that
//     straight into `'visible'` — no extra effect copying it into state, just
//     the normal Motion transition playing on the way back.
//   - Content already on screen at mount, or any content when reduced motion
//     is on, never gets armed in the first place: `armed` stays `false`, so
//     the derived state below is `'visible'` forever. It is never
//     retroactively hidden, because doing so would be the one case a user
//     could actually see it happen.
export function Section({ id, className, children }: SectionProps) {
  const ref = React.useRef<HTMLElement>(null)
  const inView = useInView(ref, viewportOnce)
  const [armed, setArmed] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const rect = el.getBoundingClientRect()
    const alreadyOnScreen = rect.top < window.innerHeight && rect.bottom > 0
    if (alreadyOnScreen) return
    setArmed(true)
  }, [])

  const state = armed && !inView ? 'hidden' : 'visible'

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={false}
      animate={state}
      variants={stagger()}
      className={cn('py-20 sm:py-28 lg:py-36', className)}
    >
      {children}
    </motion.section>
  )
}
