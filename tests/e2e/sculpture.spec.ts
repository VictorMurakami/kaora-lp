import { test, expect } from '@playwright/test'
import { canvasFingerprint, waitForSculpture } from './helpers/sculpture'

test('only the sculpture responds to the pointer', async ({ page, isMobile }, testInfo) => {
  test.skip(isMobile, 'Pointer exploration is for mouse and pen devices')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const canvas = page.locator('.sculpture-canvas')
  await waitForSculpture(canvas)
  const before = await canvasFingerprint(canvas)
  const grid = page.locator('.sculpture-grid')
  const originalGrid = await grid.boundingBox()
  const bounds = await canvas.boundingBox()
  await page.mouse.move(bounds!.x + bounds!.width * 0.8, bounds!.y + bounds!.height * 0.35)
  await expect.poll(() => canvasFingerprint(canvas)).not.toBe(before)
  await expect(page.locator('.sculpture-stage')).toHaveCSS('transform', 'none')
  await expect(grid).toHaveCSS('transform', 'none')
  expect(await grid.boundingBox()).toEqual(originalGrid)
  await waitForSculpture(canvas)
  await page.screenshot({ path: testInfo.outputPath('hero-pointer.png') })
  await page.mouse.move(0, 0)
  await waitForSculpture(canvas)
  await expect.poll(() => canvasFingerprint(canvas)).toBe(before)
})

test('shape controls morph the canvas and survive rapid changes', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const canvas = page.locator('.sculpture-canvas')
  await waitForSculpture(canvas)
  const initial = await canvasFingerprint(canvas)
  for (const mode of ['Fluxo', 'Órbita']) {
    const control = page.getByRole('button', { name: mode, exact: true })
    await control.focus()
    await page.keyboard.press('Enter')
    await waitForSculpture(canvas)
    expect(await canvasFingerprint(canvas)).not.toBe(initial)
    await expect(control).toHaveAttribute('aria-pressed', 'true')
    await page.locator('.experiment').screenshot({ path: testInfo.outputPath(`hero-${mode}.png`) })
  }
  for (const mode of ['Forma', 'Fluxo', 'Órbita', 'Forma']) {
    await page.getByRole('button', { name: mode, exact: true }).click()
  }
  await page.mouse.move(0, 0)
  await waitForSculpture(canvas)
  await expect.poll(() => canvasFingerprint(canvas)).toBe(initial)
})

test('reduced motion switches to static artwork and back', async ({ page }) => {
  await page.goto('/')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const canvas = page.locator('.sculpture-canvas')
  await waitForSculpture(canvas)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.sculpture-fallback')).toBeVisible()
  await expect(canvas).toHaveCSS('opacity', '0')
  const path = page.locator('.sculpture-fallback path').first()
  const initial = await path.getAttribute('d')
  await page.getByRole('button', { name: 'Fluxo', exact: true }).click()
  await expect(path).not.toHaveAttribute('d', initial!)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await waitForSculpture(canvas)
  await expect(page.locator('.sculpture-fallback')).toBeHidden()
})

test('the artwork survives WebGL context loss', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const canvas = page.locator('.sculpture-canvas')
  await waitForSculpture(canvas)
  const extension = await canvas.evaluateHandle((element: HTMLCanvasElement) =>
    element.getContext('webgl2')?.getExtension('WEBGL_lose_context'),
  )
  test.skip(
    !(await extension.evaluate((value) => !!value)),
    'Context loss extension is not available',
  )
  await extension.evaluate((value) => value!.loseContext())
  await expect(page.locator('.sculpture-fallback')).toBeVisible()
  await extension.evaluate((value) => value!.restoreContext())
  await waitForSculpture(canvas)
  await expect(page.locator('.sculpture-fallback')).toBeHidden()
})

test('the illustration remains available without WebGL', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type, ...args) {
      if (String(type).startsWith('webgl')) return null
      return original.apply(this, [type, ...args] as Parameters<typeof original>)
    } as typeof original
  })
  await page.goto('/')
  await expect(page.locator('.sculpture-fallback')).toBeVisible()
  await page.getByRole('button', { name: 'Fluxo', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Fluxo', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.locator('.sculpture-fallback')).toBeVisible()
})

test('the static drawing does not flash before the canvas on first render', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const fallback = document.querySelector('.sculpture-fallback')
      ;(window as unknown as { firstVisibility: string }).firstVisibility = fallback
        ? getComputedStyle(fallback).visibility
        : 'missing'
    })
  })
  await page.goto('/')
  expect(
    await page.evaluate(() => (window as unknown as { firstVisibility: string }).firstVisibility),
  ).toBe('hidden')
  await waitForSculpture(page.locator('.sculpture-canvas'))
  await expect(page.locator('.sculpture-fallback')).toBeHidden()
})
