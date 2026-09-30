'use client'

import Link from 'next/link'
import { ArrowUpRight, RotateCcw } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SkipLink } from '@/components/layout/SkipLink'
import { StatusPage } from '@/components/layout/StatusPage'
import { useLocale } from '@/i18n/LocaleProvider'

export default function Error({
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  const { dict } = useLocale()
  return (
    <>
      <SkipLink />
      <Header navigation={false} />
      <StatusPage label={dict.error.label} title={dict.error.title} body={dict.error.body}>
        <button type="button" className="action-link action-primary" onClick={() => retry()}>
          {dict.error.retry}
          <RotateCcw size={18} aria-hidden />
        </button>
        <Link href="/" className="text-link">
          {dict.error.home}
          <ArrowUpRight size={15} aria-hidden />
        </Link>
      </StatusPage>
      <Footer />
    </>
  )
}
