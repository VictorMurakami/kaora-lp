import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { ContactLink } from '@/components/ui/ContactLink'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { GenerativeSculpture } from '@/components/effects/GenerativeSculpture'
import { whatsappHref, mailtoHref } from '@/lib/contact'
import type { Dictionary } from '@/content'
import type { Locale } from '@/i18n/config'

export type HeroProps = { dict: Dictionary; locale: Locale }

export function Hero({ dict, locale }: HeroProps) {
  return (
    <section id="hero" data-testid="hero" className="hero-section">
      <Container>
        <div className="hero-grid">
          <div className="hero-copy">
            <div data-testid="hero-badge">
              <SectionLabel>{dict.hero.badge}</SectionLabel>
            </div>
            <h1 className="hero-title" aria-label={dict.hero.headline}>
              <span>{dict.studio.heroLead}</span>
              <span>{dict.studio.heroMiddle}</span>
              <span className="hero-title-accent">{dict.studio.heroAccent}</span>
            </h1>
            <p className="hero-description">{dict.hero.subline}</p>
            <div className="hero-actions">
              <ContactLink
                source="hero"
                href="#contact"
                className="action-link action-primary"
                data-testid="hero-cta-primary"
              >
                {dict.hero.ctaPrimary}
                <ArrowUpRight size={18} aria-hidden />
              </ContactLink>
              <ContactLink
                source="hero"
                href={locale === 'en' ? mailtoHref() : whatsappHref()}
                className="text-link"
                data-testid="hero-cta-secondary"
              >
                {dict.hero.ctaSecondary}
                <ArrowUpRight size={15} aria-hidden />
              </ContactLink>
            </div>
          </div>
          <GenerativeSculpture copy={dict.studio} />
        </div>
        <div className="hero-bottom">
          <a href="#services">
            <ArrowDown size={16} aria-hidden />
            {dict.studio.explore}
          </a>
          <span>{dict.studio.signature}</span>
          <span className="hero-location">{dict.studio.location}</span>
        </div>
      </Container>
    </section>
  )
}
