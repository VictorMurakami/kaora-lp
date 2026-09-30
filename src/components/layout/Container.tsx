import * as React from 'react'
import { cn } from '@/lib/utils'

export type ContainerProps = React.ComponentProps<'div'> & {
  size?: 'default' | 'narrow'
}

export function Container({ size = 'default', className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'site-container',
        size === 'narrow' ? 'max-w-3xl' : 'max-w-[1440px]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
