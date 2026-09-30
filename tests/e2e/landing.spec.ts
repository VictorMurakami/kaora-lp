import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { canvasFingerprint, waitForSculpture } from './helpers/sculpture'
import { openInLocale } from './helpers/locale'

for (const locale of ['pt-BR', 'en', 'es'] as const) {
  test(`landing remains within the viewport in ${locale}`, async ({ page }) => {
    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await openInLocale(page, locale)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      )
      for (const id of ['services', 'process', 'contact'])
        await expect(page.locator(`#${id}`)).toHaveCount(1)
    }
  })
}

test('demonstration supports completion, filters and reset', async ({ page }) => {
  await page.goto('/')
  const demo = page.locator('#playground')
  const progress = demo.getByRole('progressbar')
  await expect(progress).toHaveAttribute('aria-valuenow', '50')
  await demo
    .getByRole('button', { name: 'Alternar conclusão de Construir o design system' })
    .click()
  await expect(progress).toHaveAttribute('aria-valuenow', '75')
  await demo.getByRole('button', { name: 'Em andamento', exact: true }).click()
  await expect(demo.locator('.task-row')).toHaveCount(1)
  await demo.getByRole('button', { name: 'Alternar conclusão de Desenvolver a plataforma' }).click()
  await expect(progress).toHaveAttribute('aria-valuenow', '100')
  await expect(demo.locator('.task-row')).toHaveCount(0)
  await demo.getByRole('button', { name: 'Reiniciar demonstração' }).click()
  await expect(progress).toHaveAttribute('aria-valuenow', '50')
  await expect(demo.locator('.task-row')).toHaveCount(4)
})

test('services and FAQ disclose useful content', async ({ page }) => {
  await page.goto('/')
  await page.locator('#services summary').first().click()
  await expect(page.locator('#services .service-detail').first()).toBeVisible()
  await page.locator('#faq summary').first().click()
  await expect(page.locator('#faq details').first()).toHaveAttribute('open', '')
})

test('mobile navigation closes after following a section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menu' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('link', { name: 'Serviços' }).click()
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/#services$/)
})

test('landing has no automated accessibility violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const result = await new AxeBuilder({ page }).analyze()
  expect(result.violations).toEqual([])
})

test('essential content works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.locator('#services summary').first().click()
  await expect(page.locator('#services .service-detail').first()).toBeVisible()
  await expect(page.locator('#contact a').first()).toHaveAttribute('href', /wa\.me/)
  await context.close()
})

test('scroll connects the artwork and product demonstration', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const artwork = page.locator('.sculpture-canvas')
  await waitForSculpture(artwork)
  const initialFrame = await canvasFingerprint(artwork)
  await page.locator('.experiment').evaluate((element) => {
    const bounds = element.getBoundingClientRect()
    window.scrollTo(0, window.scrollY + bounds.top + bounds.height / 2)
  })
  await expect.poll(() => canvasFingerprint(artwork)).not.toBe(initialFrame)
  await page.locator('#playground').scrollIntoViewIfNeeded()
  await expect(page.getByRole('progressbar')).toBeVisible()
  expect(errors).toEqual([])
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: testInfo.outputPath('landing.png'), fullPage: true })
})
