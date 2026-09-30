import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { Dictionary } from '@/content'

export function Principles({ dict }: { dict: Dictionary }) {
  return (
    <section className="content-section principles-section">
      <Container>
        <SectionLabel number="04">{dict.studio.principlesLabel}</SectionLabel>
        <h2 className="section-title" data-reveal>
          {dict.studio.principlesTitle}
        </h2>
        <div className="principles-grid">
          {dict.differentiators.items.map((item, index) => (
            <article key={item.title} data-reveal={index}>
              <div className="principle-marker">
                <span>0{index + 1}</span>
                <ArrowUpRight size={21} aria-hidden />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
