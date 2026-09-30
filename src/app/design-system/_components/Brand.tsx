import { Logo } from '@/components/brand/Logo'
import { Symbol } from '@/components/brand/Symbol'
import { Container } from '@/components/layout/Container'
import { DocSection, SpecRow, Code } from './DocSection'

export function Brand() {
  return (
    <DocSection
      id="marca"
      number="08"
      label="Marca"
      title="Órbita aberta."
      accent="Um ponto fora dela."
      description="Logo e símbolo pintam com currentColor: a cor vem do texto da seção. Claro no graphite, ink no accent."
      bleed={
        <Container>
          <div className="ds-brand mt-10" data-testid="brand-sample">
            <div>
              <Logo className="ds-brand-logo" />
              <Symbol className="ds-brand-symbol" />
            </div>
            <div className="contact-section">
              <Logo className="ds-brand-logo" />
              <Symbol className="ds-brand-symbol" />
            </div>
          </div>
        </Container>
      }
    >
      <div className="ds-spec">
        <SpecRow
          name="Tamanhos em uso"
          specs={[
            ['Logo no topo', '112px de largura, 96px no celular'],
            ['Logo no rodapé', '120px'],
            ['Símbolo no rótulo', '22px, decorativo'],
            ['Símbolo no workspace', '20px'],
            ['Símbolo no contato', 'Grande, girado −20°, some no celular'],
          ]}
        >
          <p className="section-description">
            O símbolo decorativo usa <Code>decorative</Code> e sai da árvore de acessibilidade. Nos
            outros casos ele se anuncia como Kaora.
          </p>
        </SpecRow>
      </div>
    </DocSection>
  )
}
