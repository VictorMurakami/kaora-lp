import type { Page } from '@playwright/test'
import type { Locale } from '@/i18n/config'
import { LOCALE_COOKIE } from '@/i18n/negotiate'

/** Opens the landing with a saved language choice, as a returning visitor would. */
export async function openInLocale(page: Page, locale: Locale, path = '/') {
  await page
    .context()
    .addCookies([{ name: LOCALE_COOKIE, value: locale, url: 'http://localhost:3000' }])
  await page.goto(path)
}
