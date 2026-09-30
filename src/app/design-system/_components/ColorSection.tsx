import { tokens } from '@/design-system/tokens'
import { ColorSwatch } from './ColorSwatch'
import { DocSection, Subtitle } from './DocSection'
import { measureContrast, type ContrastUse } from './contrast'

const c = tokens.color.semantic

const brandUsage: Partial<Record<keyof typeof tokens.color.brand, string>> = {
  200: 'Ícone e avatar do workspace, escultura',
  300: 'Hover da ação principal',
  400: 'É o accent: CTA, números, contato, foco',
  500: 'É o field: só o botão flutuante',
  600: 'Linha do processo, barra de progresso',
  700: 'Números sobre paper, escultura',
  800: 'Traço do ícone do workspace',
}

const neutralUsage: Partial<Record<keyof typeof tokens.color.neutral, string>> = {
  50: 'É o --color-text',
  300: 'É o --color-text-muted',
  700: 'É o --color-border',
  800: 'Hover da ação escura',
  900: 'É o --color-surface',
  950: 'É o --color-bg e o --color-ink',
}

const paperTokens = [
  {
    name: 'paper',
    cssVar: '--color-paper',
    hex: c.paper,
    usage: 'Fundo do processo e do workspace',
  },
  {
    name: 'paper-muted',
    cssVar: '--color-paper-muted',
    hex: c.paperMuted,
    usage: 'Texto de apoio sobre paper',
  },
  {
    name: 'paper-border',
    cssVar: '--color-paper-border',
    hex: c.paperBorder,
    usage: 'Linhas sobre paper',
  },
]

type Pair = {
  foreground: { name: string; hex: string; cssVar: string }
  background: { name: string; hex: string; cssVar: string }
  where: string
  use: ContrastUse
  sample?: 'ring'
}

const token = (name: string, hex: string) => ({ name, hex, cssVar: `--color-${name}` })
const ink = token('ink', c.ink)
const accent = token('accent', c.accent)
const bg = token('bg', c.bg)
const paper = token('paper', c.paper)

const pairs: Pair[] = [
  {
    foreground: token('text', c.text),
    background: bg,
    where: 'Títulos e texto no graphite',
    use: 'text',
  },
  {
    foreground: token('text-muted', c.textMuted),
    background: bg,
    where: 'Descrições, tags, segunda linha dos títulos',
    use: 'text',
  },
  {
    foreground: accent,
    background: bg,
    where: 'Números das seções, destaque do hero, idioma ativo',
    use: 'text',
  },
  {
    foreground: token('text-muted', c.textMuted),
    background: token('surface', c.surface),
    where: 'Texto da seção do workspace',
    use: 'text',
  },
  { foreground: ink, background: paper, where: 'Processo e workspace', use: 'text' },
  {
    foreground: token('paper-muted', c.paperMuted),
    background: paper,
    where: 'Texto de apoio no processo e no workspace',
    use: 'text',
  },
  {
    foreground: token('brand-700', tokens.color.brand[700]),
    background: paper,
    where: 'Número da seção de processo',
    use: 'text',
  },
  { foreground: ink, background: accent, where: 'Tudo na seção de contato', use: 'text' },
  {
    foreground: ink,
    background: token('field', c.field),
    where: 'Ícone do botão flutuante',
    use: 'ui',
  },
  {
    foreground: token('brand-400', tokens.color.brand[400]),
    background: bg,
    where: 'Contorno de foco no graphite',
    use: 'ui',
    sample: 'ring',
  },
  {
    foreground: ink,
    background: accent,
    where: 'Contorno de foco no contato',
    use: 'ui',
    sample: 'ring',
  },
  {
    foreground: token('brand-400', tokens.color.brand[400]),
    background: paper,
    where: 'Contorno de foco nos botões do workspace',
    use: 'ui',
    sample: 'ring',
  },
]

export function ColorSection() {
  return (
    <DocSection
      id="cor"
      number="02"
      label="Cor"
      title="Poucas cores."
      accent="Todas com função."
      description="Rampas de brand e neutral com o que cada passo faz na landing. O contraste é calculado aqui mesmo, com a mesma função dos testes."
    >
      <Subtitle>Brand</Subtitle>
      <div className="ds-ramp">
        {Object.entries(tokens.color.brand).map(([step, hex]) => (
          <ColorSwatch
            key={step}
            name={`brand-${step}`}
            hex={hex}
            cssVar={`--color-brand-${step}`}
            usage={brandUsage[Number(step) as keyof typeof brandUsage]}
          />
        ))}
      </div>

      <Subtitle>Neutral</Subtitle>
      <div className="ds-ramp">
        {Object.entries(tokens.color.neutral).map(([step, hex]) => (
          <ColorSwatch
            key={step}
            name={`neutral-${step}`}
            hex={hex}
            cssVar={`--color-neutral-${step}`}
            usage={neutralUsage[Number(step) as keyof typeof neutralUsage]}
          />
        ))}
      </div>

      <Subtitle>Paper</Subtitle>
      <div className="ds-ramp ds-ramp-short">
        {paperTokens.map((item) => (
          <ColorSwatch key={item.name} {...item} />
        ))}
      </div>

      <Subtitle>Pares em uso</Subtitle>
      <div className="ds-pairs" data-testid="contrast-pairs">
        {pairs.map((pair) => {
          const contrast = measureContrast(pair.foreground.hex, pair.background.hex, pair.use)
          return (
            <div
              key={`${pair.foreground.name}-${pair.background.name}-${pair.where}`}
              className="ds-pair"
              data-pass={contrast.pass}
            >
              <span
                className="ds-pair-chip"
                aria-hidden
                style={{
                  background: `var(${pair.background.cssVar})`,
                  color: `var(${pair.foreground.cssVar})`,
                  boxShadow:
                    pair.sample === 'ring'
                      ? `inset 0 0 0 0.6rem var(${pair.background.cssVar}), inset 0 0 0 calc(0.6rem + 2px) var(${pair.foreground.cssVar})`
                      : undefined,
                }}
              >
                {pair.sample === 'ring' ? '' : 'Aa'}
              </span>
              <span>
                {pair.foreground.name} / {pair.background.name}
              </span>
              <span className="ds-pair-where">{pair.where}</span>
              <span className="ds-pair-ratio">
                {contrast.label}
                <span>{contrast.verdict}</span>
              </span>
            </div>
          )
        })}
      </div>
    </DocSection>
  )
}
