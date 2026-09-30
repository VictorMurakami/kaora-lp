import { test, expect } from '@playwright/test'
import { waitForSculpture } from './helpers/sculpture'

test('o laboratório mostra só a escultura, grande, com destinos na landing', async ({ page }) => {
  await page.goto('/design-system/field')
  await expect(page).toHaveTitle('Laboratório 3D · Kaora')
  await expect(page.getByRole('heading', { level: 1, name: 'Laboratório 3D' })).toBeAttached()
  await expect(page.locator('main p.section-description, main .lab-states')).toHaveCount(0)
  const stage = page.locator('.experiment-lab .sculpture-stage')
  const heroWidth = 540
  expect((await stage.boundingBox())!.width).toBeGreaterThan(
    Math.min(heroWidth, page.viewportSize()!.width - 60),
  )
  for (const [mode, destination] of [
    ['Órbita', '/#process'],
    ['Fluxo', '/#playground'],
    ['Forma', '/#services'],
  ] as const) {
    await page.getByRole('button', { name: mode, exact: true }).click()
    await expect(page.locator('.experiment-destination')).toHaveAttribute('href', destination)
  }
})

test('o experimento ASCII não existe mais', async ({ request }) => {
  expect((await request.get('/design-system/ascii')).status()).toBe(404)
})

test('a escultura do laboratório renderiza em WebGL', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/design-system/field')
  await waitForSculpture(page.locator('.experiment-lab .sculpture-canvas'))
})

test('o site declara favicon, ícone da Apple e títulos com a marca', async ({ page, request }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Kaora')
  for (const selector of [
    'link[rel="icon"][type="image/svg+xml"]',
    'link[rel="apple-touch-icon"]',
  ]) {
    const href = await page.locator(selector).first().getAttribute('href')
    expect(href).toBeTruthy()
    expect((await request.get(href!)).ok()).toBe(true)
  }
  expect((await request.get('/favicon.ico')).ok()).toBe(true)
  await page.goto('/design-system')
  await expect(page).toHaveTitle('Design system · Kaora')
})

for (const [width, height] of [
  [1280, 720],
  [1920, 1080],
  [768, 1024],
  [390, 844],
] as const) {
  test(`o laboratório cabe na primeira tela e enquadra a escultura em ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/design-system/field')
    const controls = await page.locator('.experiment-lab .experiment-controls').boundingBox()
    expect(controls!.y + controls!.height).toBeLessThanOrEqual(height)
    const stage = await page.locator('.experiment-lab .sculpture-stage').boundingBox()
    const grid = await page.locator('.experiment-lab .sculpture-grid').boundingBox()
    // The artwork scales with the stage height, or with the width on narrow
    // stages, so the grid follows the same bound and never stretches past it.
    const followsHeight = Math.abs(grid!.height / stage!.height - 0.82) < 0.02
    const followsWidth = Math.abs(grid!.width - stage!.width) < 1
    expect(followsHeight || followsWidth).toBe(true)
    expect(grid!.width).toBeLessThanOrEqual(stage!.width + 1)
    expect(grid!.width / grid!.height).toBeLessThanOrEqual(540 / 440 + 0.01)
  })
}
