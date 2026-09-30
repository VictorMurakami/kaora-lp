import { afterEach, describe, it, expect, vi } from 'vitest'
import { track } from '@/lib/analytics'

// Zaraz is only present on the deployed zone, so these tests lock the typed
// event/prop shape our wrapper exposes and that it forwards when present.
describe('track', () => {
  it('aceita cta_click com as quatro origens válidas', () => {
    for (const source of ['header', 'hero', 'final', 'floating'] as const) {
      expect(() => track('cta_click', { source })).not.toThrow()
    }
  })

  it('aceita whatsapp_click com origem floating', () => {
    expect(() => track('whatsapp_click', { source: 'floating' })).not.toThrow()
  })

  it('aceita lead_submit sem propriedades', () => {
    expect(() => track('lead_submit')).not.toThrow()
  })

  it('encaminha o evento ao Zaraz quando ele está carregado', () => {
    const zarazTrack = vi.fn()
    window.zaraz = { track: zarazTrack }
    track('cta_click', { source: 'hero' })
    expect(zarazTrack).toHaveBeenCalledWith('cta_click', { source: 'hero' })
  })

  afterEach(() => {
    delete window.zaraz
  })
})
