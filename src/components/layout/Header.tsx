'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Container } from '@/components/layout/Container'
import { GlitchText } from '@/components/effects/ripple/GlitchText'
import { whatsappHref, mailtoHref } from '@/lib/contact'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import { LanguageSwitch } from '@/components/layout/LanguageSwitch'
import { useLocale } from '@/i18n/LocaleProvider'
import { useAnimatedDialog } from '@/hooks/use-animated-dialog'

// Reference pages such as the design system show the brand, language and contact
// action without the landing's section navigation.
export type HeaderProps = { navigation?: boolean }
const navigationItems = ['services', 'process', 'contact'] as const
const navigationTestIds = {
  services: 'nav-servicos',
  process: 'nav-processo',
  contact: 'nav-contato',
}

export function Header({ navigation = true }: HeaderProps) {
  const { dict, locale } = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  useAnimatedDialog(dialogRef, menuOpen)

  useEffect(() => {
    let previousY = window.scrollY
    let frame = 0
    function onScroll() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const currentY = window.scrollY
        setScrolled(currentY > 24)
        setHidden(currentY > 100 && currentY > previousY)
        previousY = currentY
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)')
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false)
    }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  const languageLinks = <LanguageSwitch />

  return (
    <header
      className={cn(
        'site-header',
        !navigation && 'site-header-reference',
        scrolled && 'is-scrolled',
        hidden && !menuOpen && 'is-hidden',
      )}
    >
      <Container className="header-inner">
        <Link href="/" data-testid="header-logo-link" className="header-brand">
          <Logo />
        </Link>
        {navigation && (
          <nav className="desktop-navigation" aria-label={dict.studio.navigation}>
            {navigationItems.map((key) => (
              <GlitchText
                key={key}
                as="a"
                trigger="hover"
                className="flex items-center"
                text={dict.nav[key]}
                href={`#${key}`}
                data-testid={navigationTestIds[key]}
              />
            ))}
          </nav>
        )}
        <div className="header-actions">
          <div className={navigation ? 'desktop-language' : 'header-language'}>{languageLinks}</div>
          <a
            className="header-contact"
            href={locale === 'en' ? mailtoHref() : whatsappHref()}
            data-testid="header-cta"
            onClick={() => track('cta_click', { source: 'header' })}
          >
            {dict.nav.cta}
            <ArrowUpRight size={16} aria-hidden />
          </a>
          {navigation && (
            <button
              type="button"
              className="menu-toggle"
              data-testid="header-menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={dict.nav.menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} aria-hidden />
            </button>
          )}
        </div>
      </Container>
      {navigation && (
        <dialog
          id="mobile-nav"
          ref={dialogRef}
          className="mobile-navigation"
          aria-label={dict.studio.navigation}
          onClose={() => setMenuOpen(false)}
          onCancel={(event) => {
            event.preventDefault()
            setMenuOpen(false)
          }}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return
            const bounds = event.currentTarget.getBoundingClientRect()
            if (event.clientX < bounds.left || event.clientX > bounds.right) setMenuOpen(false)
          }}
        >
          <Container>
            <div className="mobile-menu-top">
              <Logo className="w-28" />
              <button
                type="button"
                className="icon-button"
                aria-label={dict.nav.menuClose}
                onClick={() => setMenuOpen(false)}
              >
                <X aria-hidden />
              </button>
            </div>
            <nav aria-label={dict.studio.navigation}>
              {navigationItems.map((key, index) => (
                <a data-menu-item key={key} href={`#${key}`} onClick={() => setMenuOpen(false)}>
                  <span>0{index + 1}</span>
                  {dict.nav[key]}
                  <ArrowUpRight aria-hidden />
                </a>
              ))}
            </nav>
            {languageLinks}
          </Container>
        </dialog>
      )}
    </header>
  )
}
