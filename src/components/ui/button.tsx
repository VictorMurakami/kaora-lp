'use client'
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-[var(--radius-md)] font-medium',
    'transition-[transform,background-color,border-color,box-shadow]',
    'duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]',
    'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-field)] text-[var(--color-ink)] hover:bg-[var(--color-brand-400)]',
        secondary:
          'bg-[var(--color-surface-elevated)] text-[var(--color-text)] hover:bg-[var(--color-neutral-700)]',
        outline:
          'border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-field)] hover:text-[var(--color-field)]',
        ghost: 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
      },
      size: {
        sm: 'h-9 px-3.5 text-sm',
        md: 'h-11 px-5',
        lg: 'h-13 px-7 text-[length:var(--text-body-lg)]',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { loading?: boolean; asChild?: boolean }

export function Button({
  className,
  variant,
  size,
  loading,
  asChild,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  const isDisabled = loading || props.disabled

  return (
    <Comp
      aria-busy={loading || undefined}
      aria-disabled={asChild && isDisabled ? true : undefined}
      // `disabled` is an HTML attribute buttons understand; when `asChild` renders
      // an anchor (WhatsApp links etc.), HTML silently ignores `disabled` there and
      // the element stays clickable. So it's only forwarded for the native button.
      disabled={asChild ? undefined : isDisabled}
      tabIndex={asChild && isDisabled ? -1 : undefined}
      className={cn(
        buttonVariants({ variant, size }),
        asChild && isDisabled && 'pointer-events-none',
        className,
      )}
      {...props}
    >
      {asChild ? (
        // Radix `Slot` requires exactly one React element child (it clones its
        // own props onto that element instead of wrapping it). `{loading &&
        // <Loader2 />}{children}` below is two child slots even when `loading`
        // is false — `React.Children.count` counts a literal `false` as a slot,
        // it does not drop it the way `Children.map`'s output does — so Slot
        // throws ("Expected a single React element child") the moment any
        // `asChild` consumer renders without `loading`. The loading spinner
        // has no meaningful asChild story anyway (see the `disabled` comment
        // above), so this path skips it and forwards `children` untouched.
        children
      ) : (
        <>
          {loading && <Loader2 aria-hidden className="size-4 animate-spin" />}
          {children}
        </>
      )}
    </Comp>
  )
}
