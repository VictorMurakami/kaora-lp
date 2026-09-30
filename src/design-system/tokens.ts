export const tokens = {
  color: {
    brand: {
      50: '#FFF3EC',
      100: '#FFE1D1',
      200: '#FFC0A3',
      300: '#FF9868',
      400: '#F86F2F',
      500: '#DE4E00',
      600: '#C43F00',
      700: '#9E3200',
      800: '#7A2700',
      900: '#5C1D00',
      950: '#331000',
    },
    neutral: {
      50: '#F7F7F8',
      100: '#E9E9EC',
      200: '#C9C9D0',
      300: '#A2A2AD',
      400: '#7B7B88',
      500: '#5C5C68',
      600: '#44444E',
      700: '#2F2F37',
      800: '#1D1D23',
      900: '#131318',
      950: '#0A0A0B',
    },
    semantic: {
      bg: '#0A0A0B',
      surface: '#131318',
      surfaceElevated: '#1D1D23',
      border: '#2F2F37',
      text: '#F7F7F8',
      textMuted: '#A2A2AD',
      field: '#DE4E00',
      ink: '#0A0A0B',
      onFieldMuted: '#3D1600',
      paper: '#EAE8E1',
      paperMuted: '#5E605B',
      paperBorder: '#CBCBC2',
      accent: '#F86F2F',
      success: '#3FBF6F',
      error: '#FF6B5A',
    },
  },
  radius: { sm: '0.25rem', md: '0.5rem', lg: '0.875rem', xl: '1.5rem', full: '9999px' },
  duration: { instant: 100, fast: 200, base: 400, slow: 700, slower: 1200 },
  easing: {
    outExpo: [0.16, 1, 0.3, 1],
    inOutQuart: [0.76, 0, 0.24, 1],
  },
} as const

export function cssEasing(e: readonly number[]): string {
  return `cubic-bezier(${e.join(', ')})`
}

function channel(v: number): number {
  const s = v / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

export function luminance(hex: string): number {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}
