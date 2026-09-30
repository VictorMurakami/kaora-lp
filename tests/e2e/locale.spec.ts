import { test, expect } from '@playwright/test'
import { getDictionary } from '@/content'
import { openInLocale } from './helpers/locale'

test('o seletor troca o idioma no lugar, sem navegar, e lembra a escolha', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveAccessibleName(getDictionary('pt-BR').hero.headline)
  // A value on window survives only if the document is never replaced.
  await page.evaluate(() => Object.assign(window, { sameDocument: true }))
  await expect(async () => {
    const visible = page.getByRole('button', { name: 'EN', exact: true }).filter({ visible: true })
    if ((await visible.count()) === 0) await page.getByTestId('header-menu-toggle').click()
    await visible.first().click()
    await expect(page.locator('h1')).toHaveAccessibleName(getDictionary('en').hero.headline, {
      timeout: 1000,
    })
  }).toPass()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  expect(new URL(page.url()).pathname).toBe('/')
  expect(await page.evaluate(() => 'sameDocument' in window)).toBe(true)

  await page.reload()
  await expect(page.locator('h1')).toHaveAccessibleName(getDictionary('en').hero.headline)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('a primeira visita segue o idioma do navegador', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'es-AR' })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.locator('h1')).toHaveAccessibleName(getDictionary('es').hero.headline)
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await context.close()
})

test('a escolha vale também no design system', async ({ page }) => {
  await openInLocale(page, 'es', '/design-system')
  const siteLink = page.locator('.site-footer .footer-links a')
  await expect(siteLink).toHaveText(getDictionary('es').footer.site)
  await expect(async () => {
    await page.locator('.site-header').getByRole('button', { name: 'PT', exact: true }).click()
    await expect(siteLink).toHaveText(getDictionary('pt-BR').footer.site, { timeout: 1000 })
  }).toPass()
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
  expect(new URL(page.url()).pathname).toBe('/design-system')
})
