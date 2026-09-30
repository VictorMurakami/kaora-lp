import { test, expect } from '@playwright/test'

// Fix round 1: these five hover tests target `nav-servicos`, which lives in
// the header's `hidden md:flex` desktop nav (Header.tsx). On the `mobile`
// project's viewport that element is correctly invisible — hover itself
// isn't a mobile interaction at all; a tap there opens the `<dialog>` menu
// instead, never the nav link underneath. Scoping to `desktop` here is not
// "fixing a red test" by hiding it: it's recognising these five were never
// meant to run against a surface mobile visitors don't have. The touch
// path's own coverage is below, in "toque (scroll)".
test.describe('hover (desktop apenas)', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(
      testInfo.project.name !== 'desktop',
      'hover não existe no celular — o link de navegação some em telas menores que `md`, e o toque abre o <dialog> de menu, não este link',
    )
  })

  test('o nome acessível do link não muda durante o glitch', async ({ page }) => {
    await page.goto('/')
    const link = page.getByTestId('nav-servicos')
    const antes = (await link.getAttribute('aria-label')) ?? (await link.textContent())
    await link.hover()
    await page.waitForTimeout(200)
    const durante = (await link.getAttribute('aria-label')) ?? (await link.textContent())
    expect(durante).toBe(antes)
  })

  test('o hover no link dispara mudança visual', async ({ page }) => {
    await page.goto('/')
    const link = page.getByTestId('nav-servicos')
    const antes = await link.screenshot()
    await link.hover()
    await page.waitForTimeout(150)
    expect(Buffer.compare(antes, await link.screenshot())).not.toBe(0)
  })

  test('o link não muda de largura durante o glitch', async ({ page }) => {
    await page.goto('/')
    const link = page.getByTestId('nav-servicos')
    const a = (await link.boundingBox())!.width
    await link.hover()
    await page.waitForTimeout(150)
    expect(Math.abs((await link.boundingBox())!.width - a)).toBeLessThan(1)
  })

  test('com movimento reduzido nada embaralha', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const link = page.getByTestId('nav-servicos')
    const antes = await link.textContent()
    await link.hover()
    await page.waitForTimeout(300)
    expect(await link.textContent()).toBe(antes)
  })

  test('o loop para quando as ondas expiram', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('nav-servicos').hover()
    await page.waitForTimeout(1200)
    await page.mouse.move(0, 0)
    await page.waitForTimeout(1200)
    const rodando = await page.evaluate(
      () => (window as unknown as { __rippleLoopActive?: boolean }).__rippleLoopActive ?? false,
    )
    expect(rodando).toBe(false)
  })
})

// Task 25: the touch-scroll surface that used to live here tested the
// retired page-wide `GlyphField`'s own scroll-driven wave reactivity
// (`onScroll` synthesizing a pointer position for devices with no hover).
// The hero's glyph orbit that replaced it (src/components/effects/orbit/)
// has no scroll input at all — task-25-brief.md's hover model is pointer-
// only, gated on the pointer actually being near the ring — so there is no
// touch analogue to test here anymore. `GlitchText`'s own hover surface
// above is unaffected; this file's coverage now ends there.
