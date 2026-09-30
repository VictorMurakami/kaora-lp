'use client'

import { Container } from '@/components/layout/Container'
import { GenerativeSculpture } from '@/components/effects/GenerativeSculpture'
import { getDictionary } from '@/content'

// Pinned to Portuguese, like the rest of the design system.
const studio = getDictionary('pt-BR').studio

export function SculptureLab() {
  return (
    <section className="lab-stage" aria-labelledby="lab-title">
      <h1 id="lab-title" className="sr-only">
        Laboratório 3D
      </h1>
      <Container>
        <GenerativeSculpture copy={studio} variant="lab" linkBase="/" />
      </Container>
    </section>
  )
}
