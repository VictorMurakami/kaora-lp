import { Container } from '@/components/layout/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { tokens } from '@/design-system/tokens'
import { cn } from '@/lib/utils'
import { DocSection } from './DocSection'
import { measureContrast } from './contrast'

const c = tokens.color.semantic

const pageMap = [
  { name: 'Hero', surface: 'bg' },
  { name: 'Serviços', surface: 'bg' },
  { name: 'Workspace', surface: 'surface' },
  { name: 'Processo', surface: 'paper' },
  { name: 'Princípios', surface: 'bg' },
  { name: 'FAQ', surface: 'bg' },
  { name: 'Contato', surface: 'accent' },
  { name: 'Rodapé', surface: 'bg' },
] as const

const mapBackground = {
  bg: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  paper: 'var(--color-paper)',
  accent: 'var(--color-accent)',
}

type Surface = {
  name: string
  token: string
  hex: string
  /** Landing section class that paints this surface; reused so the band is the real thing. */
  sectionClass: string
  label: { number: string; text: string }
  where: string
  pairs: { name: string; foreground: string }[]
}

const surfaces: Surface[] = [
  {
    name: 'Graphite',
    token: '--color-bg',
    hex: c.bg,
    sectionClass: '',
    label: { number: '01', text: 'O que criamos' },
    where: 'Topo, hero, serviços, princípios, FAQ e rodapé',
    pairs: [
      { name: 'Texto · --color-text', foreground: c.text },
      { name: 'Texto suave · --color-text-muted', foreground: c.textMuted },
      { name: 'Números e destaque · --color-accent', foreground: c.accent },
    ],
  },
  {
    name: 'Surface',
    token: '--color-surface',
    hex: c.surface,
    sectionClass: 'playground-section',
    label: { number: '02', text: 'Design que você pode experimentar' },
    where: 'Seção do workspace, com linha em cima e embaixo',
    pairs: [
      { name: 'Texto · --color-text', foreground: c.text },
      { name: 'Texto suave · --color-text-muted', foreground: c.textMuted },
    ],
  },
  {
    name: 'Paper',
    token: '--color-paper',
    hex: c.paper,
    sectionClass: 'process-section',
    label: { number: '03', text: 'Como acontece' },
    where: 'Processo e a janela do workspace',
    pairs: [
      { name: 'Texto · --color-ink', foreground: c.ink },
      { name: 'Texto suave · --color-paper-muted', foreground: c.paperMuted },
      { name: 'Números · --color-brand-700', foreground: tokens.color.brand[700] },
    ],
  },
  {
    name: 'Accent',
    token: '--color-accent',
    hex: c.accent,
    sectionClass: 'contact-section',
    label: { number: '06', text: 'Vamos construir juntos' },
    where: 'Contato, a última seção antes do rodapé',
    pairs: [{ name: 'Texto, números e ação · --color-ink', foreground: c.ink }],
  },
]

export function Surfaces() {
  return (
    <DocSection
      id="superficies"
      number="01"
      label="Superfícies"
      title="Quatro fundos."
      accent="Cada um no seu lugar."
      description="A página troca de fundo de ponta a ponta, sem cartões. As faixas abaixo usam as mesmas classes das seções reais."
      flush
      bleed={surfaces.map((surface) => (
        <SurfaceBand key={surface.name} surface={surface} />
      ))}
    >
      <ol className="ds-map" aria-label="Ordem das superfícies na landing">
        {pageMap.map((item) => (
          <li key={item.name}>
            <span style={{ background: mapBackground[item.surface] }} aria-hidden />
            <span>
              {item.name} · {item.surface}
            </span>
          </li>
        ))}
      </ol>
    </DocSection>
  )
}

function SurfaceBand({ surface }: { surface: Surface }) {
  return (
    <div className={cn('ds-band', surface.sectionClass)} data-testid={`surface-${surface.name}`}>
      <Container className="ds-band-grid">
        <div>
          <SectionLabel number={surface.label.number}>{surface.label.text}</SectionLabel>
          <p className="section-title ds-band-name">{surface.name}</p>
          <p className="ds-band-token">
            {surface.token} · {surface.hex} · {surface.where}
          </p>
        </div>
        <dl>
          {surface.pairs.map((pair) => {
            const contrast = measureContrast(pair.foreground, surface.hex, 'text')
            return (
              <div key={pair.name}>
                <dt>{pair.name}</dt>
                <dd>
                  {contrast.label} · {contrast.verdict}
                </dd>
              </div>
            )
          })}
        </dl>
      </Container>
    </div>
  )
}
