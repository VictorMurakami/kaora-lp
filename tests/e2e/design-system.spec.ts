import { test, expect, type Page } from '@playwright/test'
import { auditA11y } from './helpers/a11y'

// Two separate audits, deliberately not one parametrised test: they cover
// two different real states a visitor can land on.
//
//   - "resting state" scrolls the reveal demo into view so ScrollExperience
//     (the same entrance the landing uses) runs, waits for it to land, and
//     then lets auditA11y settle anything else still moving. WCAG 1.4.3 is
//     about text once it's done moving, and a contrast defect in an
//     animation's end state is still caught.
//   - "prefers-reduced-motion: reduce" audits the page for a visitor with
//     that preference. ScrollExperience does not mount for them, so there is
//     no mid-animation state to settle out of.
async function scrollRevealDemoIntoPlace(page: Page) {
  await page.getByTestId('reveal-demo').scrollIntoViewIfNeeded()
  await expect(page.getByTestId('reveal-demo-item-2')).toHaveCSS('opacity', '1')
}

test('a página do design system não tem violação de acessibilidade (estado de repouso)', async ({
  page,
}) => {
  await page.goto('/design-system')
  await scrollRevealDemoIntoPlace(page)
  const violations = await auditA11y(page)
  expect(violations).toEqual([])
})

test('a página do design system não tem violação de acessibilidade (prefers-reduced-motion: reduce)', async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('/design-system')
  await scrollRevealDemoIntoPlace(page)
  await expect(page.locator('.reading-progress')).toHaveCount(0)
  const violations = await auditA11y(page)
  expect(violations).toEqual([])
  await context.close()
})

test('o design system não é indexado', async ({ page }) => {
  await page.goto('/design-system')
  const robots = page.locator('meta[name="robots"]')
  await expect(robots).toHaveAttribute('content', /noindex/)
})

test('a página não mostra os primitivos que a landing não usa', async ({ page }) => {
  await page.goto('/design-system')
  await expect(page.locator('.font-display')).toHaveCount(0)
  await expect(page.locator('[data-radix-collection-item]')).toHaveCount(0)
  await expect(page.getByRole('combobox')).toHaveCount(0)
  await expect(page.getByRole('textbox')).toHaveCount(0)
})

test('a linha de serviço de exemplo abre e fecha como na landing', async ({ page }) => {
  await page.goto('/design-system')
  const details = page.getByTestId('service-sample').locator('details')
  const summary = details.locator('summary')
  await summary.scrollIntoViewIfNeeded()
  await summary.click()
  await expect(details).toHaveAttribute('open', '')
  await expect(details).toHaveAttribute('data-expanded', 'true')
  await summary.click()
  await expect(details).toHaveAttribute('data-expanded', 'false')
  await expect(details).not.toHaveAttribute('open', '')
})

// These samples repeat values from landing rules that have no class of their
// own (see src/styles/design-system.css). Comparing computed styles at the
// same viewport keeps the page from drifting away from the landing.
const mirrors = [
  { sample: 'type-contact', landing: '.contact-grid h2' },
  { sample: 'type-process', landing: '.process-list h3' },
  { sample: 'type-service', landing: '.service-item h3' },
  { sample: 'type-principle', landing: '.principles-grid h3' },
] as const
const typeProperties = ['font-size', 'font-weight', 'letter-spacing', 'line-height'] as const

async function readStyles(page: Page, selector: string, properties: readonly string[]) {
  return page
    .locator(selector)
    .first()
    .evaluate((element, names) => {
      const style = getComputedStyle(element)
      return Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name)]))
    }, properties)
}

test('as amostras espelhadas batem com a landing', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const ds = await context.newPage()
  const landing = await context.newPage()
  await ds.goto('/design-system')
  await landing.goto('/')

  for (const mirror of mirrors) {
    const expected = await readStyles(landing, mirror.landing, typeProperties)
    const actual = await readStyles(ds, `[data-testid="${mirror.sample}"]`, typeProperties)
    expect(actual, `${mirror.sample} vs ${mirror.landing}`).toEqual(expected)
  }

  const floatingProperties = ['width', 'height', 'border-radius', 'background-color', 'color']
  const expectedFloating = await readStyles(
    landing,
    '[data-testid="floating-whatsapp"]',
    floatingProperties,
  )
  const actualFloating = await readStyles(ds, '.ds-floating', floatingProperties)
  expect(actualFloating).toEqual(expectedFloating)

  await context.close()
})

test('o design system usa o header e o footer da landing, sem navegação nem CTAs', async ({
  page,
}) => {
  // 390px is where the pill used to wrap beside the language switch.
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/design-system')
  const header = page.locator('.site-header')
  const footer = page.locator('.site-footer')
  await expect(header.getByTestId('header-logo-link')).toHaveAttribute('href', '/')
  await expect(header.getByRole('group', { name: 'Idioma' })).toBeVisible()
  // The contact pill either fits on one line beside the switch or steps aside.
  const cta = header.getByTestId('header-cta')
  if (await cta.isVisible()) {
    const oneLine = await cta.evaluate((element) => {
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 20
      const text = element.firstChild
      const range = document.createRange()
      range.selectNodeContents(text!)
      return range.getBoundingClientRect().height < lineHeight * 1.5
    })
    expect(oneLine).toBe(true)
  }
  await expect(header.locator('.desktop-navigation, .menu-toggle, dialog')).toHaveCount(0)
  await expect(footer.getByTestId('footer-whatsapp')).toHaveCount(0)
  await expect(footer.getByTestId('footer-email')).toHaveCount(0)
  await expect(footer.getByRole('link', { name: 'Ir para o site' })).toHaveAttribute('href', '/')
  await expect(footer.locator('.back-top')).toHaveAttribute('href', '#main-content')
  await expect(page.locator('.ds-topbar, .ds-footer')).toHaveCount(0)
})
