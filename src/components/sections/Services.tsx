import { ArrowUpRight, Code2, Smartphone, Workflow, Network, Sparkles, Plus } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { AnimatedDisclosure } from '@/components/ui/AnimatedDisclosure'
import type { Dictionary } from '@/content'

const serviceIcons = [Code2, Smartphone, Workflow, Network, Sparkles]

export function Services({ dict }: { dict: Dictionary }) {
  return (
    <section id="services" className="content-section services-section">
      <Container>
        <SectionLabel number="01">{dict.studio.servicesLabel}</SectionLabel>
        <div className="section-intro">
          <h2 className="section-title" data-reveal>
            {dict.studio.servicesIntro}
          </h2>
          <p className="section-description">{dict.studio.servicesBody}</p>
        </div>
        <div className="services-list">
          {dict.services.items.map((service, index) => {
            const Icon = serviceIcons[index]
            return (
              <AnimatedDisclosure
                className="service-item"
                key={service.title}
                reveal={index % 3}
                summary={
                  <>
                    <span className="service-index">0{index + 1}</span>
                    <Icon className="service-icon" size={24} aria-hidden />
                    <h3>{service.title}</h3>
                    <span className="service-tags">{dict.studio.serviceTags[index]}</span>
                    <Plus className="service-toggle" size={22} aria-hidden />
                  </>
                }
              >
                <div className="service-detail">
                  <p>{service.text}</p>
                  <a href="#contact" className="text-link">
                    {dict.hero.ctaPrimary}
                    <ArrowUpRight size={16} aria-hidden />
                  </a>
                </div>
              </AnimatedDisclosure>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
