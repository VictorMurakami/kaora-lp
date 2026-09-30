'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useRipple } from './useRipple'
import type { RippleTrigger } from './useRipple'

export type GlitchTextProps = {
  as: 'a' | 'span' | 'h2'
  text: string
  trigger: RippleTrigger
  className?: string
} & Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
    href?: string
  }

// The reference implementation this task replaces (task-23-brief.md, "A
// acessibilidade que a referência não trata") mutates `el.textContent`
// directly. On a link, that makes a screen reader announce scrambled
// garbage mid-hover. This component renders two layers instead:
//
//   - `aria-label`, set once to `text` and never touched again — the
//     accessible name a screen reader actually reads. It is not derived
//     from DOM content, so nothing the animation does to the visible
//     characters can change it.
//   - a single `aria-hidden="true"` child carrying `display` — the only
//     thing a sighted user sees, and the only thing that ever scrambles.
//
// Width is pinned (via `useRipple`'s `width`) the instant a wave spawns and
// released the instant the loop stops, so swapping in GLITCH_CHARS glyphs —
// which don't share `text`'s own characters' advance widths — never shifts
// layout.
export function GlitchText({
  as: Tag,
  text,
  trigger,
  className,
  style,
  href,
  ...rest
}: GlitchTextProps) {
  const { display, elementRef, width, bind } = useRipple(text, trigger)
  const Component = Tag as React.ElementType

  return (
    <Component
      ref={elementRef}
      aria-label={text}
      href={Tag === 'a' ? href : undefined}
      className={cn('relative inline-block', className)}
      style={width != null ? { ...style, width: `${width}px` } : style}
      {...bind}
      {...rest}
    >
      <span aria-hidden="true">{display}</span>
    </Component>
  )
}
