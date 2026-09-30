import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Logo } from '@/components/brand/Logo'
import { Symbol } from '@/components/brand/Symbol'
import { getDictionary } from '@/content'
import { defaultLocale } from '@/i18n/config'
import { SITE_URL } from '@/lib/site'

// The image renderer reads neither woff2 nor variable fonts, so static Archivo
// weights live in the repository. They are read on first render, not on import:
// the images are prerendered, and the deployed Worker has no filesystem.
const fontDirectory = join(process.cwd(), 'src/assets/fonts')
const loadFonts = () =>
  Promise.all(
    ([400, 500] as const).map(async (weight) => ({
      name: 'Archivo',
      data: await readFile(join(fontDirectory, `archivo-latin-${weight}-normal.woff`)),
      weight,
      style: 'normal' as const,
    })),
  )
let fonts: ReturnType<typeof loadFonts> | undefined

const colors = {
  ground: '#0a0a0b',
  text: '#f7f7f8',
  muted: '#a2a2ad',
  accent: '#f86f2f',
  border: '#2f2f37',
}

/** Link preview for WhatsApp, LinkedIn, Slack and X, in the source language. */
export async function renderShareImage(size: { width: number; height: number }) {
  const { hero, studio } = getDictionary(defaultLocale)
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: colors.ground,
        color: colors.text,
        fontFamily: 'Archivo',
        padding: '68px 80px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
        }}
      >
        <Logo style={{ width: 176, height: 38, color: colors.text }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontSize: 18,
              letterSpacing: 3,
              fontWeight: 500,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 8, background: colors.accent }} />
            {hero.badge}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 28,
              fontSize: 92,
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: -5,
            }}
          >
            <span>{studio.heroLead}</span>
            <span>{studio.heroMiddle}</span>
            <span style={{ color: colors.accent, fontSize: 82 }}>{studio.heroAccent}</span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: `1px solid ${colors.border}`,
            paddingTop: 20,
            fontSize: 20,
            color: colors.muted,
          }}
        >
          <span>{SITE_URL.host}</span>
          <span>{studio.location}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 60 }}>
        <Symbol decorative style={{ width: 300, height: 300, color: colors.accent }} />
      </div>
    </div>,
    { ...size, fonts: await (fonts ??= loadFonts()) },
  )
}
