'use client'

import * as React from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

// Componente sem saída visual: só liga/desliga o Lenis conforme a
// preferência de movimento. `useReducedMotion()` começa em `true` no
// servidor e na primeira pintura de propósito (ver o comentário no próprio
// hook) — então o Lenis nunca chega a inicializar antes de sabermos a
// preferência real, o que evita o próprio símbolo/scroll "pulando" para
// suave por um frame para quem pediu movimento reduzido.
//
// `autoRaf: true` deixa o Lenis rodar seu próprio loop de
// requestAnimationFrame; `destroy()` no cleanup também para esse loop, não
// só remove os listeners.
export function SmoothScroll() {
  const reducedMotion = useReducedMotion()

  React.useEffect(() => {
    if (reducedMotion) return

    const lenis = new Lenis({ autoRaf: true })
    return () => {
      lenis.destroy()
    }
  }, [reducedMotion])

  return null
}
