'use client'

import { useEffect, useRef, type ReactNode, type MouseEvent } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { tokens } from '@/design-system/tokens'

type AnimatedDisclosureProps = {
  summary: ReactNode
  children: ReactNode
  className?: string
  reveal?: number | boolean
}

export function AnimatedDisclosure({
  summary,
  children,
  className,
  reveal,
}: AnimatedDisclosureProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation | null>(null)
  const expandedRef = useRef(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      animationRef.current?.cancel()
      if (detailsRef.current) detailsRef.current.open = expandedRef.current
    }
    return () => {
      animationRef.current?.cancel()
    }
  }, [reducedMotion])

  function toggle(event: MouseEvent<HTMLElement>) {
    event.preventDefault()
    const details = detailsRef.current
    const content = contentRef.current
    if (!details || !content) return
    const height = content.getBoundingClientRect().height
    const opacity = getComputedStyle(content).opacity
    const wasOpen = details.open
    expandedRef.current = !expandedRef.current
    animationRef.current?.cancel()
    details.dataset.expanded = String(expandedRef.current)
    if (reducedMotion) {
      details.open = expandedRef.current
      return
    }
    details.open = true
    const targetHeight = expandedRef.current ? content.scrollHeight : 0
    const animation = content.animate(
      [
        { height: `${wasOpen ? height : 0}px`, opacity: wasOpen ? opacity : 0 },
        { height: `${targetHeight}px`, opacity: expandedRef.current ? 1 : 0 },
      ],
      {
        duration: tokens.duration.base,
        easing: `cubic-bezier(${tokens.easing.outExpo.join(',')})`,
      },
    )
    animationRef.current = animation
    animation.onfinish = () => {
      details.open = expandedRef.current
      animationRef.current = null
    }
  }

  return (
    <details ref={detailsRef} className={className} data-reveal={reveal}>
      <summary onClick={toggle}>{summary}</summary>
      <div ref={contentRef} className="disclosure-content">
        {children}
      </div>
    </details>
  )
}
