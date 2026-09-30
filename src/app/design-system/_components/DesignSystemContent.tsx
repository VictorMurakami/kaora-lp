import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Surfaces } from './Surfaces'
import { ColorSection } from './ColorSection'
import { TypeScale } from './TypeScale'
import { Actions } from './Actions'
import { Editorial } from './Editorial'
import { SectionPatterns } from './SectionPatterns'
import { MotionReference } from './MotionReference'
import { Brand } from './Brand'

const index = [
  { id: 'superficies', label: 'Superfícies' },
  { id: 'cor', label: 'Cor' },
  { id: 'tipografia', label: 'Tipografia' },
  { id: 'acoes', label: 'Ações' },
  { id: 'estrutura', label: 'Estrutura editorial' },
  { id: 'padroes', label: 'Padrões de seção' },
  { id: 'motion', label: 'Motion' },
  { id: 'marca', label: 'Marca' },
]

export function DesignSystemContent() {
  return (
    <>
      <section className="ds-opening" aria-labelledby="ds-title">
        <Container>
          <SectionLabel>Design system · em uso na landing</SectionLabel>
          <h1 id="ds-title" className="hero-title" data-testid="ds-title">
            <span>Design system</span>
            <span className="hero-title-accent">da Kaora.</span>
          </h1>
          <p className="hero-description">
            Cor, tipo, ações e padrões que a landing usa hoje, com as mesmas classes do site. O que
            não aparece na landing não aparece aqui.
          </p>
          <div className="hero-actions">
            <Link href="/" className="action-link action-primary">
              Ver a landing
              <ArrowUpRight size={18} aria-hidden />
            </Link>
            <Link href="/design-system/field" className="text-link">
              Laboratório 3D
              <ArrowUpRight size={15} aria-hidden />
            </Link>
          </div>
          <nav className="ds-index" aria-label="Seções desta página">
            {index.map((item, position) => (
              <a key={item.id} href={`#${item.id}`}>
                <span>0{position + 1}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </Container>
      </section>
      <Surfaces />
      <ColorSection />
      <TypeScale />
      <Actions />
      <Editorial />
      <SectionPatterns />
      <MotionReference />
      <Brand />
    </>
  )
}
