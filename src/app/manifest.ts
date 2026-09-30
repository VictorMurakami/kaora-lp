import type { MetadataRoute } from 'next'
import { getDictionary } from '@/content'
import { defaultLocale } from '@/i18n/config'
import { SITE_NAME, THEME_COLOR } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  const { meta } = getDictionary(defaultLocale)
  return {
    name: meta.title,
    short_name: SITE_NAME,
    description: meta.description,
    start_url: '/',
    display: 'standalone',
    background_color: THEME_COLOR,
    theme_color: THEME_COLOR,
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
