import type { ReactNode } from 'react'
import { DocSection, SpecRow, Code, type Spec } from './DocSection'

type TypeSample = {
  name: ReactNode
  specs: readonly Spec[]
  sample: ReactNode
  testId?: string
}

const samples: TypeSample[] = [
  {
    name: <Code>.hero-title</Code>,
    specs: [
      ['Tamanho', 'clamp(3.6rem, 5.8vw, 5.5rem)'],
      ['Peso', '500'],
      ['Tracking', '−0.065em'],
      ['Entrelinha', '1.01'],
      ['Onde', 'Título do hero'],
    ],
    sample: (
      <p className="hero-title">
        <span>Seu próximo</span>
        <span>passo.</span>
      </p>
    ),
  },
  {
    name: <Code>.hero-title-accent</Code>,
    specs: [
      ['Tamanho', '0.88em do título'],
      ['Tracking', '−0.055em'],
      ['Cor', '--color-accent'],
      ['Onde', 'Última linha do hero'],
    ],
    sample: (
      <p className="hero-title">
        <span className="hero-title-accent">Em software.</span>
      </p>
    ),
  },
  {
    name: <Code>.contact-grid h2</Code>,
    specs: [
      ['Tamanho', 'clamp(2.7rem, 5.5vw, 5rem)'],
      ['Peso', '500'],
      ['Tracking', '−0.055em'],
      ['Entrelinha', '1.06'],
      ['Onde', 'Título do contato, sobre accent'],
    ],
    sample: (
      <div className="contact-section ds-stage">
        <p className="ds-type-contact" data-testid="type-contact">
          Boas ideias merecem
          <span>sair do papel.</span>
        </p>
      </div>
    ),
  },
  {
    name: (
      <>
        <Code>.section-title</Code> + <Code>.muted-heading</Code>
      </>
    ),
    specs: [
      ['Tamanho', 'clamp(2rem, 3.65vw, 3.5rem)'],
      ['Peso', '400'],
      ['Tracking', '−0.045em'],
      ['Entrelinha', '1.12'],
      ['Segunda linha', '--color-text-muted, em bloco'],
      ['Onde', 'Título de toda seção'],
    ],
    sample: (
      <p className="section-title">
        Clareza em cada etapa.
        <span className="muted-heading">Você em todas elas.</span>
      </p>
    ),
  },
  {
    name: <Code>.faq-grid .section-title</Code>,
    specs: [
      ['Tamanho', 'clamp(1.8rem, 3vw, 2.8rem)'],
      ['Onde', 'Título do FAQ, em coluna estreita'],
    ],
    sample: (
      <div className="faq-grid">
        <p className="section-title">Perguntas antes da primeira conversa</p>
      </div>
    ),
  },
  {
    name: <Code>.process-list h3</Code>,
    specs: [
      ['Tamanho', 'clamp(1.4rem, 2.5vw, 2rem)'],
      ['Peso', '400'],
      ['Tracking', '−0.03em'],
      ['Onde', 'Etapas do processo'],
    ],
    sample: (
      <p className="ds-type-process" data-testid="type-process">
        Descoberta
      </p>
    ),
  },
  {
    name: <Code>.service-item h3</Code>,
    specs: [
      ['Tamanho', 'clamp(1.2rem, 2.15vw, 1.9rem)'],
      ['Peso', '400'],
      ['Tracking', '−0.03em'],
      ['Onde', 'Linhas de serviço'],
    ],
    sample: (
      <p className="ds-type-service" data-testid="type-service">
        Aplicações web
      </p>
    ),
  },
  {
    name: <Code>.principles-grid h3</Code>,
    specs: [
      ['Tamanho', '1.35rem'],
      ['Peso', '400'],
      ['Tracking', '−0.025em'],
      ['Entrelinha', '1.35'],
      ['Onde', 'Princípios'],
    ],
    sample: (
      <p className="ds-type-principle" data-testid="type-principle">
        Você fala com quem escreve o código
      </p>
    ),
  },
  {
    name: <Code>.section-description</Code>,
    specs: [
      ['Tamanho', '0.9375rem'],
      ['Entrelinha', '1.8'],
      ['Cor', '--color-text-muted'],
      ['Onde', 'Texto de abertura das seções e do hero'],
    ],
    sample: (
      <p className="section-description">
        Da ideia que ainda está no papel ao sistema que precisa evoluir. Construímos o que faz
        sentido para o seu momento.
      </p>
    ),
  },
  {
    name: <Code>.section-label</Code>,
    specs: [
      ['Tamanho', '0.625rem (0.6rem no celular)'],
      ['Peso', '500'],
      ['Caixa', 'alta, tracking 0.14em'],
      ['Onde', 'Rótulo acima de cada título'],
    ],
    sample: <p className="section-label">Estúdio de software sob medida</p>,
  },
  {
    name: (
      <>
        <Code>.service-tags</Code> · <Code>.process-output</Code>
      </>
    ),
    specs: [
      ['Tamanho', '0.6875rem e 0.625rem'],
      ['Onde', 'Metadados, tags, notas de rodapé'],
    ],
    sample: (
      <p className="flex flex-wrap items-baseline gap-6">
        <span className="service-tags">Plataformas · SaaS · E-commerce</span>
        <span className="process-output">Problema definido + plano de ação</span>
      </p>
    ),
  },
]

export function TypeScale() {
  return (
    <DocSection
      id="tipografia"
      number="03"
      label="Tipografia"
      title="Uma família."
      accent="Tamanho e peso fazem o resto."
      description="Archivo em 400, 500 e 600. Títulos com tracking negativo e entrelinha curta; texto de apoio pequeno e com espaço. Cada amostra usa a classe do site."
    >
      <div className="ds-spec">
        {samples.map((item, index) => (
          <SpecRow key={index} name={item.name} specs={item.specs} testId={item.testId}>
            {item.sample}
          </SpecRow>
        ))}
      </div>
      <p className="ds-note">
        <span className="status-dot" />
        <span>
          <strong>Quatro títulos não têm classe própria.</strong> Contato, processo, serviço e
          princípio usam seletores do tipo <Code>.contact-grid h2</Code>. As amostras deles repetem
          os valores, e um teste compara com a landing.
        </span>
      </p>
    </DocSection>
  )
}
