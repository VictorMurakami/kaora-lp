import type { Metadata, Viewport } from 'next'
import { Archivo } from 'next/font/google'
import './globals.css'
import { getDictionary } from '@/content'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { getRequestLocale } from '@/i18n/server'
import { locales } from '@/i18n/config'
import { OG_LOCALES, SITE_NAME, SITE_URL, THEME_COLOR } from '@/lib/site'

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
})

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const { meta } = getDictionary(locale)
  const google = process.env.GOOGLE_SITE_VERIFICATION
  const bing = process.env.BING_SITE_VERIFICATION
  return {
    metadataBase: SITE_URL,
    // The home tab shows the brand alone; shares keep the descriptive title.
    title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
    description: meta.description,
    applicationName: SITE_NAME,
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: meta.title,
      description: meta.description,
      url: '/',
      locale: OG_LOCALES[locale],
      alternateLocale: locales
        .filter((other) => other !== locale)
        .map((other) => OG_LOCALES[other]),
    },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description },
    verification: {
      ...(google && { google }),
      ...(bing && { other: { 'msvalidate.01': bing } }),
    },
  }
}

export const viewport: Viewport = { themeColor: THEME_COLOR, colorScheme: 'dark' }

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const locale = await getRequestLocale()
  return (
    <html lang={locale} className={`${archivo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  )
}
