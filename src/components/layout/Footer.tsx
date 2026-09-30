'use client'

import Link from 'next/link'
import { ArrowUp } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Container } from '@/components/layout/Container'
import { ContactLink } from '@/components/ui/ContactLink'
import { whatsappHref, mailtoHref } from '@/lib/contact'
import { useLocale } from '@/i18n/LocaleProvider'

// Reference pages drop the contact actions and point back to the site instead.
export type FooterProps = { contacts?: boolean; topHref?: string }

export function Footer({ contacts = true, topHref = '#hero' }: FooterProps) {
  const { dict } = useLocale()
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-top">
          <div>
            <Logo className="footer-logo" />
            <p>{dict.footer.tagline}</p>
          </div>
          <div className="footer-links">
            {contacts ? (
              <>
                <ContactLink source="footer" href={whatsappHref()} data-testid="footer-whatsapp">
                  {dict.contact.direct.whatsapp}
                </ContactLink>
                <a href={mailtoHref()} data-testid="footer-email">
                  {dict.contact.direct.email}
                </a>
                <Link href="/design-system">
                  Design system
                  <ArrowUp className="rotate-45" size={14} aria-hidden />
                </Link>
              </>
            ) : (
              <Link href="/">
                {dict.footer.site}
                <ArrowUp className="rotate-45" size={14} aria-hidden />
              </Link>
            )}
          </div>
          <a href={topHref} className="back-top" aria-label={dict.studio.backTop}>
            <ArrowUp size={21} aria-hidden />
          </a>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Kaora. {dict.footer.rights}
          </p>
          <span>{dict.studio.footerNote}</span>
        </div>
      </Container>
    </footer>
  )
}
