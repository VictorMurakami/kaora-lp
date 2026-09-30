import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

describe('primitivos de formulário', () => {
  it('o input é encontrado pelo texto do label', () => {
    render(
      <>
        <Label htmlFor="nome">Nome</Label>
        <Input id="nome" />
      </>,
    )
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
  })

  it('com erro, o input é inválido e aponta para a mensagem', () => {
    render(<Input id="email" error="E-mail inválido" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy!)).toHaveTextContent('E-mail inválido')
  })

  it('a mensagem de erro é anunciada por leitor de tela', () => {
    render(<Input id="email" error="E-mail inválido" />)
    expect(screen.getByRole('alert')).toHaveTextContent('E-mail inválido')
  })
})
