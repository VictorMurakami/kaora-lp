'use client'

import * as React from 'react'
import { MessageCircle, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { whatsappHref, mailtoHref } from '@/lib/contact'
import { track } from '@/lib/analytics'
import { useLocale } from '@/i18n/LocaleProvider'

// Contrato de seletores (Task 9 report, ponto 3): este componente observa
// dois ids que ainda não existem no DOM porque as seções que os carregam
// são de tarefas futuras.
//   - `#hero`    — Task 10 (Hero). Some -> aparece: o flutuante entra
//                  quando o hero SAI da viewport.
//   - `#contact` — Task 17 (CTA final e formulário). Aparece -> some: o
//                  flutuante desaparece quando a seção de contato ENTRA na
//                  viewport, porque ali já existem dois caminhos maiores e
//                  o botão cobrindo o formulário no celular vira obstrução.
// Até essas tasks anexarem os ids, `getElementById` retorna null e os dois
// efeitos abaixo não fazem nada — o botão fica permanentemente invisível,
// o que é o estado seguro (nenhum destino de scroll para "sair do hero"
// ainda existe).
const HERO_ID = 'hero'
const CONTACT_ID = 'contact'

export function FloatingContact() {
  const { dict, locale } = useLocale()
  const [pastHero, setPastHero] = React.useState(false)
  const [overContact, setOverContact] = React.useState(false)

  React.useEffect(() => {
    const hero = document.getElementById(HERO_ID)
    if (!hero) return
    const observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    const contact = document.getElementById(CONTACT_ID)
    if (!contact) return
    const observer = new IntersectionObserver(([entry]) => setOverContact(entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(contact)
    return () => observer.disconnect()
  }, [])

  const visible = pastHero && !overContact

  // Mesma troca de canal do header/hero (contexto da Task 9, ponto 1):
  // WhatsApp é o CTA paralelo em pt-BR/es, e-mail assume em en.
  const isWhatsapp = locale !== 'en'
  const href = isWhatsapp ? whatsappHref() : mailtoHref()
  const Icon = isWhatsapp ? MessageCircle : Mail
  const label = isWhatsapp ? dict.floating.whatsappAria : dict.floating.emailAria

  function handleClick() {
    if (isWhatsapp) {
      track('whatsapp_click', { source: 'floating' })
    } else {
      // Não existe evento dedicado para o canal de e-mail no vocabulário
      // (só whatsapp_click, lead_submit e cta_click). `floating` é um dos quatro valores
      // válidos de origem de `cta_click`, então o clique em en usa esse
      // evento em vez de rotular um clique de e-mail como whatsapp_click.
      track('cta_click', { source: 'floating' })
    }
  }

  return (
    <a
      href={href}
      data-testid={isWhatsapp ? 'floating-whatsapp' : 'floating-email'}
      aria-label={label}
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
      onClick={handleClick}
      className={cn(
        'fixed z-40 flex size-14 items-center justify-center rounded-[var(--radius-full)]',
        // Both insets, not just the bottom one: a notched device in
        // landscape needs the right edge respected too, or the button sits
        // partly under the notch/rounded corner.
        'right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))]',
        'bg-[var(--color-field)] text-[var(--color-ink)] shadow-[var(--shadow-lg)]',
        // `visibility` rides along with `opacity`/`transform` in the same
        // transition-property list so hiding still fades+slides out instead
        // of vanishing on the spot — genuinely inert, not just invisible
        // paint. `opacity: 0` alone was ambient decoration, not really
        // hidden: it never removed the button from the accessibility tree
        // *or* from hit-testing tools that only check CSS visibility
        // (Playwright's `toBeHidden`, task-10-brief.md's own last test,
        // included — this bug is what that test caught). Task 9 already had
        // `aria-hidden`/`tabIndex={-1}`/`pointer-events-none` covering
        // screen readers and real clicks; `visibility` closes the one gap
        // those three don't: an inert element that still paints and still
        // has a hit-testable box.
        'transition-[opacity,transform,visibility] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]',
        visible
          ? 'visible translate-y-0 opacity-100'
          : 'pointer-events-none invisible translate-y-4 opacity-0',
      )}
      // The transition-delay list mirrors `transition-property`'s order
      // (opacity, transform, visibility) positionally. Showing applies all
      // three immediately; hiding delays only `visibility`'s switch to
      // `hidden` until the fade+slide-out has actually finished, so the
      // element doesn't disappear before its own exit animation plays.
      style={{ transitionDelay: visible ? '0s' : `0s, 0s, var(--duration-base)` }}
    >
      <Icon aria-hidden className="size-6" />
    </a>
  )
}
