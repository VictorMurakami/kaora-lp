import type { ReactNode } from 'react'
import { Container } from '@/components/layout/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'

type DocSectionProps = {
  id: string
  number: string
  label: string
  title: string
  accent: string
  description: ReactNode
  children: ReactNode
  /** Content rendered after the container, edge to edge. */
  bleed?: ReactNode
  /** Drops the bottom padding when the section ends on a full-bleed band. */
  flush?: boolean
}

export function DocSection({
  id,
  number,
  label,
  title,
  accent,
  description,
  children,
  bleed,
  flush,
}: DocSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={
        flush ? 'content-section ds-section ds-section-flush' : 'content-section ds-section'
      }
    >
      <Container>
        <SectionLabel number={number}>{label}</SectionLabel>
        <div className="section-intro">
          <h2 id={`${id}-title`} className="section-title" data-reveal>
            {title}
            <span className="muted-heading">{accent}</span>
          </h2>
          <p className="section-description">{description}</p>
        </div>
        {children}
      </Container>
      {bleed}
    </section>
  )
}

export function Subtitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="ds-subtitle">
      <span className="status-dot" />
      <span>{children}</span>
    </h3>
  )
}

export type Spec = readonly [term: string, value: ReactNode]

export function SpecRow({
  name,
  specs,
  children,
  testId,
}: {
  name: ReactNode
  specs: readonly Spec[]
  children: ReactNode
  testId?: string
}) {
  return (
    <div className="ds-spec-row" data-testid={testId}>
      <div className="ds-spec-sample">{children}</div>
      <div className="ds-spec-meta">
        <p className="ds-spec-name">{name}</p>
        <dl>
          {specs.map(([term, value]) => (
            <div key={term} className="contents">
              <dt>{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="ds-code">{children}</code>
}
