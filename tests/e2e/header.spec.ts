import { test, expect } from '@playwright/test'
import { openInLocale } from './helpers/locale'

const locales = ['pt-BR', 'en', 'es'] as const

// Minimum 44px touch target on anything clickable. Not
// breakpoint-conditional, not CTA-only.
const MIN_TOUCH_TARGET = 44

for (const locale of locales) {
  test(`o header não estoura a viewport em 360px no locale ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 })
    await openInLocale(page, locale)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)
  })

  test(`o CTA do header cabe em uma linha no locale ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await openInLocale(page, locale)
    const cta = page.getByTestId('header-cta')
    const box = await cta.boundingBox()
    expect(box!.height).toBeLessThan(56)
  })

  // Review round 1, Finding 1/2: `header.spec.ts` only asserted an upper
  // bound on the CTA's height (<56px), written to catch text overflow. It
  // said nothing about a lower bound, so a 36px CTA — under the project's
  // 44px touch-target minimum, on the header's one control that's
  // deliberately never hidden on mobile — passed silently. These two
  // assert the floor, at both viewports, in all three locales.
  test(`o CTA do header tem pelo menos 44px de alvo de toque em 360px no locale ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 780 })
    await openInLocale(page, locale)
    const box = await page.getByTestId('header-cta').boundingBox()
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET)
  })

  test(`o CTA do header tem pelo menos 44px de alvo de toque em 1280px no locale ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await openInLocale(page, locale)
    const box = await page.getByTestId('header-cta').boundingBox()
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET)
  })

  // Same bound, every other interactive element the header renders, so
  // this class of defect can't hide behind a different control next time.
  // Mobile-only controls (logo link, hamburger) are checked at 360px;
  // desktop-only controls (logo link, the three nav links) at 1280px —
  // each only asserted where it's actually visible/rendered.
  test(`todo elemento clicável do header tem pelo menos 44px em 360px no locale ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 780 })
    await openInLocale(page, locale)
    for (const testId of ['header-logo-link', 'header-menu-toggle', 'header-cta']) {
      const box = await page.getByTestId(testId).boundingBox()
      expect(box!.height, testId).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET)
    }
  })

  test(`todo elemento clicável do header tem pelo menos 44px em 1280px no locale ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await openInLocale(page, locale)
    for (const testId of ['header-logo-link', 'header-cta']) {
      const box = await page.getByTestId(testId).boundingBox()
      expect(box!.height, testId).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET)
    }
    // Task 23: cada link virou uma superfície `GlitchText`, com um test-id
    // próprio (`nav-servicos`/`nav-processo`/`nav-contato` — ver Header.tsx)
    // em vez do `header-nav-link` genérico que os três compartilhavam antes,
    // porque tests/e2e/ripple.spec.ts precisa endereçar um link específico
    // por nome. O regex mantém esta asserção cobrindo todos eles, não só um.
    const navLinks = await page.getByTestId(/^nav-/).all()
    expect(navLinks.length).toBeGreaterThan(0)
    for (const link of navLinks) {
      const box = await link.boundingBox()
      expect(box!.height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET)
    }
  })
}
