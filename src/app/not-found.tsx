'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SkipLink } from '@/components/layout/SkipLink'
import { StatusPage } from '@/components/layout/StatusPage'
import { useLocale } from '@/i18n/LocaleProvider'

export default function NotFound() {
  const { dict } = useLocale()
  return (
    <>
      <SkipLink />
      <Header navigation={false} />
      <StatusPage label={dict.notFound.label} title={dict.notFound.title} body={dict.notFound.body}>
        <Link href="/" className="action-link action-primary">
          {dict.notFound.cta}
          <ArrowUpRight size={18} aria-hidden />
        </Link>
      </StatusPage>
      <Footer contacts={false} topHref="#main-content" />
    </>
  )
}
