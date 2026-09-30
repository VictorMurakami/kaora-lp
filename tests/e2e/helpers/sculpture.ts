import { expect, type Locator } from '@playwright/test'

export async function canvasFingerprint(canvas: Locator) {
  return canvas.evaluate((element: HTMLCanvasElement) => {
    const pixels = element.toDataURL()
    let hash = 2166136261
    for (let index = 0; index < pixels.length; index += 7) {
      hash = Math.imul(hash ^ pixels.charCodeAt(index), 16777619)
    }
    return hash >>> 0
  })
}

export async function waitForSculpture(canvas: Locator) {
  await canvas.scrollIntoViewIfNeeded()
  await expect(canvas.locator('..')).toHaveAttribute('data-ready', 'true')
  let previous = -1
  let stableFrames = 0
  await expect
    .poll(
      async () => {
        const current = await canvasFingerprint(canvas)
        stableFrames = current === previous ? stableFrames + 1 : 0
        previous = current
        return stableFrames
      },
      { intervals: [200], timeout: 8000 },
    )
    .toBeGreaterThanOrEqual(3)
}
