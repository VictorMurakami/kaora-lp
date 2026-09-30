import { contrastRatio, tokens } from '@/design-system/tokens'

export type ColorSwatchProps = {
  name: string
  hex: string
  cssVar: string
  /** Where the landing uses this colour; omitted when it does not. */
  usage?: string
}

// Picks whichever ink reads better on the chip instead of a fixed lightness cutoff.
function chipInk(hex: string) {
  const light = contrastRatio(tokens.color.semantic.text, hex)
  const dark = contrastRatio(tokens.color.semantic.ink, hex)
  return light >= dark ? 'var(--color-text)' : 'var(--color-ink)'
}

export function ColorSwatch({ name, hex, cssVar, usage }: ColorSwatchProps) {
  const ratio = contrastRatio(hex, tokens.color.semantic.bg)
  return (
    <div className="ds-swatch" data-unused={!usage}>
      <div className="ds-swatch-chip" style={{ background: `var(${cssVar})`, color: chipInk(hex) }}>
        {hex}
      </div>
      <div className="ds-swatch-info">
        <strong>{name}</strong>
        <span>{ratio.toFixed(2).replace('.', ',')}:1 sobre bg</span>
        <span className="ds-swatch-usage">{usage ?? 'Sem uso na landing'}</span>
      </div>
    </div>
  )
}
