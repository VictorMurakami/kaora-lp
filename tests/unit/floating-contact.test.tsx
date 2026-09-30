import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FloatingContact } from '@/components/layout/FloatingContact'
import { getDictionary } from '@/content'
import { LocaleProvider } from '@/i18n/LocaleProvider'

// `#hero`/`#contact` não existem no DOM de teste (eles só existirão a
// partir das Tasks 10 e 17), então os efeitos de IntersectionObserver do
// componente não chegam a rodar e o botão fica permanentemente
// `aria-hidden` (o estado seguro documentado no componente). Isso também
// apaga o nome acessível computado pra quem consulta a árvore de
// acessibilidade — corretamente, é assim que um leitor de tela trataria o
// elemento — então os testes verificam o atributo `aria-label` bruto em vez
// de `toHaveAccessibleName`, que retornaria vazio para um nó `aria-hidden`.
describe('FloatingContact', () => {
  it('em pt-BR, aponta para o WhatsApp com o aria-label do WhatsApp', () => {
    render(
      <LocaleProvider initialLocale="pt-BR">
        <FloatingContact />
      </LocaleProvider>,
    )
    const link = screen.getByRole('link', { hidden: true })
    expect(link).toHaveAttribute('href', expect.stringContaining('https://wa.me/'))
    expect(link).toHaveAttribute('aria-label', getDictionary('pt-BR').floating.whatsappAria)
  })

  it('em en, aponta para o e-mail com o aria-label de e-mail', () => {
    render(
      <LocaleProvider initialLocale="en">
        <FloatingContact />
      </LocaleProvider>,
    )
    const link = screen.getByRole('link', { hidden: true })
    expect(link).toHaveAttribute('href', expect.stringContaining('mailto:'))
    expect(link).toHaveAttribute('aria-label', getDictionary('en').floating.emailAria)
  })

  it('em es, aponta para o WhatsApp, como em pt-BR', () => {
    render(
      <LocaleProvider initialLocale="es">
        <FloatingContact />
      </LocaleProvider>,
    )
    const link = screen.getByRole('link', { hidden: true })
    expect(link).toHaveAttribute('href', expect.stringContaining('https://wa.me/'))
  })
})
