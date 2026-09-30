import * as React from 'react'
import { cn } from '@/lib/utils'

const headingSizes = {
  xl: 'text-[length:var(--text-display-xl)]',
  lg: 'text-[length:var(--text-display-lg)]',
  md: 'text-[length:var(--text-display-md)]',
} as const

type HeadingSize = keyof typeof headingSizes

const defaultHeadingSize: Record<1 | 2 | 3, HeadingSize> = {
  1: 'xl',
  2: 'lg',
  3: 'md',
}

export type HeadingProps = Omit<React.ComponentProps<'h1'>, 'children'> & {
  level: 1 | 2 | 3
  size?: HeadingSize
  children: React.ReactNode
}

export function Heading({ level, size, className, children, ...props }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3'
  const resolvedSize = size ?? defaultHeadingSize[level]

  return (
    <Tag
      className={cn(
        'font-display text-balance text-[var(--color-text)]',
        headingSizes[resolvedSize],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

const textSizes = {
  lg: 'text-[length:var(--text-body-lg)]',
  body: 'text-[length:var(--text-body)]',
  caption: 'text-[length:var(--text-caption)]',
} as const

type TextSize = keyof typeof textSizes

export type TextProps = Omit<React.ComponentProps<'p'>, 'children'> & {
  size?: TextSize
  muted?: boolean
  as?: 'p' | 'span' | 'div'
  children: React.ReactNode
}

// Padrão pensado para parágrafo de corpo: `max-w-prose` (~65ch) mantém a
// linha de leitura confortável. Para um label, texto inline curto ou célula
// de formulário, isso é largo demais para o propósito errado na direção
// oposta — sobrescreva com `className="max-w-none"` (ou outro `max-w-*`),
// que o `cn`/`twMerge` resolve o conflito de utilitário automaticamente.
export function Text({
  size = 'body',
  muted,
  as: Tag = 'p',
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(
        'max-w-prose font-[family-name:var(--font-body)] text-pretty',
        textSizes[size],
        muted ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text)]',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
