import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('em loading, fica desabilitado e anuncia o estado', async () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Enviar
      </Button>,
    )
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-busy', 'true')
    await userEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('o texto do botão continua legível durante o loading', () => {
    render(<Button loading>Enviar</Button>)
    expect(screen.getByRole('button')).toHaveAccessibleName(/enviar/i)
  })

  it('o variant primary é campo laranja com tinta preta, nunca com texto branco', () => {
    const { container } = render(<Button variant="primary">Ir</Button>)
    const cls = container.firstElementChild!.className
    expect(cls).toContain('bg-[var(--color-field)]')
    expect(cls).toContain('text-[var(--color-ink)]')
    // Texto branco sobre o laranja dá 4,04:1 e reprova AA.
    expect(cls.split(/\s+/)).not.toContain('text-white')
  })

  // Regressão: `asChild` renderiza `Slot` (Radix), que exige exatamente um
  // filho React. `{loading && <Loader2 />}{children}` é dois itens no array
  // de children mesmo com `loading` falsy — `React.Children.count` conta um
  // `false` literal como item, ao contrário do array que `Children.map`
  // devolve — então, antes do fix, isto lançava "Slot failed to slot onto
  // its children" sempre que alguém usasse `asChild` sem `loading`. Header
  // (Task 9) foi o primeiro consumidor real de `asChild` no projeto; Hero
  // (Task 10) e o CTA final (Task 17) serão o segundo e o terceiro, ambos
  // para links de WhatsApp/e-mail — então esta é a garantia que impede o
  // bug de voltar por baixo dessas duas tasks futuras.
  it('com asChild e sem loading, renderiza o filho como link em vez de lançar', () => {
    expect(() =>
      render(
        <Button asChild>
          <a href="#x">Go</a>
        </Button>,
      ),
    ).not.toThrow()
    const link = screen.getByRole('link', { name: 'Go' })
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '#x')
  })
})
