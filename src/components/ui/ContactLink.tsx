'use client'

import type { ComponentProps } from 'react'
import { track } from '@/lib/analytics'

type ContactLinkProps = ComponentProps<'a'> & { source: 'hero' | 'header' | 'footer' | 'contact' }

export function ContactLink({ source, href, children, ...props }: ContactLinkProps) {
  return (
    <a
      {...props}
      href={href}
      onClick={() => {
        if (href?.includes('wa.me')) track('whatsapp_click', { source })
        else track('cta_click', { source })
      }}
    >
      {children}
    </a>
  )
}
