import Link from 'next/link'
import { ArrowUp, ArrowUpRight, MessageCircle } from 'lucide-react'
import { GlitchText } from '@/components/effects/ripple/GlitchText'
import { LanguageSwitch } from '@/components/layout/LanguageSwitch'
import { getDictionary } from '@/content'
import { mailtoHref, whatsappHref } from '@/lib/contact'
import { DocSection, SpecRow, Code } from './DocSection'
import { ModeButtons } from './ModeButtons'

const dict = getDictionary('pt-BR')
const focusRing = 'Contorno 2px brand-400, afastado 5px'

export function Actions() {
  return (
    <DocSection
      id="acoes"
      number="04"
      label="Ações"
      title="Poucas ações."
      accent="Todas levam a uma conversa."
      description="Passe o mouse e navegue com Tab: hover e foco abaixo são os estados reais do CSS da landing."
    >
      <div className="ds-spec">
        <SpecRow
          name={<Code>.action-link.action-primary</Code>}
          specs={[
            ['Medidas', '52px de altura, raio 3px, 0.8125rem/500'],
            ['Hover', 'Fundo brand-300, sobe 2px, seta anda 2px'],
            ['Foco', focusRing],
            ['Onde', 'CTA do hero'],
          ]}
        >
          <Link
            href="/#contact"
            className="action-link action-primary"
            data-testid="action-primary"
          >
            {dict.hero.ctaPrimary}
            <ArrowUpRight size={18} aria-hidden />
          </Link>
        </SpecRow>

        <SpecRow
          name={<Code>.action-link.action-dark</Code>}
          specs={[
            ['Medidas', 'As mesmas da ação principal'],
            ['Hover', 'Fundo surface-elevated, sobe 2px'],
            ['Foco', 'Contorno ink, pela regra .contact-section'],
            ['Onde', 'Só no contato, sobre accent'],
          ]}
        >
          <div className="contact-section ds-stage">
            <a href={whatsappHref()} className="action-link action-dark">
              {dict.hero.ctaSecondary}
              <ArrowUpRight size={20} aria-hidden />
            </a>
            <a href={mailtoHref()} className="text-link">
              {dict.contact.direct.email}
              <ArrowUpRight size={18} aria-hidden />
            </a>
          </div>
        </SpecRow>

        <SpecRow
          name={<Code>.text-link</Code>}
          specs={[
            ['Medidas', '44px de área, 0.75rem'],
            ['Hover', 'Sublinhado a 5px do texto'],
            ['Foco', focusRing],
            ['Onde', 'Ação secundária do hero, serviços, contato'],
          ]}
        >
          <a href={whatsappHref()} className="text-link">
            {dict.hero.ctaSecondary}
            <ArrowUpRight size={15} aria-hidden />
          </a>
        </SpecRow>

        <SpecRow
          name={<Code>.header-contact</Code>}
          specs={[
            ['Medidas', '44px, raio full, linha --color-border'],
            ['Hover', 'Inverte: fundo text, texto ink'],
            ['Foco', focusRing],
            ['Onde', 'Topo da página, sempre visível'],
          ]}
        >
          <a href={whatsappHref()} className="header-contact w-fit" data-testid="action-pill">
            {dict.nav.cta}
            <ArrowUpRight size={16} aria-hidden />
          </a>
        </SpecRow>

        <SpecRow
          name={
            <>
              <Code>.desktop-navigation</Code> com <Code>GlitchText</Code>
            </>
          }
          specs={[
            ['Medidas', '44px de área, 0.8125rem'],
            ['Hover', 'Texto sai do suave para o claro e embaralha por 700ms'],
            ['Celular', 'Some abaixo de 768px; os links vão para o menu'],
            ['Onde', 'Navegação do topo'],
          ]}
        >
          <nav className="ds-nav" aria-label="Navegação (amostra)">
            <div className="desktop-navigation">
              <GlitchText
                as="a"
                trigger="hover"
                className="flex items-center"
                text="Superfícies"
                href="#superficies"
              />
              <GlitchText
                as="a"
                trigger="hover"
                className="flex items-center"
                text="Ações"
                href="#acoes"
              />
              <GlitchText
                as="a"
                trigger="hover"
                className="flex items-center"
                text="Marca"
                href="#marca"
              />
            </div>
          </nav>
        </SpecRow>

        <SpecRow
          name={<Code>.language-switch</Code>}
          specs={[
            ['Medidas', '44 × 32px por idioma, 0.6875rem'],
            ['Atual', 'aria-pressed pinta de accent; troca o idioma sem sair da página'],
            ['Onde', 'Topo e menu do celular'],
          ]}
        >
          <LanguageSwitch label="Idioma (amostra)" />
        </SpecRow>

        <SpecRow
          name={<Code>.experiment-controls button</Code>}
          specs={[
            ['Medidas', '44px, raio full'],
            ['Ativo', 'aria-pressed: texto claro e linha'],
            ['Hover', 'Texto accent, fundo accent a 6%'],
            ['Onde', 'Modos da escultura no hero'],
          ]}
        >
          <ModeButtons modes={dict.studio.experimentModes} />
        </SpecRow>

        <SpecRow
          name={<Code>.back-top</Code>}
          specs={[
            ['Medidas', '48px, círculo com linha'],
            ['Hover', 'Seta sobe 3px'],
            ['Onde', 'Rodapé'],
          ]}
        >
          <a href="#topo" className="back-top" aria-label={dict.studio.backTop}>
            <ArrowUp size={21} aria-hidden />
          </a>
        </SpecRow>

        <SpecRow
          name="Botão flutuante"
          specs={[
            ['Medidas', '56px, raio full, sombra --shadow-lg'],
            ['Cor', 'Fundo field #DE4E00, ícone ink'],
            ['Quando', 'Aparece depois do hero e some no contato'],
            ['Onde', 'Canto inferior direito, fixo'],
          ]}
        >
          <a href={whatsappHref()} className="ds-floating" aria-label={dict.floating.whatsappAria}>
            <MessageCircle aria-hidden className="size-6" />
          </a>
        </SpecRow>
      </div>
    </DocSection>
  )
}
