import type { Metadata } from 'next'
import { ScrollExperience } from '@/components/effects/ScrollExperience'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SkipLink } from '@/components/layout/SkipLink'
import { DesignSystemContent } from './_components/DesignSystemContent'
import '@/styles/design-system.css'

export const metadata: Metadata = {
  title: 'Design system',
  description: 'Cor, tipografia, ações e padrões que a landing da Kaora usa hoje.',
  robots: { index: false, follow: false },
}

export default function DesignSystemPage() {
  return (
    <>
      <SkipLink />
      <Header navigation={false} />
      <main id="main-content" tabIndex={-1} className="ds-main">
        <ScrollExperience />
        <DesignSystemContent />
      </main>
      <Footer contacts={false} topHref="#main-content" />
    </>
  )
}
