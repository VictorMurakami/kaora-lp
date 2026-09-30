import { cookies, headers } from 'next/headers'
import { LOCALE_COOKIE, resolveLocale } from './negotiate'

/** Locale for the first render, so the page arrives already in the right language. */
export async function getRequestLocale() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()])
  return resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value, headerStore.get('accept-language'))
}
