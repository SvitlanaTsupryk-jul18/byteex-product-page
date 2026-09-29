# Byteex Product Page

Responsive product landing page built from the Byteex Figma mockup.
All page content comes from **Contentful** (headless CMS).

**Stack:** Vite · React 19 · TypeScript (strict) · Tailwind CSS v4 · Contentful

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
```

Both scripts are idempotent and can be re-run safely.

**Images for seeding:** put files into `scripts/contentful/images/`, named after
the image `id` in `src/content/landingPage.ts` (e.g. `hero-1.jpg`, `ugc-12.webp`).
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
    contentful/       Delivery client, typed skeletons, mappers
    content.ts        Content source switch (Contentful or local) + request cache
    image.ts          Contentful Images API helpers
  types/content.ts    Domain types used by all components
```

Components depend only on domain types. Contentful responses are mapped in
`lib/contentful/mappers.ts`, so the UI does not know about the CMS.

## Performance

- Whole page is fetched in **one** Delivery API request (`include: 4`).
- Images use the Contentful Images API: WebP, responsive `srcset`/`sizes`,
  explicit `width`/`height` against layout shift, lazy loading below the fold,
  `fetchpriority="high"` for the hero image.
- `preconnect` to Contentful hosts, self-hosted variable font (no Google Fonts request).
- Carousel is native CSS scroll-snap, with no slider library.
- Fallback content is code-split and never loaded when Contentful is configured.

## Accessibility

Semantic landmarks and headings, WAI-ARIA accordion and carousel patterns,
labelled icon buttons, visible focus styles and `prefers-reduced-motion` support.

## Git workflow

- `main`: stable, release-ready code
- `develop`: integration branch
- `feat/*`, `chore/*`, `docs/*`: short-lived branches merged into `develop` with `--no-ff`

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
