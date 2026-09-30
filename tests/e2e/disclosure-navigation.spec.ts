import { test, expect } from '@playwright/test'

for (const section of ['services', 'faq']) {
  test(`${section} animates both directions and supports interrupted keyboard toggles`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    const details = page.locator(`#${section} details`).first()
    const summary = details.locator('summary')
    const content = details.locator('.disclosure-content')
    await summary.scrollIntoViewIfNeeded()
    await summary.focus()
    await page.keyboard.press('Enter')
    await expect(details).toHaveAttribute('open', '')
    await expect
      .poll(() => content.evaluate((element) => element.getAnimations().length))
      .toBeGreaterThan(0)
    await expect.poll(() => content.evaluate((element) => element.getAnimations().length)).toBe(0)
    const expandedHeight = (await content.boundingBox())!.height
    expect(expandedHeight).toBeGreaterThan(30)
    await page.keyboard.press('Enter')
    await expect
      .poll(() => content.evaluate((element) => element.getAnimations().length))
      .toBeGreaterThan(0)
    await page.keyboard.press('Enter')
    await expect(details).toHaveAttribute('data-expanded', 'true')
    await expect.poll(() => content.evaluate((element) => element.getAnimations().length)).toBe(0)
    expect((await content.boundingBox())!.height).toBeCloseTo(expandedHeight, 0)
    await page.keyboard.press('Enter')
    await expect(details).not.toHaveAttribute('open', '')
  })
}

test('sidebar animates entrance and exit, traps focus and restores the trigger', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 620, height: 880 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Abrir menu' })
  const dialog = page.getByRole('dialog')
  await trigger.click()
  await expect(dialog).toBeVisible()
  const positions = await dialog.evaluate(async (element) => {
    const positions: number[] = []
    for (let frame = 0; frame < 32; frame++) {
      await new Promise(requestAnimationFrame)
      positions.push(element.getBoundingClientRect().left)
    }
    return positions
  })
  expect(positions[0]).toBeGreaterThan(positions.at(-1)!)
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
  for (let index = 0; index < 10; index++) {
    await page.keyboard.press('Tab')
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
  }
  await page.screenshot({ path: testInfo.outputPath('sidebar.png') })
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveAttribute('data-closing', 'true')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  await trigger.click()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await trigger.click()
  await expect(dialog).toBeVisible()
  await page.setViewportSize({ width: 1000, height: 880 })
  await expect(dialog).toBeHidden()
})

test('reduced motion preserves disclosure and sidebar controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const details = page.locator('#services details').first()
  await details.locator('summary').click()
  await expect(details).toHaveAttribute('open', '')
  expect(
    await details
      .locator('.disclosure-content')
      .evaluate((element) => element.getAnimations().length),
  ).toBe(0)
  await details.locator('summary').click()
  await expect(details).not.toHaveAttribute('open', '')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.getByRole('button', { name: 'Abrir menu' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('hero exploration leads to the corresponding content', async ({ page }) => {
  await page.goto('/')
  for (const [mode, target] of [
    ['Forma', 'services'],
    ['Fluxo', 'playground'],
    ['Órbita', 'process'],
  ]) {
    await page.getByRole('button', { name: mode, exact: true }).click()
    const link = page.locator('.experiment-destination')
    await expect(link).toHaveAttribute('href', `#${target}`)
    await link.click()
    await expect(page).toHaveURL(new RegExp(`#${target}$`))
    await expect(page.locator(`#${target} h2`)).toBeInViewport()
  }
})
