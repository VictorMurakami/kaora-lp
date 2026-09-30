'use client'

import { useLocale } from '@/i18n/LocaleProvider'

export function SkipLink() {
  const { dict } = useLocale()
  return (
    <a href="#main-content" className="skip-link">
      {dict.studio.skip}
    </a>
  )
}
