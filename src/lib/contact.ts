// Monta os dois hrefs de saída de conversão: WhatsApp (wa.me) e e-mail
// (mailto).
// Ambos os números/endereços vêm de env vars `NEXT_PUBLIC_*` porque os
// componentes que os consomem (Header, FloatingContact, e mais tarde o
// CTA secundário do Hero) rodam no client — uma env var sem esse prefixo
// vira string vazia no bundle do navegador (ver node_modules/next/dist/docs/
// 01-app/01-getting-started/05-server-and-client-components.md, seção
// "Preventing environment poisoning").
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5514998948041'
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'victormurakami@kaorabr.com'

export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function mailtoHref(subject?: string): string {
  const base = `mailto:${CONTACT_EMAIL}`
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base
}
