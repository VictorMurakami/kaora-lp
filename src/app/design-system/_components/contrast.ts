import { contrastRatio } from '@/design-system/tokens'

/** `text` is body copy (4.5:1); `ui` covers icons, focus rings and large text (3:1). */
export type ContrastUse = 'text' | 'ui'

const minimum: Record<ContrastUse, number> = { text: 4.5, ui: 3 }

export function measureContrast(foreground: string, background: string, use: ContrastUse) {
  const ratio = contrastRatio(foreground, background)
  const pass = ratio >= minimum[use]
  return {
    ratio,
    pass,
    label: `${ratio.toFixed(2).replace('.', ',')}:1`,
    verdict: pass ? (use === 'text' ? 'AA texto' : 'AA 3:1') : 'abaixo de AA',
  }
}
