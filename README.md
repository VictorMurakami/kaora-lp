# Kaora

A multilingual custom software studio landing page built with Next.js 16, React 19 and TypeScript. The experience combines editorial typography, generative 3D canvas artwork, scroll interactions and a working product demonstration.

## Development

```sh
npm ci
npm run dev
```

Routes:

- `/`: the landing page, in Portuguese, English or Spanish.
- `/design-system`: visual foundations and component reference.
- `/design-system/field`: sculpture laboratory, the hero artwork at study size with its three states explained.

The design system routes are excluded from indexing.

The language is client state, not part of the URL. The first visit follows the browser language; the header switch changes it in place and saves the choice in the `kaora-locale` cookie, which the server reads so later visits render in that language from the first byte. Old `/pt-BR`, `/en` and `/es` links redirect to `/` with that language saved. Contact links use `NEXT_PUBLIC_WHATSAPP_NUMBER` and `NEXT_PUBLIC_CONTACT_EMAIL`, with the existing Kaora contact details as defaults. No form submissions or backend are simulated.

## Search and sharing

`NEXT_PUBLIC_SITE_URL` (default `https://kaorabr.com`) is the base for canonical, Open Graph and sitemap URLs. The root layout declares the title, description, Open Graph and X card per language; `opengraph-image` and `twitter-image` render the 1200×630 preview from the brand symbol and headline with the static Archivo files in `src/assets/fonts`. `robots.ts`, `sitemap.ts` and `manifest.ts` live in `src/app`, and the home page embeds `ProfessionalService` structured data. Set `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` to emit the search console tags. Security headers are defined in `next.config.ts`; the Content-Security-Policy covers framing, plugins and base URLs only, since a script policy needs per-request nonces. Page views come from Cloudflare Web Analytics and custom events (`cta_click`, `whatsapp_click`) go to Cloudflare Zaraz when it is enabled for the zone; `src/lib/analytics.ts` drops them silently otherwise.

## Structure

- `src/content`: typed dictionaries and localized content.
- `src/i18n`: supported locales, language negotiation and the locale provider.
- `src/components/sections`: page sections and the interactive demonstration.
- `src/components/ui`: reusable interface primitives.
- `src/components/effects`: generative artwork, scroll behavior and preserved experiments.
- `src/design-system`: color helpers, motion presets and interaction tokens.
- `src/styles`: semantic tokens and component styles.
- `tests/unit`, `tests/e2e`: logic, interaction, responsive and accessibility checks.

Static sections render on the server. Client boundaries contain navigation state, artwork controls, scroll effects and the product demonstration. Anime.js orchestrates the Kaora symbol in Three.js on a transparent WebGL canvas over a static grid, moving between form, flow and orbit states. The lazily loaded scene combines reflective titanium and copper surfaces with instanced particles and renders only when its state changes. A deterministic SVG fallback preserves the artwork without JavaScript or with reduced motion. Animation is progressively enhanced; essential content and contact links remain available without JavaScript.

## Validation

```sh
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Playwright reuses a running server locally and starts a production build in CI.

## Deployment

The site runs on Cloudflare Workers through the [OpenNext adapter](https://opennext.js.org/cloudflare). `wrangler.jsonc` names the Worker and binds `kaorabr.com` and `www.kaorabr.com` as custom domains; `open-next.config.ts` serves prerendered output from static assets, since nothing revalidates.

```sh
npm run preview   # build for Workers and serve locally on workerd
npm run deploy    # build and deploy (needs wrangler login or an API token)
```

GitHub Actions (`.github/workflows/ci.yml`) runs formatting, lint, type and unit checks and the Playwright suite on every pull request and push. A push to `main` that passes both deploys to production. The workflow needs two repository secrets:

- `CLOUDFLARE_API_TOKEN`: an API token with the _Edit Cloudflare Workers_ template.
- `CLOUDFLARE_ACCOUNT_ID`: the account that holds the `kaorabr.com` zone.

`NEXT_PUBLIC_*` variables are inlined at build time, so set them in the workflow environment if they ever differ from the defaults. Server-only variables such as `GOOGLE_SITE_VERIFICATION` go in the Worker's variables in the Cloudflare dashboard.

## Conventions

Use English identifiers and comments. Keep comments for non-obvious constraints; use Git history for implementation history. Prefer focused components, explicit types and shared semantic tokens. Keep strings in the locale dictionaries and honor reduced motion, keyboard navigation and touch targets.

Commit subjects use Conventional Commits, contain at most seven words and have no body or coauthor trailers. Example: `feat: redesign studio landing experience`.
