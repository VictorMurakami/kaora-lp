'use client'

import { useEffect } from 'react'
import { animate, motion, useScroll, useSpring } from 'motion/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { springs } from '@/design-system/motion'
import { interaction } from '@/design-system/interaction'

export function ScrollExperience() {
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, springs.snappy)

  useEffect(() => {
    if (reducedMotion || navigator.hardwareConcurrency <= 4) return
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal], .section-brand-mark')
    const animations: ReturnType<typeof animate>[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          observer.unobserve(entry.target)
          const element = entry.target as HTMLElement
          const isBrandMark = element.classList.contains('section-brand-mark')
          animations.push(
            animate(
              element,
              {
                opacity: [0.3, 1],
                y: isBrandMark ? 0 : [interaction.revealDistance, 0],
                rotate: isBrandMark ? [-60, 0] : 0,
              },
              {
                duration: interaction.duration.slow,
                ease: interaction.ease,
                delay: (Number(element.dataset.reveal) || 0) * interaction.stagger,
              },
            ),
          )
        })
      },
      { threshold: 0.12 },
    )

    elements.forEach((element) => {
      if (element.getBoundingClientRect().top >= window.innerHeight) observer.observe(element)
    })

    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.stop())
      elements.forEach((element) => {
        element.style.removeProperty('opacity')
        element.style.removeProperty('transform')
      })
    }
  }, [reducedMotion])

  if (reducedMotion) return null
  return <motion.div className="reading-progress" style={{ scaleX: progress }} aria-hidden />
}
