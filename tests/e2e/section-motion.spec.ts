import { test, expect, type Page } from '@playwright/test'

// The landing's entrance motion is ScrollExperience: any `[data-reveal]`
// element that starts below the fold eases from 30% to full opacity when it
// scrolls in. The design system page mounts the same component, and its
// reveal demo (src/app/design-system/_components/RevealDemo.tsx) gives these
// tests stable selectors without depending on landing copy.
//
// ScrollExperience skips devices with four cores or fewer, so the animated
// cases pin `hardwareConcurrency` instead of inheriting the host machine's.

const ITEM = '[data-testid="reveal-demo-item-0"]'

async function pinCores(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 })
  })
}

// Samples computed opacity over a run of animation frames inside one
// `page.evaluate`, optionally scrolling the target into view on the first
// frame, so there is no round-trip gap for a transient flash to hide in.
async function sampleOpacity(
  page: Page,
  { frames = 40, scroll = false }: { frames?: number; scroll?: boolean } = {},
): Promise<number[]> {
  return page.evaluate(
    async ({ selector, frames, scroll }) => {
      const target = document.querySelector(selector) as HTMLElement
      if (scroll) target.scrollIntoView({ block: 'center', behavior: 'instant' })
      const samples: number[] = []
      for (let i = 0; i < frames; i++) {
        samples.push(Number(getComputedStyle(target).opacity))
        await new Promise((resolve) => requestAnimationFrame(resolve))
      }
      return samples
    },
    { selector: ITEM, frames, scroll },
  )
}

test.describe('Entrada na rolagem ([data-reveal])', () => {
  test('sem JavaScript, o conteúdo abaixo da dobra já aparece', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    await page.goto('/design-system')
    await expect(page.locator(ITEM)).toHaveCSS('opacity', '1')
    await context.close()
  })

  test('sem movimento reduzido, o item anima ao entrar e nunca some', async ({ page }) => {
    await pinCores(page)
    await page.goto('/design-system')
    await expect(page.locator('.reading-progress')).toBeAttached()
    await expect(page.locator(ITEM)).toHaveCSS('opacity', '1')

    const samples = await sampleOpacity(page, { scroll: true })
    expect(Math.min(...samples), JSON.stringify(samples)).toBeLessThan(1)
    expect(Math.min(...samples), JSON.stringify(samples)).toBeGreaterThanOrEqual(0.3)
    await expect(page.locator(ITEM)).toHaveCSS('opacity', '1')
  })

  test('com prefers-reduced-motion: reduce, nada se move', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await pinCores(page)
    await page.goto('/design-system')

    expect((await sampleOpacity(page)).every((o) => o === 1)).toBe(true)
    expect((await sampleOpacity(page, { scroll: true })).every((o) => o === 1)).toBe(true)
    await expect(page.locator('.reading-progress')).toHaveCount(0)
    await context.close()
  })

  test('o que já está na tela ao carregar não é animado de novo', async ({ browser }) => {
    // A viewport taller than the page puts every item on screen at mount.
    const context = await browser.newContext({ viewport: { width: 1280, height: 40000 } })
    const page = await context.newPage()
    await pinCores(page)
    await page.goto('/design-system')
    await expect(page.locator('.reading-progress')).toBeAttached()

    const samples = await sampleOpacity(page, { frames: 60 })
    expect(
      samples.every((o) => o === 1),
      JSON.stringify(samples),
    ).toBe(true)
    await context.close()
  })
})
