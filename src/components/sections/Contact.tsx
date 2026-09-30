import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ContactLink } from '@/components/ui/ContactLink'
import { Symbol } from '@/components/brand/Symbol'
import { mailtoHref, whatsappHref } from '@/lib/contact'
import type { Dictionary } from '@/content'
import type { Locale } from '@/i18n/config'

export function Contact({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section id="contact" className="content-section contact-section">
      <Container>
        <SectionLabel number="06">{dict.studio.contactLabel}</SectionLabel>
        <div className="contact-grid">
          <div>
            <h2>
              {dict.studio.contactLead}
              <span>{dict.studio.contactAccent}</span>
            </h2>
            <p>{dict.studio.contactBody}</p>
          </div>
          <div className="contact-symbol" aria-hidden>
            <Symbol />
          </div>
        </div>
        <div className="contact-bottom">
          <div className="contact-actions">
            <ContactLink
              source="contact"
              href={locale === 'en' ? mailtoHref() : whatsappHref()}
              className="action-link action-dark"
            >
              {dict.hero.ctaSecondary}
              <ArrowUpRight size={20} aria-hidden />
            </ContactLink>
            <ContactLink
              source="contact"
              href={locale === 'en' ? whatsappHref() : mailtoHref()}
              className="text-link"
            >
              {locale === 'en' ? dict.contact.direct.whatsapp : dict.contact.direct.email}
              <ArrowUpRight size={18} aria-hidden />
            </ContactLink>
          </div>
          <p>{dict.contact.sub}</p>
        </div>
      </Container>
    </section>
  )
}
