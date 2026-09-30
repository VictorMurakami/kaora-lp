'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { revealText, stagger } from '@/design-system/motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export type TextRevealProps = {
  text: string
  className?: string
  style?: React.CSSProperties
}

// Task 10, Step 2: the hero headline's word-by-word entrance. Each word
// sits in its own `overflow: hidden` span so `revealText`'s `y: '0.6em'`
// has something to clip against — without the wrapper the word would
// visibly slide up out of the line below it, instead of resolving into
// place from behind a hard edge.
//
// Same two-layer accessibility split `GlitchText.tsx` uses: the `h1`
// itself carries `aria-label` with the whole sentence, read once with no
// pauses, and every per-word span is `aria-hidden` — the animated content
// is decoration over that name, not a second copy of it. Without this a
// screen reader lands on each word's own hidden span in turn and reads the
// headline with a pause at every clip boundary, which sounds broken.
//
// `useReducedMotion()`'s server snapshot is `true` — its own safe default
// (use-reduced-motion.ts), so a real preference is only known once React
// reconciles against the client's `matchMedia` read post-hydration. SSR and
// the first hydrated paint always take the branch below that renders a
// plain, already-visible `<h1>`: "com movimento reduzido, o texto
// simplesmente aparece" per the brief, and — as a side effect of the same
// safe default — a visitor with no JavaScript at all never sees anything
// else, so the headline is never dependent on the animation branch to be
// readable.
export function TextReveal({ text, className, style }: TextRevealProps) {
  const reduced = useReducedMotion()
  const words = React.useMemo(() => text.split(' '), [text])

  if (reduced) {
    return (
      <h1 aria-label={text} className={className} style={style}>
        {text}
      </h1>
    )
  }

  return (
    <motion.h1
      aria-label={text}
      className={className}
      style={style}
      initial="hidden"
      animate="visible"
      variants={stagger(0.06)}
    >
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <span aria-hidden="true" className="inline-block overflow-hidden align-bottom">
            <motion.span variants={revealText} className="inline-block">
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </motion.h1>
  )
}
