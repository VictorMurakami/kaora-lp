import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/design-system' },
    sitemap: new URL('/sitemap.xml', SITE_URL).href,
    host: SITE_URL.origin,
  }
}
