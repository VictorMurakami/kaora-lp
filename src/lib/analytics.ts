// Cloudflare Zaraz injects `window.zaraz` when enabled for the zone. Without
// it (local dev, tests, blocked script) events are dropped silently.
declare global {
  interface Window {
    zaraz?: { track: (event: string, props?: Record<string, unknown>) => void }
  }
}

type CtaClickProps = { source: 'header' | 'hero' | 'final' | 'floating' | 'footer' | 'contact' }
type WhatsappClickProps = {
  source: 'header' | 'hero' | 'floating' | 'footer' | 'success' | 'error_recovery' | 'contact'
}
type LeadSubmitProps = Record<string, string | number | boolean | null>

export function track(event: 'cta_click', props: CtaClickProps): void
export function track(event: 'whatsapp_click', props: WhatsappClickProps): void
export function track(event: 'lead_submit', props?: LeadSubmitProps): void
export function track(
  event: 'cta_click' | 'whatsapp_click' | 'lead_submit',
  props?: CtaClickProps | WhatsappClickProps | LeadSubmitProps,
): void {
  if (typeof window === 'undefined') return
  window.zaraz?.track(event, props)
}
