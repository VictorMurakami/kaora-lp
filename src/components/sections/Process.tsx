'use client'

import { useRef } from 'react'
import { motion, useScroll } from 'motion/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { Container } from '@/components/layout/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { Dictionary } from '@/content'

export function Process({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  })
  return (
    <section ref={sectionRef} id="process" className="content-section process-section">
      <Container>
        <SectionLabel number="03">{dict.studio.processLabel}</SectionLabel>
        <div className="process-heading">
          <h2 className="section-title" data-reveal>
            {dict.studio.processLead}
            <span className="muted-heading">{dict.studio.processAccent}</span>
          </h2>
          <svg className="process-map" viewBox="0 0 200 100" fill="none" aria-hidden>
            <path
              d="M15 60 H70 V25 H130 V60 H185"
              stroke="var(--color-paper-border)"
              strokeWidth="2"
            />
            <motion.path
              d="M15 60 H70 V25 H130 V60 H185"
              stroke="var(--color-brand-600)"
              strokeWidth="2"
              style={{ pathLength: reducedMotion ? 1 : scrollYProgress }}
            />
            {[15, 70, 130, 185].map((x, index) => (
              <g key={x}>
                <circle
                  cx={x}
                  cy={index === 1 || index === 2 ? 25 : 60}
                  r="4"
                  fill="var(--color-ink)"
                />
                <text x={x} y="92" textAnchor="middle" fill="var(--color-paper-muted)" fontSize="9">
                  0{index + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <ol className="process-list">
          {dict.process.items.map((step, index) => (
            <li key={step.title} data-reveal>
              <span className="process-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <div>
                <p>{step.text}</p>
                <span className="process-output">{dict.studio.processOutputs[index]}</span>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
