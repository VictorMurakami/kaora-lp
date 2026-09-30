import { Container } from '@/components/layout/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'

/** Shared frame for the 404 and error pages. */
export function StatusPage({
  label,
  title,
  body,
  children,
}: {
  label: string
  title: string
  body: string
  children: React.ReactNode
}) {
  return (
    <main id="main-content" tabIndex={-1} className="status-page">
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <h1 className="section-title">
          {title}
          <span className="muted-heading">{body}</span>
        </h1>
        <div className="status-actions">{children}</div>
      </Container>
    </main>
  )
}
