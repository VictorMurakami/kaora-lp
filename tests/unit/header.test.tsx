import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from '@/components/layout/Header'
import { getDictionary } from '@/content'
import { LocaleProvider } from '@/i18n/LocaleProvider'

// jsdom doesn't implement `<dialog>`'s imperative API (showModal/close) —
// real browsers do, and that's what the e2e suite exercises against. This
// stub only exists so the unit tests below can drive the open/close state
// without a real browser; it deliberately mirrors just enough of the spec
// (toggling `.open` and firing the native `close` event) for Header's own
// effects to observe.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
})

describe('Header', () => {
  it('em pt-BR, o CTA do header abre o WhatsApp da marca', () => {
    render(
      <LocaleProvider initialLocale="pt-BR">
        <Header />
      </LocaleProvider>,
    )
    const cta = screen.getByTestId('header-cta')
    expect(cta).toHaveAttribute('href', expect.stringContaining('https://wa.me/5514998948041'))
    expect(cta).toHaveAccessibleName(getDictionary('pt-BR').nav.cta)
  })

  it('em en, o CTA do header abre e-mail em vez de WhatsApp', () => {
    render(
      <LocaleProvider initialLocale="en">
        <Header />
      </LocaleProvider>,
    )
    const cta = screen.getByTestId('header-cta')
    expect(cta).toHaveAttribute('href', expect.stringContaining('mailto:'))
  })

  it('o botão de menu abre o dialog nativo com a navegação', async () => {
    const user = userEvent.setup()
    render(
      <LocaleProvider initialLocale="pt-BR">
        <Header />
      </LocaleProvider>,
    )
    const toggle = screen.getByRole('button', { name: /abrir menu/i })
    await user.click(toggle)
    expect(screen.getByRole('button', { name: /fechar menu/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Contato' }).length).toBeGreaterThan(0)
  })

  it('o menu fecha pelo botão de fechar', async () => {
    const user = userEvent.setup()
    render(
      <LocaleProvider initialLocale="pt-BR">
        <Header />
      </LocaleProvider>,
    )
    await user.click(screen.getByRole('button', { name: /abrir menu/i }))
    await user.click(screen.getByRole('button', { name: /fechar menu/i }))
    expect(screen.getByRole('button', { name: /abrir menu/i })).toBeInTheDocument()
  })

  it('o seletor troca o idioma no lugar e guarda a escolha', async () => {
    const user = userEvent.setup()
    render(
      <LocaleProvider initialLocale="pt-BR">
        <Header />
      </LocaleProvider>,
    )
    const english = screen.getAllByRole('button', { name: 'EN' })[0]
    await user.click(english)
    expect(english).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('header-cta')).toHaveAccessibleName(getDictionary('en').nav.cta)
    expect(screen.getByTestId('header-cta')).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:'),
    )
    expect(document.cookie).toContain('kaora-locale=en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('sem navegação, mostra marca, idioma e contato, mas nenhum link de seção', () => {
    render(
      <LocaleProvider initialLocale="pt-BR">
        <Header navigation={false} />
      </LocaleProvider>,
    )
    expect(screen.queryByRole('link', { name: 'Serviços' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Contato' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /abrir menu/i })).not.toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Idioma' })).toBeInTheDocument()
    expect(screen.getByTestId('header-cta')).toBeInTheDocument()
  })
})
