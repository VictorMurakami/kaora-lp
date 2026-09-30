import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { getDictionary } from '@/content'
import { DocSection, Subtitle, Code } from './DocSection'
import { WorkspaceExcerpt } from './WorkspaceExcerpt'

const dict = getDictionary('pt-BR')
const mapPath = 'M15 60 H70 V25 H130 V60 H185'

export function SectionPatterns() {
  return (
    <DocSection
      id="padroes"
      number="06"
      label="Padrões de seção"
      title="Três composições próprias."
      accent="Cada uma serve a uma seção."
      description="Princípios em grade, processo em lista sobre paper e o workspace como prova de interface. Trechos reduzidos, com as classes reais."
      flush
      bleed={
        <>
          <div className="process-section ds-pattern-band" data-testid="process-sample">
            <Container>
              <Subtitle>
                <Code>.process-heading</Code> e <Code>.process-list</Code>, sobre paper
              </Subtitle>
              <div className="process-heading ds-process-heading">
                <p className="section-title">
                  {dict.studio.processLead}
                  <span className="muted-heading">{dict.studio.processAccent}</span>
                </p>
                <svg className="process-map" viewBox="0 0 200 100" fill="none" aria-hidden>
                  <path d={mapPath} stroke="var(--color-paper-border)" strokeWidth="2" />
                  <path d={mapPath} stroke="var(--color-brand-600)" strokeWidth="2" />
                  {[15, 70, 130, 185].map((x, index) => (
                    <g key={x}>
                      <circle
                        cx={x}
                        cy={index === 1 || index === 2 ? 25 : 60}
                        r="4"
                        fill="var(--color-ink)"
                      />
                      <text
                        x={x}
                        y="92"
                        textAnchor="middle"
                        fill="var(--color-paper-muted)"
                        fontSize="9"
                      >
                        0{index + 1}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              <ol className="process-list">
                {dict.process.items.slice(0, 2).map((step, index) => (
                  <li key={step.title} data-reveal>
                    <span className="process-number">0{index + 1}</span>
                    <span className="ds-type-process">{step.title}</span>
                    <div>
                      <p>{step.text}</p>
                      <span className="process-output">{dict.studio.processOutputs[index]}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </Container>
          </div>
          <div className="playground-section ds-pattern-band">
            <Container>
              <Subtitle>
                <Code>.workspace-demo</Code>: paper sobre surface, raio 10px
              </Subtitle>
              <div className="playground-grid ds-workspace-grid">
                <div className="ds-spec-meta">
                  <p className="ds-spec-name">A janela do workspace</p>
                  <dl>
                    <div className="contents">
                      <dt>Fundo</dt>
                      <dd>paper, texto ink, apoio paper-muted</dd>
                    </div>
                    <div className="contents">
                      <dt>Forma</dt>
                      <dd>Raio 10px, sombra 0 24px 80px preto a 20%</dd>
                    </div>
                    <div className="contents">
                      <dt>Filtros</dt>
                      <dd>aria-pressed com linha ink de 2px</dd>
                    </div>
                    <div className="contents">
                      <dt>Tarefas</dt>
                      <dd>Linhas de 46px, tag com raio 4px</dd>
                    </div>
                    <div className="contents">
                      <dt>Progresso</dt>
                      <dd>Trilho paper-border, barra brand-600</dd>
                    </div>
                  </dl>
                </div>
                <WorkspaceExcerpt copy={dict.playground} />
              </div>
            </Container>
          </div>
        </>
      }
    >
      <Subtitle>
        <Code>.principles-grid</Code> e <Code>.principle-marker</Code>
      </Subtitle>
      <div className="principles-grid" data-testid="principles-sample">
        {dict.differentiators.items.map((item, index) => (
          <article key={item.title} data-reveal={index}>
            <div className="principle-marker">
              <span>0{index + 1}</span>
              <ArrowUpRight size={21} aria-hidden />
            </div>
            <span className="ds-type-principle block">{item.title}</span>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </DocSection>
  )
}
