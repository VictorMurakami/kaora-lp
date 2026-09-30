import type { Metadata } from 'next'
import { Landing } from '@/components/Landing'
import { getDictionary } from '@/content'
import { locales } from '@/i18n/config'
import { getRequestLocale } from '@/i18n/server'
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '@/lib/contact'
import { SITE_NAME, SITE_URL } from '@/lib/site'

export const metadata: Metadata = { alternates: { canonical: '/' } }

export default async function HomePage() {
  const dict = getDictionary(await getRequestLocale())
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    url: SITE_URL.href,
    logo: new URL('/icons/icon-512.png', SITE_URL).href,
    image: new URL('/opengraph-image', SITE_URL).href,
    description: dict.meta.description,
    email: CONTACT_EMAIL,
    telephone: `+${WHATSAPP_NUMBER}`,
    address: { '@type': 'PostalAddress', addressCountry: 'BR' },
    knowsLanguage: [...locales],
    serviceType: dict.services.items.map((service) => service.title),
  }
  return (
    <>
      <script
        type="application/ld+json"
        // Escaped so a "<" in the copy can never close the script element.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, '\\u003c') }}
      />
      <Landing />
    </>
  )
}
