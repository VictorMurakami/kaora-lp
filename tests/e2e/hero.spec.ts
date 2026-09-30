import { test, expect } from '@playwright/test'
import { getDictionary } from '../../src/content'
import { openInLocale } from './helpers/locale'

for (const locale of ['pt-BR', 'en', 'es'] as const) {
  test(`hero content and conversion work in ${locale}`, async ({ page }) => {
    await openInLocale(page, locale)
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(
      getDictionary(locale).hero.headline,
    )
    await expect(page.getByTestId('hero-cta-primary')).toHaveAttribute('href', '#contact')
    await expect(page.getByTestId('hero-cta-secondary')).toHaveAttribute(
      'href',
      locale === 'en' ? /^mailto:/ : /wa\.me/,
    )
    for (const id of ['hero-cta-primary', 'hero-cta-secondary']) {
      const box = await page.getByTestId(id).boundingBox()
      expect(box!.height).toBeGreaterThanOrEqual(44)
    }
  })
}

test('primary action is above the fold on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 })
  await page.goto('/')
  const action = await page.getByTestId('hero-cta-primary').boundingBox()
  expect(action!.y + action!.height).toBeLessThan(800)
})

test('visual exploration is keyboard accessible', async ({ page }) => {
  await page.goto('/')
  const control = page.getByRole('button', { name: 'Fluxo', exact: true })
  const initialPath = await page.locator('.sculpture path').first().getAttribute('d')
  await control.focus()
  await page.keyboard.press('Enter')
  await expect(control).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.sculpture path').first()).not.toHaveAttribute('d', initialPath!)
})

test('reduced motion disables visual transformations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.sculpture-stage')).toHaveCSS('transform', 'none')
  await expect(page.locator('.sculpture-lines')).toHaveCSS('animation-name', 'none')
})

test('contact shortcut follows the reading journey', async ({ page }) => {
  await page.goto('/')
  const shortcut = page.getByTestId('floating-whatsapp')
  await expect(shortcut).toBeHidden()
  await page.locator('#playground').scrollIntoViewIfNeeded()
  await expect(shortcut).toBeVisible()
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await expect(shortcut).toBeHidden()
})
