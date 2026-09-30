'use client'

import { useEffect, type RefObject } from 'react'
import { animate, stagger } from 'motion/react'
import { useReducedMotion } from './use-reduced-motion'
import { interaction } from '@/design-system/interaction'

export function useAnimatedDialog(ref: RefObject<HTMLDialogElement | null>, open: boolean) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog || (!open && !dialog.open)) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const wasOpen = dialog.open
    if (open && !wasOpen) dialog.showModal()
    dialog.dataset.closing = String(!open)
    function containFocus(event: KeyboardEvent) {
      if (event.key !== 'Tab') return
      const elements = dialog!.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex="0"]',
      )
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    dialog.addEventListener('keydown', containFocus)
    const animation = animate(
      dialog,
      {
        x: reducedMotion ? 0 : open ? (wasOpen ? '0%' : ['100%', '0%']) : '100%',
        opacity: open ? 1 : 0,
      },
      { duration: reducedMotion ? 0 : interaction.duration.base, ease: interaction.ease },
    )
    const items = open
      ? animate(
          dialog.querySelectorAll('[data-menu-item]'),
          { opacity: [0, 1], x: reducedMotion ? 0 : [24, 0] },
          {
            duration: reducedMotion ? 0 : interaction.duration.base,
            delay: reducedMotion ? 0 : stagger(interaction.stagger),
            ease: interaction.ease,
          },
        )
      : null
    let cancelled = false
    void animation.then(() => {
      if (!cancelled && !open) {
        dialog.close()
        document.body.style.overflow = previousOverflow
      }
    })
    return () => {
      cancelled = true
      animation.stop()
      items?.stop()
      dialog.removeEventListener('keydown', containFocus)
      document.body.style.overflow = previousOverflow
    }
  }, [open, reducedMotion, ref])
}
