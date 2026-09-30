**Live site:** https://svitlanatsupryk-jul18.github.io/byteex-product-page/

# Byteex Product Page

Responsive product landing page built from the Byteex Figma mockup.
All page content comes from **Contentful** (headless CMS).

**Stack:** Vite · React 19 · TypeScript (strict) · Tailwind CSS v4 · Contentful

## For reviewers

A short guide to the parts worth checking, mapped to the evaluation criteria.

| Criterion                     | Where to look                                                                                                                                                                                                               |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accuracy to the design        | Live site at 1465px (desktop mockup) and 428px (mobile mockup). Differences are listed in [Known gaps](#known-gaps).                                                                                                        |
| Headless CMS, dynamic content | Every text, image and the order of sections come from Contentful. The content model is code in `scripts/contentful/model.ts`.                                                                                               |
| Code quality                  | Data flows one way: `lib/contentful` (fetch, link resolution, mapping) → domain types in `types/content.ts` → components. Components never see raw CMS data.                                                                |
| Responsiveness and browsers   | Fluid layout from 320px up. Checked in Chrome, Safari (WebKit) and Firefox.                                                                                                                                                 |
| Performance                   | Page is prerendered at build time. Lighthouse mobile: 96 performance, 100 accessibility, 100 best practices, 100 SEO. Desktop: 100 in all four.                                                                             |
| Git                           | Conventional Commits, one step per commit. Feature work goes through a branch and a pull request, see [PR #1](https://github.com/SvitlanaTsupryk-jul18/byteex-product-page/pull/1). CI runs on every push and pull request. |

**Running it locally:** the fastest way is `npm install && npm run dev`. Without
Contentful credentials the page renders the bundled seed texts with empty image
placeholders, because all photos live in Contentful. The read-only credentials
for the live space are in the submission email; put them into `.env` to see
the full page. Editor access to the Contentful space is available on request.

**Main files to read:**

- `src/lib/contentful/` — Delivery API client, link resolution, typed mappers
- `src/components/sections/` — one component per page section, rendered by `SectionRenderer`
- `src/components/ui/` — carousel (CSS scroll-snap), accordion (WAI-ARIA), marquee, responsive image
- `scripts/vite/contentful-html.ts` and `scripts/prerender.mjs` — build-time content snapshot and prerendering

## Quick start

```bash
npm install
npm run dev
```

Without Contentful credentials the app runs on bundled seed content
(`src/content/landingPage.ts`) and logs a notice in the console.
Add credentials (below) to read the live content from Contentful.

## Contentful setup

1. Create a free Contentful space.
2. Copy `.env.example` to `.env` and fill in:
   - `VITE_CONTENTFUL_SPACE_ID`
   - `VITE_CONTENTFUL_ACCESS_TOKEN`: Content Delivery API token (read-only, safe for the browser)
   - `CONTENTFUL_MANAGEMENT_TOKEN`: CMA token, used only by the Node scripts
3. Create the content model and publish initial content:

```bash
npm run cms:setup   # creates/updates content types from scripts/contentful/model.ts
npm run cms:seed    # creates/updates and publishes entries and images
npm run cms:seed -- --replace-images      # also re-upload images that already exist
npm run cms:seed -- --replace-images=ugc  # only images whose id starts with "ugc"
```

Both scripts are idempotent and can be re-run safely.

**Images for seeding:** put files into `scripts/contentful/images/`, named after
the image `id` in `src/content/landingPage.ts` (e.g. `hero.png`, `ugc-12.jpg`).
Missing files are skipped, and images can also be uploaded later in the Contentful UI.

### Content model

The model lives in code (`scripts/contentful/model.ts`), so it is versioned with the app.

| Content type                                                                                                                      | Purpose                                                      |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `landingPage`                                                                                                                     | SEO, announcement bar, rating text, ordered list of sections |
| `heroSection`, `benefitsSection`, `founderSection`, `stepsSection`, `reviewsSection`, `faqSection`, `impactSection`, `ctaSection` | One type per page section                                    |
| `feature`                                                                                                                         | Icon + title + text (benefits, steps, stats, perks)          |
| `testimonial`                                                                                                                     | Customer review                                              |
| `faqItem`                                                                                                                         | Question + answer                                            |
| `product`                                                                                                                         | Product name + gallery images                                |

Editors can reorder, add or remove sections in Contentful without code changes.

## Scripts

| Command             | Description                           |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Start dev server                      |
| `npm run build`     | Type-check and build for production   |
| `npm run preview`   | Serve the production build            |
| `npm run lint`      | Lint with oxlint                      |
| `npm run typecheck` | Type-check only                       |
| `npm run format`    | Format with Prettier                  |
| `npm test`          | Run unit tests (Vitest)               |
| `npm run cms:setup` | Apply the content model to Contentful |
| `npm run cms:seed`  | Seed Contentful with initial content  |

## Project structure

```
scripts/contentful/   Content model, setup and seed scripts (Node)
src/
  components/
    sections/         Page sections + SectionRenderer
    ui/               Reusable primitives (image, carousel, accordion, ...)
  content/            Seed / fallback content
  hooks/              useLandingPage (loading, error, retry)
  lib/
    contentful/       Fetch client, link resolution, typed skeletons, mappers
    content.ts        Content source switch (Contentful or local) + request cache
    image.ts          Contentful Images API helpers
  types/content.ts    Domain types used by all components
```

Components depend only on domain types. Contentful responses are mapped in
`lib/contentful/mappers.ts`, so the UI does not know about the CMS.

## Performance

- The build fetches the page from Contentful once, embeds the response in `index.html`
  and prerenders the markup. The browser shows content before any JavaScript runs,
  then React hydrates it and refetches content in the background, so CMS edits
  appear without a rebuild.
- Whole page is fetched in **one** Delivery API request (`include: 4`) by a small
  `fetch` client instead of the Contentful SDK (JS bundle 87 kB gzip instead of 132 kB).
  The token is sent as a query parameter, so there is no CORS preflight.
- Images use the Contentful Images API: WebP, responsive `srcset`/`sizes`,
  explicit `width`/`height` against layout shift, lazy loading below the fold,
  `fetchpriority="high"` for the hero image.
- `preconnect` to Contentful hosts, self-hosted variable fonts (no Google Fonts request).
- Logo and icons are inline SVG, so they need no extra requests.
- Carousel is native CSS scroll-snap, with no slider library.
- Fallback content is code-split and never loaded when Contentful is configured.

## Testing

`npm test` runs unit tests for Contentful link resolution, the entry mappers
and the image URL helpers. GitHub Actions (`.github/workflows/ci.yml`) runs
format check, lint, type check, tests and build on every push.

Checked manually in Chrome, Safari (WebKit) and Firefox at 390px and 1465px:
same layout in all three, no horizontal overflow, no console errors.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes `dist` on every push to `main`.

1. In the repository settings, open **Pages** and set the source to **GitHub Actions**.
2. Under **Secrets and variables → Actions**, add:
   - variable `VITE_CONTENTFUL_SPACE_ID`
   - variable `VITE_CONTENTFUL_ENVIRONMENT` (optional, defaults to `master`)
   - secret `VITE_CONTENTFUL_ACCESS_TOKEN` (the read-only Delivery token)
3. Push to `main` or run the workflow by hand.

The workflow sets `BASE_PATH=/<repo-name>/`, which becomes Vite's `base`.
Content edits in Contentful show up without a redeploy, because the page
refetches content after load. A redeploy only refreshes the prerendered HTML.

## Known gaps

- **Fonts:** the mockup uses Sofia Pro and Suisse Int'l, which are commercial.
  Jost and Inter are used as free look-alikes, so some line breaks differ slightly.
- **Deliberate changes from the mockup:** customer photos run as two endless rows moving in
  opposite directions (paused on hover, static with reduced motion), and the closing
  section uses the CTA with star rating on all screens.

## SEO

- Title and description come from the Landing page entry in Contentful.
- Open Graph and Twitter tags give link previews a 1200 x 630 JPEG cropped from the hero photo.
- JSON-LD describes the organization, website and page. It has no Product with
  ratings, because Google requires real price and review data the CMS does not hold.
- `VITE_SITE_URL` enables `canonical` and `og:url`. The deploy workflow sets it automatically.
- All tags are prerendered into the static HTML, so crawlers that skip JavaScript still see them.

## Accessibility

Semantic landmarks and headings, WAI-ARIA accordion and carousel patterns,
labelled icon buttons, visible focus styles and `prefers-reduced-motion` support.

## Git workflow

- `main` keeps a linear history with no merge commits.
- Each commit is a small, self-contained step of the development process.
- Features go through a branch and a pull request, merged with "Rebase and merge"
  after CI passes. The first one is [PR #1](https://github.com/SvitlanaTsupryk-jul18/byteex-product-page/pull/1).

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
