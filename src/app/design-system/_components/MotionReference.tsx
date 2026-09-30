import { springs } from '@/design-system/motion'
import { interaction } from '@/design-system/interaction'
import { tokens, cssEasing } from '@/design-system/tokens'
import { DocSection, SpecRow, Subtitle, Code } from './DocSection'
import { RevealDemo } from './RevealDemo'

const ms = (seconds: number) => `${Math.round(seconds * 1000)}ms`
const snappy = `stiffness ${springs.snappy.stiffness}, damping ${springs.snappy.damping}, mass ${springs.snappy.mass}`

export function MotionReference() {
  return (
    <DocSection
      id="motion"
      number="07"
      label="Motion"
      title="Movimento que responde."
      accent="Nunca enfeite em loop."
      description="Só o que a landing usa hoje. Uma curva, três durações e uma mola. Tudo desliga com movimento reduzido."
    >
      <div className="ds-spec">
        <SpecRow
          name="Tokens"
          specs={[
            ['--duration-fast', `${tokens.duration.fast}ms · cor, fundo, hover`],
            ['--duration-base', `${tokens.duration.base}ms · disclosure, menu, topo`],
            ['--duration-slow', `${tokens.duration.slow}ms · entrada na rolagem, glitch`],
            ['--ease-out-expo', cssEasing(tokens.easing.outExpo)],
            ['springs.snappy', snappy],
          ]}
        >
          <p className="section-description">
            As durações saem de <Code>tokens.ts</Code> e chegam ao CSS como variáveis e ao JS por{' '}
            <Code>interaction.ts</Code>. Nenhum número solto nos componentes.
          </p>
        </SpecRow>
      </div>

      <Subtitle>Entrada na rolagem · ScrollExperience</Subtitle>
      <p className="section-description max-w-[720px]">
        Elementos com <Code>data-reveal</Code> que começam abaixo da dobra sobem{' '}
        {interaction.revealDistance}px e vão de 30% a 100% de opacidade em{' '}
        {ms(interaction.duration.slow)}. O valor do atributo multiplica um atraso de{' '}
        {ms(interaction.stagger)}. A marca do rótulo gira de −60° a 0°. Esta página usa o mesmo
        componente: role e veja.
      </p>
      <div className="mt-8">
        <RevealDemo />
      </div>

      <Subtitle>Onde mais há movimento</Subtitle>
      <div className="ds-spec">
        <SpecRow
          name="Barra de leitura"
          specs={[
            ['Forma', 'Linha de 2px em accent no topo'],
            ['Curva', 'springs.snappy sobre o progresso da rolagem'],
          ]}
        >
          <p className="section-description">Está no topo desta página enquanto você rola.</p>
        </SpecRow>
        <SpecRow
          name={<Code>AnimatedDisclosure</Code>}
          specs={[
            ['Abre e fecha', `Altura e opacidade, ${tokens.duration.base}ms, out-expo`],
            ['Ícone', `+ gira 45°, ${tokens.duration.fast}ms`],
            ['Onde', 'Serviços e FAQ'],
          ]}
        >
          <p className="section-description">
            Usa <Code>details</Code> nativo: sem JavaScript, abre e fecha do mesmo jeito. Teste na
            seção 05.
          </p>
        </SpecRow>
        <SpecRow
          name="Hover das ações"
          specs={[
            ['Ação', `Sobe 2px em ${tokens.duration.fast}ms`],
            ['Seta', `Anda 2px para cima e para a direita em ${tokens.duration.base}ms`],
            ['Ícone de serviço', 'Anda 4px e gira −8°'],
          ]}
        >
          <p className="section-description">Veja na seção 04 e na linha de serviço da 05.</p>
        </SpecRow>
        <SpecRow
          name="Workspace"
          specs={[
            [
              'Entrada',
              `Gira de ${interaction.workspace.rotation}° a 0° e sobe ${interaction.workspace.entrance}px com a rolagem`,
            ],
            ['Tarefas', `Saem subindo ${interaction.revealDistance}px com springs.snappy`],
            ['Progresso', `Barra em scaleX, ${tokens.duration.base}ms`],
          ]}
        >
          <p className="section-description">A amostra da seção 06 fica parada de propósito.</p>
        </SpecRow>
        <SpecRow
          name="Mapa do processo"
          specs={[
            ['Linha', 'Traço brand-600 desenhado conforme a seção passa pelo centro da tela'],
          ]}
        >
          <p className="section-description">Na amostra da seção 06 o traço aparece completo.</p>
        </SpecRow>
        <SpecRow
          name="Topo e menu"
          specs={[
            [
              'Topo',
              `Some ao descer, volta ao subir ou ao receber foco, ${tokens.duration.base}ms`,
            ],
            ['Links', `GlitchText embaralha o texto por ${tokens.duration.slow}ms no hover`],
            [
              'Menu do celular',
              `Diálogo entra da direita em ${tokens.duration.base}ms, itens com ${ms(interaction.stagger)} de intervalo`,
            ],
            ['Flutuante', `Aparece subindo 16px em ${tokens.duration.base}ms`],
          ]}
        >
          <p className="section-description">
            Os links com glitch estão na seção 04. O menu e o topo ficam na landing.
          </p>
        </SpecRow>
        <SpecRow
          name="Escultura do hero"
          specs={[
            ['Ponteiro', `${interaction.sculpture.pointerDuration}ms`],
            ['Rolagem', `${interaction.sculpture.scrollDuration}ms`],
            ['Troca de modo', `${interaction.sculpture.morphDuration}ms`],
          ]}
        >
          <p className="section-description">
            Three.js com anime.js. Tem motion próprio e só aparece no hero; sem JavaScript ou com
            movimento reduzido, vira um SVG parado.
          </p>
        </SpecRow>
      </div>

      <p className="ds-note">
        <span className="status-dot" />
        <span>
          <strong>Movimento reduzido.</strong> Transições e animações de CSS caem para 0,01ms. A
          entrada na rolagem e a barra de leitura não montam. O disclosure abre direto, o workspace
          e a escultura ficam parados, o glitch não roda e o menu aparece sem deslizar. Em aparelhos
          com até 4 núcleos, a entrada na rolagem também fica desligada.
        </span>
      </p>
    </DocSection>
  )
}
