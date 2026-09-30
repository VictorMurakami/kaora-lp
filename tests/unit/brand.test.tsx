import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Logo } from '@/components/brand/Logo'
import { Symbol } from '@/components/brand/Symbol'

describe('componentes de marca', () => {
  it('o logo é anunciado como imagem com nome', () => {
    render(<Logo />)
    expect(screen.getByRole('img', { name: /kaora/i })).toBeInTheDocument()
  })

  it('o logo herda a cor do contexto em vez de fixar branco', () => {
    const { container } = render(<Logo />)
    const filled = container.querySelectorAll('[fill]')
    filled.forEach((el) => expect(el.getAttribute('fill')).toBe('currentColor'))
  })

  it('o símbolo aceita className', () => {
    const { container } = render(<Symbol className="size-8" />)
    expect(container.querySelector('svg')).toHaveClass('size-8')
  })
})
