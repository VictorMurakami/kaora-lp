import { describe, it, expect } from 'vitest'
import { whatsappHref, mailtoHref } from '@/lib/contact'

describe('whatsappHref', () => {
  it('usa o número da marca em formato internacional sem símbolos', () => {
    expect(whatsappHref()).toContain('https://wa.me/5514998948041')
  })

  it('codifica a mensagem para sobreviver a acento e espaço', () => {
    expect(whatsappHref('Olá, quero um orçamento')).toContain(
      'text=Ol%C3%A1%2C%20quero%20um%20or%C3%A7amento',
    )
  })

  it('sem mensagem, não adiciona a query string', () => {
    expect(whatsappHref()).not.toContain('?')
  })
})

describe('mailtoHref', () => {
  it('usa o e-mail de contato configurado', () => {
    expect(mailtoHref()).toContain('mailto:victormurakami@kaorabr.com')
  })

  it('codifica o assunto para sobreviver a acento e espaço', () => {
    expect(mailtoHref('Novo projeto: orçamento')).toContain(
      'subject=Novo%20projeto%3A%20or%C3%A7amento',
    )
  })

  it('sem assunto, não adiciona a query string', () => {
    expect(mailtoHref()).not.toContain('?')
  })
})
