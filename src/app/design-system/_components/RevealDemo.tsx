'use client'

import { useRef } from 'react'
import { animate } from 'motion/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { interaction } from '@/design-system/interaction'

const items = ['Título', 'Item 1', 'Item 2']

// The first pass comes from ScrollExperience itself (this page mounts it);
// the replay repeats the same keyframes so the curve can be watched again.
export function RevealDemo() {
  const listRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  function replay() {
    const elements = listRef.current?.querySelectorAll<HTMLElement>('[data-reveal]')
    elements?.forEach((element) => {
      animate(
        element,
        { opacity: [0.3, 1], y: [interaction.revealDistance, 0] },
        {
          duration: interaction.duration.slow,
          ease: interaction.ease,
          delay: (Number(element.dataset.reveal) || 0) * interaction.stagger,
        },
      )
    })
  }

  return (
    <div data-testid="reveal-demo">
      <div ref={listRef} className="ds-reveal">
        {items.map((label, index) => (
          <div key={label} data-reveal={index} data-testid={`reveal-demo-item-${index}`}>
            <span>data-reveal=&quot;{index}&quot;</span>
            {label} · atraso de {Math.round(index * interaction.stagger * 1000)}ms
          </div>
        ))}
      </div>
      <div className="ds-reveal-controls">
        {reducedMotion ? (
          <p>Movimento reduzido ativo: os itens já estão no lugar e não se movem.</p>
        ) : (
          <button type="button" className="text-link" onClick={replay}>
            Repetir a entrada
          </button>
        )}
      </div>
    </div>
  )
}
