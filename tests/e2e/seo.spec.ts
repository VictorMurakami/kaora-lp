import { test, expect } from '@playwright/test'
import { getDictionary } from '@/content'
import { openInLocale } from './helpers/locale'

const SITE = 'https://kaorabr.com'

test('a página inicial declara título, descrição, canônico e prévia de compartilhamento', async ({
  page,
}) => {
  await page.goto('/')
  const dict = getDictionary('pt-BR')
  await expect(page).toHaveTitle('Kaora')
  const meta = (selector: string) => page.locator(selector).first().getAttribute('content')
  expect(await meta('meta[name="description"]')).toBe(dict.meta.description)
  const root = /^https:\/\/kaorabr\.com\/?$/
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(root)
  expect(await meta('meta[property="og:title"]')).toBe(dict.meta.title)
  expect(await meta('meta[property="og:description"]')).toBe(dict.meta.description)
  expect(await meta('meta[property="og:url"]')).toMatch(root)
  expect(await meta('meta[property="og:locale"]')).toBe('pt_BR')
  // Next points social images at localhost in development and at the site
  // URL in production builds; either way the image must be served.
  for (const [selector, path] of [
    ['meta[property="og:image"]', '/opengraph-image'],
    ['meta[name="twitter:image"]', '/twitter-image'],
  ]) {
    const image = new URL((await meta(selector))!)
    expect([SITE, new URL(page.url()).origin]).toContain(image.origin)
    expect(image.pathname).toBe(path)
    expect((await page.request.get(image.pathname + image.search)).ok()).toBe(true)
  }
  expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image')
  expect(await meta('meta[name="theme-color"]')).toBe('#0a0a0b')
  expect(await page.locator('link[rel="manifest"]').getAttribute('href')).toBeTruthy()
})

test('a prévia acompanha o idioma escolhido', async ({ page }) => {
  await openInLocale(page, 'en')
  const meta = (selector: string) => page.locator(selector).first().getAttribute('content')
  expect(await meta('meta[property="og:title"]')).toBe(getDictionary('en').meta.title)
  expect(await meta('meta[property="og:locale"]')).toBe('en_US')
})

test('a imagem de compartilhamento é um PNG de 1200x630', async ({ request }) => {
  for (const path of ['/opengraph-image', '/twitter-image']) {
    const response = await request.get(path)
    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toBe('image/png')
    const png = await response.body()
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630])
  }
})

test('robots, sitemap e manifest respondem com o conteúdo esperado', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Disallow: /design-system')
  expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`)
  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain(`<loc>${SITE}/</loc>`)
  const manifest = await (await request.get('/manifest.webmanifest')).json()
  expect(manifest).toMatchObject({ short_name: 'Kaora', start_url: '/', theme_color: '#0a0a0b' })
  for (const icon of manifest.icons as { src: string }[]) {
    expect((await request.get(icon.src)).ok()).toBe(true)
  }
})

test('os dados estruturados descrevem a Kaora como serviço profissional', async ({ page }) => {
  await page.goto('/')
  const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)
  expect(data).toMatchObject({
    '@type': 'ProfessionalService',
    name: 'Kaora',
    url: `${SITE}/`,
    address: { addressCountry: 'BR' },
  })
  expect(data.email).toContain('@')
  expect(data.telephone).toMatch(/^\+55/)
  expect(data.serviceType).toEqual(getDictionary('pt-BR').services.items.map((item) => item.title))
})

test('as respostas trazem os cabeçalhos de segurança', async ({ request }) => {
  const headers = (await request.get('/')).headers()
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(headers['x-frame-options']).toBe('DENY')
  expect(headers['content-security-policy']).toContain("frame-ancestors 'none'")
  expect(headers['strict-transport-security']).toContain('max-age=')
  expect(headers['permissions-policy']).toContain('camera=()')
})

test('a página 404 fala o idioma do visitante e leva de volta ao início', async ({ page }) => {
  const response = await page.goto('/nao-existe')
  expect(response!.status()).toBe(404)
  const dict = getDictionary('pt-BR').notFound
  await expect(page.getByRole('heading', { level: 1 })).toContainText(dict.title)
  await expect(page.getByRole('link', { name: dict.cta })).toHaveAttribute('href', '/')
  await expect(page.locator('.site-header')).toBeVisible()

  await openInLocale(page, 'es', '/nao-existe')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    getDictionary('es').notFound.title,
  )
})
