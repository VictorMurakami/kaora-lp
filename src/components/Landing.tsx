'use client'

import { useLocale } from '@/i18n/LocaleProvider'
import { Header } from '@/components/layout/Header'
import { SkipLink } from '@/components/layout/SkipLink'
import { Footer } from '@/components/layout/Footer'
import { FloatingContact } from '@/components/layout/FloatingContact'
import { ScrollExperience } from '@/components/effects/ScrollExperience'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { Playground } from '@/components/sections/Playground'
import { Process } from '@/components/sections/Process'
import { Principles } from '@/components/sections/Principles'
import { Faq } from '@/components/sections/Faq'
import { Contact } from '@/components/sections/Contact'

export function Landing() {
  const { dict, locale } = useLocale()

  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <ScrollExperience />
        <Hero dict={dict} locale={locale} />
        <Services dict={dict} />
        <Playground copy={dict.playground} />
        <Process dict={dict} />
        <Principles dict={dict} />
        <Faq dict={dict} />
        <Contact dict={dict} locale={locale} />
      </main>
      <Footer />
      <FloatingContact />
    </>
  )
}
