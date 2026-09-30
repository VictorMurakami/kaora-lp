import Link from 'next/link'
import { ArrowUpRight, Code2, Plus } from 'lucide-react'
import { AnimatedDisclosure } from '@/components/ui/AnimatedDisclosure'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { getDictionary } from '@/content'
import { DocSection, SpecRow, Subtitle, Code } from './DocSection'

const dict = getDictionary('pt-BR')
const service = dict.services.items[0]
const question = dict.faq.items[0]

const radii = [
  { value: '3px', where: 'Ações, barra de progresso' },
  { value: '4px', where: 'Tag de tarefa' },
  { value: '10px', where: 'Workspace e ícone dele' },
  { value: '50%', where: 'Status, avatar, voltar ao topo' },
  { value: '9999px', where: 'Pill do topo, modos, flutuante' },
]

export function Editorial() {
  return (
    <DocSection
      id="estrutura"
      number="05"
      label="Estrutura editorial"
      title="Linhas finas, números, rótulos."
      accent="A página se lê como índice."
      description="As peças que se repetem em todas as seções. Os exemplos abaixo são os componentes da landing, funcionando."
    >
      <div className="ds-spec">
        <SpecRow
          name={
            <>
              <Code>SectionLabel</Code> com número
            </>
          }
          specs={[
            ['Número', 'Símbolo de 22px + dois dígitos em accent'],
            ['Sobre paper', 'Número em brand-700'],
            ['Sobre accent', 'Número em ink'],
            ['Onde', 'Topo de cada seção, de 01 a 06'],
          ]}
        >
          <SectionLabel number="01">{dict.studio.servicesLabel}</SectionLabel>
        </SpecRow>
        <SpecRow
          name={
            <>
              <Code>SectionLabel</Code> sem número
            </>
          }
          specs={[
            ['Marca', 'Ponto .status-dot no lugar do número'],
            ['Onde', 'Hero'],
          ]}
        >
          <SectionLabel>{dict.hero.badge}</SectionLabel>
        </SpecRow>
        <SpecRow
          name={<Code>.status-dot</Code>}
          specs={[
            ['Medidas', '5px, círculo, accent'],
            ['Onde', 'Nota do workspace, dica dentro dele, rótulo do hero'],
          ]}
        >
          <p className="playground-note">
            <span className="status-dot" />
            {dict.playground.note}
          </p>
        </SpecRow>
      </div>

      <Subtitle>
        <Code>.section-intro</Code>: título à esquerda, descrição à direita
      </Subtitle>
      <div className="section-intro" data-testid="section-intro-sample">
        <p className="section-title">{dict.studio.servicesIntro}</p>
        <p className="section-description">{dict.studio.servicesBody}</p>
      </div>

      <Subtitle>Linha de serviço, com AnimatedDisclosure</Subtitle>
      <div className="services-list" data-testid="service-sample">
        <AnimatedDisclosure
          className="service-item"
          summary={
            <>
              <span className="service-index">01</span>
              <Code2 className="service-icon" size={24} aria-hidden />
              <span className="ds-type-service">{service.title}</span>
              <span className="service-tags">{dict.studio.serviceTags[0]}</span>
              <Plus className="service-toggle" size={22} aria-hidden />
            </>
          }
        >
          <div className="service-detail">
            <p>{service.text}</p>
            <Link href="/#contact" className="text-link">
              {dict.hero.ctaPrimary}
              <ArrowUpRight size={16} aria-hidden />
            </Link>
          </div>
        </AnimatedDisclosure>
      </div>

      <Subtitle>Pergunta do FAQ</Subtitle>
      <div className="faq-list" data-testid="faq-sample">
        <AnimatedDisclosure
          summary={
            <>
              {question.question}
              <Plus size={20} aria-hidden />
            </>
          }
        >
          <p>{question.answer}</p>
        </AnimatedDisclosure>
      </div>

      <Subtitle>Linhas, raios e espaço</Subtitle>
      <div className="ds-spec">
        <SpecRow
          name="Linhas"
          specs={[
            ['Graphite e surface', '1px --color-border'],
            ['Paper', '1px --color-paper-border'],
            ['Accent', '1px ink a 25%'],
          ]}
        >
          <div className="ds-lines">
            <div>
              <hr />
            </div>
            <div
              className="process-section"
              style={{ ['--ds-line' as string]: 'var(--color-paper-border)' }}
            >
              <hr />
            </div>
            <div
              className="contact-section"
              style={{
                ['--ds-line' as string]: 'color-mix(in srgb, var(--color-ink) 25%, transparent)',
              }}
            >
              <hr />
            </div>
          </div>
        </SpecRow>
        <SpecRow name="Raios" specs={radii.map((radius) => [radius.value, radius.where] as const)}>
          <div className="ds-radius">
            {radii.map((radius) => (
              <figure key={radius.value}>
                <span style={{ borderRadius: radius.value }} aria-hidden />
                <figcaption>{radius.value}</figcaption>
              </figure>
            ))}
          </div>
        </SpecRow>
        <SpecRow
          name="Espaço"
          specs={[
            ['--space-section', 'clamp(5rem, 8vw, 8rem), acima e abaixo de cada seção'],
            ['--space-gutter', 'clamp(1.25rem, 4.5vw, 5rem), nas laterais'],
            ['Largura', 'Container de até 1440px'],
          ]}
        >
          <p className="section-description">
            As seções respiram pelo espaço vertical e pelas linhas, não por caixas. Nenhuma seção
            tem fundo de cartão.
          </p>
        </SpecRow>
      </div>
    </DocSection>
  )
}
