import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/Footer'
import { getDictionary } from '@/content'
import { LocaleProvider } from '@/i18n/LocaleProvider'

describe('Footer', () => {
  it('mostra os dois contatos diretos, sempre, independente do locale', () => {
    render(
      <LocaleProvider initialLocale="en">
        <Footer />
      </LocaleProvider>,
    )
    expect(
      screen.getByRole('link', { name: getDictionary('en').contact.direct.whatsapp }),
    ).toHaveAttribute('href', expect.stringContaining('https://wa.me/'))
    expect(
      screen.getByRole('link', { name: getDictionary('en').contact.direct.email }),
    ).toHaveAttribute('href', expect.stringContaining('mailto:'))
  })

  it('o copyright inclui o ano atual', () => {
    render(
      <LocaleProvider initialLocale="pt-BR">
        <Footer />
      </LocaleProvider>,
    )
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
  })

  it('sem contatos, troca os CTAs por um link de volta ao site', () => {
    render(
      <LocaleProvider initialLocale="pt-BR">
        <Footer contacts={false} />
      </LocaleProvider>,
    )
    expect(screen.queryByTestId('footer-whatsapp')).not.toBeInTheDocument()
    expect(screen.queryByTestId('footer-email')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: getDictionary('pt-BR').footer.site })).toHaveAttribute(
      'href',
      '/',
    )
  })
})
