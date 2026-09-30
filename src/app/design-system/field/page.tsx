import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SkipLink } from '@/components/layout/SkipLink'
import { SculptureLab } from './_components/SculptureLab'
import '@/styles/design-system.css'

export const metadata: Metadata = {
  title: 'Laboratório 3D',
  description: 'A escultura do hero da Kaora em tamanho de estudo: forma, fluxo e órbita.',
  robots: { index: false, follow: false },
}

export default function SculptureLabPage() {
  return (
    <>
      <SkipLink />
      <Header navigation={false} />
      <main id="main-content" tabIndex={-1} className="ds-main">
        <SculptureLab />
      </main>
      <Footer contacts={false} topHref="#main-content" />
    </>
  )
}
