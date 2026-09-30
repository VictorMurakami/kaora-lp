import type { ReactNode } from 'react'
import { Symbol } from '@/components/brand/Symbol'

export function SectionLabel({ number, children }: { number?: string; children: ReactNode }) {
  return (
    <p className="section-label">
      {number ? (
        <span className="section-number">
          <Symbol className="section-brand-mark" decorative />
          {number}
        </span>
      ) : (
        <span className="status-dot" />
      )}
      {children}
    </p>
  )
}
