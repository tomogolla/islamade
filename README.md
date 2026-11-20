# Islamade storefront

Islamade is a SvelteKit 3 storefront for a handmade crochet studio in Nairobi. The application uses Svelte 5, TypeScript, standard CSS and the official Cloudflare adapter.

## Development

Use Node 22.17 or newer.

```bash
npm install
npm run catalog
npm run dev
```

Useful commands:

```bash
npm run check     # Svelte and TypeScript validation
npm test          # catalogue and legacy-route tests
npm run build     # production Cloudflare build
npm run preview   # build and run the Worker locally
npm run cf:types  # regenerate Cloudflare binding types after binding changes
npm run deploy    # build and deploy after production review
```

## Architecture

- `src/routes/` contains the homepage, shop, collections, collection detail, custom-order and about routes.
- `src/lib/components/` contains the shared header, footer, cards, grids and accessible product quick view.
- `src/lib/data/catalog.ts` imports the generated JSON once into the server/client bundle and provides typed catalogue helpers.
- `src/lib/data/config.ts` is the single place for contact details, social URLs, currency and the production origin.
- `src/lib/styles/` contains brand tokens and the shared editorial storefront design system.
- `src/hooks.server.ts` redirects old HTML URLs to their SvelteKit equivalents.
- `assets/` remains the SvelteKit static asset directory, configured in `vite.config.ts`; image naming conventions do not change.

## Catalogue workflow

`data/isla_s_catalouge.xlsx` remains the source of truth. Do not edit `data/products.json` or `data/collections.json` by hand.

After editing the spreadsheet, collection copy or product images:

```bash
npm run catalog
```

The generator still reads `tools/collection-copy.json`, matches product and collection images, hides empty collections, validates status values, reports unmatched/large images and writes the two JSON files. `tools/package.json` keeps this established CommonJS generator compatible with the app's ESM package.

## Product behavior

- Status values are `available`, `made to order` and `sold out`.
- A stock quantity of `0` always counts as sold out.
- Stock quantities from `1` to `3` show a low-stock message.
- Multiple matched images appear in the quick-view gallery.
- Orders and sold-out enquiries open WhatsApp with product, price and collection context.
- Custom requests are validated in the browser and open WhatsApp or email; the site stores no form data.

## Legacy URLs

The Worker returns permanent redirects for:

| Previous URL | New route |
| --- | --- |
| `/index.html` | `/` |
| `/pages/shop.html` | `/shop` |
| `/pages/collections.html` | `/collections` |
| `/pages/collection.html?c=<slug>` | `/collections/<slug>` |
| `/pages/custom.html` | `/custom` |
| `/pages/about.html` | `/about` |

Shop query parameters are preserved.

## Cloudflare Workers

The project follows Cloudflare's SvelteKit 3 Workers configuration:

- Adapter: `@sveltejs/adapter-cloudflare` 8
- Worker entry point: `.svelte-kit/cloudflare/_worker.js`
- Static assets: `.svelte-kit/cloudflare`
- Wrangler build command: `npm run build` (generates `_worker.js` before deploy)
- Compatibility date: `2026-11-19`
- Workers Logs and traces are enabled in `wrangler.jsonc`

For the existing GitHub-connected Cloudflare Workers project, set:

- Build command: leave blank (Wrangler runs the configured build command)
- Deploy command: `npm run deploy` or `npx wrangler deploy`
- Root directory: repository root
- Node version: 22.17 or newer

No paid service, database, secret or binding is required. Do not run the deploy command until the production project settings and domain in `src/lib/data/config.ts` have been reviewed.

## Content verification

The previous homepage contained testimonial and journal-style marketing copy without a verified content source. The migrated homepage keeps those sections in the visual rhythm but labels them as forthcoming instead of publishing unverified claims. Replace those placeholders only with approved customer or studio content.
