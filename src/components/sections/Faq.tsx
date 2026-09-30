import { Plus } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { AnimatedDisclosure } from '@/components/ui/AnimatedDisclosure'
import type { Dictionary } from '@/content'

export function Faq({ dict }: { dict: Dictionary }) {
  return (
    <section id="faq" className="content-section faq-section">
      <Container className="faq-grid">
        <div>
          <SectionLabel number="05">{dict.studio.faqLabel}</SectionLabel>
          <h2 className="section-title" data-reveal>
            {dict.faq.title}
          </h2>
        </div>
        <div className="faq-list">
          {dict.faq.items.map((item) => (
            <AnimatedDisclosure
              key={item.question}
              reveal
              summary={
                <>
                  {item.question}
                  <Plus size={20} aria-hidden />
                </>
              }
            >
              <p>{item.answer}</p>
            </AnimatedDisclosure>
          ))}
        </div>
      </Container>
    </section>
  )
}
