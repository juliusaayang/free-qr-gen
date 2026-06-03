# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server (also: yarn dev / next)
pnpm build        # next build
pnpm type-check   # tsc — run before committing
pnpm test         # jest (all tests)
pnpm test -- --testPathPattern=<file>  # single test file
```

> `pnpm-lock.yaml` is present — use `pnpm` for installs despite README mentioning yarn.

---

## Architecture

Next.js 15 marketing website (Pages Router) for Myaza, a cross-border money transfer app. Deployed to Vercel with `output: "standalone"`.

### Directory layout

```
src/pages/          — routes (Next.js Pages Router)
components/         — UI components, grouped by page/domain
  global/           — shared across all pages (Button, Icons, CTAWithMockup, JoinUs, AnsweredQuestions)
  layouts/          — Navigation, MobileNavigation, Footer, NavigationLink
  home/ about/ blog/ FAQ/ products/ terms/
layouts/MainLayout/ — the one shared page layout (Navigation + <main> + Footer + SEO Head)
data/               — static TypeScript data files (navigation, people, faqData, appLinkData)
hooks/              — custom React hooks
lib/contentful/     — Contentful client + analytics event dispatcher
utilities/          — analytics helpers (customerio.ts; appsflyer.ts is fully commented out)
types/              — TypeScript types, global/ subfolder for shared props
public/assets/      — images (png/jpg) and icons (svg)
```

### Layout system

All pages use the `NextPageWithLayout` pattern from `src/pages/_app.tsx`:

```tsx
// Every page file ends with this block:
PageName.getLayout = function getLayout(page) {
  return <MainLayout title="Myaza | Page Name">{page}</MainLayout>;
};
```

`_app.tsx` calls `Component.getLayout` if present; otherwise renders bare. The `MainLayout` wraps every page with `<Navigation>`, `<main>`, and `<Footer>`, and injects SEO `<Head>` tags.

For blog detail pages that need per-post SEO, pass the ignore flags to suppress defaults:
```tsx
<MainLayout ignoreDefaultTitle ignoreDefaultDescriprion ignoreDefaultImage ignoreDefaultKeywords>
```
(Note the typo in `ignoreDefaultDescriprion` — keep it to match the prop name.)

---

## Component patterns

### Component structure

Components are plain arrow functions (not `React.FC` in most cases) that default-export at the bottom:

```tsx
type Props = {
  title: string;
  isLast?: boolean;
};

const MyComponent = ({ title, isLast }: Props) => {
  return <div>{title}</div>;
};

export default MyComponent;
```

Complex components use local state (`useState`) with no Redux. Redux Toolkit is wired up in `src/store.ts` but the reducer is empty — it is scaffolding and not used.

### Framer Motion animations

Animations use `framer-motion`. The common patterns seen in the codebase:

**Slide-in overlay** (mobile nav):
```tsx
<motion.nav
  initial={{ x: "100%", opacity: 0 }}
  animate={{ x: 0, opacity: 1, transition: { type: "just" } }}
  exit={{ x: 100, opacity: 0, transition: { type: "just", delay: 0.1 } }}>
```

**Fade/slide dropdown**:
```tsx
<motion.div
  initial={{ y: 30, opacity: 0.5 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: 30, opacity: 0, transition: { delay: 0.1 } }}>
```

**Height-reveal** (accordion alternative):
```tsx
<motion.p
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: 90, opacity: 1, transition: { type: "just" } }}
  exit={{ height: 0, opacity: 0, transition: { type: "just" } }}>
```

Always wrap conditional animated elements in `<AnimatePresence initial={false}>`.

### Icons

All SVGs are imported as React components via `@svgr/webpack`. They live in `public/assets/icons/` and are re-exported through the barrel file `components/global/Icons/index.tsx`. Always import icons from there:

```tsx
import { ArrowDown, LogoIcon, MenuIcon } from "@/components/global/Icons";
```

To add a new icon: add the `.svg` to `public/assets/icons/`, then add it to the barrel export.

Inline style overrides are used to tint SVG fill/stroke:
```tsx
<AppleIcon style={{ fill: "white" }} />
<WebIcon style={{ stroke: "#2A0079" }} />
```

### Button component

`components/global/Button/index.tsx` handles buttons, links, and external anchors in one component. Key usage patterns:

```tsx
// Standard button
<Button size="sm" className="...">Label</Button>

// External link (renders as <Link> with target="_blank")
<Button tag="a" href="https://..." isExternal underline={false} size="sm" theme="plain" className="...">
  Label
</Button>

// Internal link
<Button tag="a" href="/about" underline={false}>About</Button>
```

`theme` options: `"primary"` (default), `"secondary"`, `"plain"`, `"outline"`, `"distorted"`.  
`size` options: `"sm"`, `"md"`, `"lg"`, `"xl"`.

For app store/web app links, wrap in `<Link href={...} target="_blank">` and use `theme="plain"` with custom className.

### Page section composition

Every page follows the same closing sequence of shared sections:

```tsx
<JoinUs />
<AnsweredQuestions faqs={faqs} />
<CTAWithMockup />
```

`JoinUs` — "Get started in 3 easy steps" section.  
`AnsweredQuestions` — FAQ accordion, receives `faqs` from Contentful.  
`CTAWithMockup` — App download CTA with phone mockup image.

These are used on every page without modification; do not inline or replace them.

---

## Data patterns

### Static data files (`data/`)

Pure TypeScript files that export typed arrays. Used for navigation structure, team members, FAQ content:

```tsx
// data/people.tsx
type People = { name: string; position: string; photo: string; };
export const people: People[] = [...];
```

FAQ answers in `data/faqData.tsx` are JSX elements (inline `<p>` with `<Button>` children) — this file uses `.tsx` specifically because of that.

### Contentful dynamic data

All CMS content is fetched in `getStaticProps` via `lib/contentful/client.ts`. The client reads `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` from env.

Standard `getStaticProps` pattern (used on every page):
```ts
export const getStaticProps = async () => {
  const response = await client.getEntries({ content_type: "faq" });
  return {
    props: { faqs: response.items, revalidate: 60 },
  };
};
```

For dynamic routes with `getStaticPaths`:
```ts
export const getStaticPaths: GetStaticPaths = async () => {
  const blog = await client.getEntries({ content_type: "blog", limit: 300 });
  const paths = blog.items.map((item: BlogPostType) => ({
    params: { id: item.fields.slug },
  }));
  return { paths, fallback: false };
};
```

Use `Promise.all` when fetching multiple content types in a single `getStaticProps`.

### ISR revalidation

`src/pages/api/revalidate.ts` is a webhook endpoint called by Contentful on publish. It reads `CONTENTFUL_REVALIDATE_SECRET` from the `x-vercel-reval-key` header and revalidates all paths via `res.revalidate()`. When adding a new page, add its path to the array in that handler.

---

## Styling

### Tailwind conventions

- Use `container` class for max-width centering with responsive padding (configured in `tailwind.config.js`).
- Custom breakpoint `xs: 400px` sits below the default `sm`.
- Responsive prefix order: mobile-first — base, then `xs:`, `sm:`, `lg:`, `xl:`.
- Section spacing pattern: `mt-8 lg:mt-14` (mobile/desktop), `mb-8` or `mb-12 lg:mb-16`.

**Design tokens** (always use these, never raw hex in className):
- Primary purple: `primary` (#5645F5), hover: `pc-08`
- Dark brand purple: `tc-main` (#2A0079)
- Secondary text: `tc-secondary` / `tc-05`
- Muted text: `tc-03`, `tc-04`
- Primary scale: `pc-01` (lightest) → `pc-11` (darkest)
- Secondary scale: `sc-01` → `sc-11`

**Font classes**:
- `font-SpaceGrotesk` — headings and UI labels
- `font-Karla` — body text

### Background images / custom CSS

Some sections use custom CSS class names for background images (`hero-bg`, `CTA-bg`, `navigation-bg`, `blog-bg`, `faqs-bg`, `product-slide-bg`). These are defined in `src/styles/globals.scss`.

### next/image

Always use `next/image` for images. Remote images from `images.ctfassets.net` are whitelisted in `next.config.js`. Contentful image URLs come without protocol — prepend `"https:"`:

```tsx
src={"https:" + image?.fields?.file?.url}
```

---

## Hooks

`hooks/useActiveLink.tsx` — returns a boolean for whether the current route matches an href. Used by `NavigationLink` to highlight active nav items.

`hooks/useIntersectionObserver.tsx` — wraps the native `IntersectionObserver` API. Accepts a `freezeOnceVisible` option to stop observing after first intersection.

---

## Analytics

`lib/contentful/event-dispatcher.ts` exports a single `sendAnalytics()` function that fans out to Mixpanel, Amplitude, and Customer.io. Always call this instead of calling individual SDKs directly.

```ts
sendAnalytics({ action: "track", payload: { eventName: "button_clicked", data: { label: "signup" } } });
```

Supported actions: `"init"`, `"track"`, `"identify"`, `"people.set"`, `"people.set_once"`, `"register_once"`, `"reset"`, `"disable"`.

Analytics are automatically disabled on non-production environments — this is handled in `_app.tsx` via `NEXT_PUBLIC_ENVIRONMENT`.

AppsFlyer integration exists in `utilities/appsflyer.ts` but is entirely commented out.

---

## Path aliases

```
@/components/*  →  components/*
@/types/*       →  types/*
@/helpers/*     →  utilities/*
@/layouts/*     →  layouts/*
@/data/*        →  data/*
@/src/*         →  src/*
```

`lib/` and `hooks/` are NOT aliased — import them by their bare paths (`lib/contentful/client`, `hooks/useActiveLink`).

---

## Testing

Tests use Jest + `ts-jest` in a `jsdom` environment. `setupTests.ts` runs before each suite — it imports `@testing-library/jest-dom` and loads `.env` via `@next/env`.

There are currently **no test files** in the project — only the infrastructure. New tests go alongside their source file or in a `__tests__/` subfolder. Use `@testing-library/react` for component tests.

`tsconfig.test.json` extends the main tsconfig with `"jsx": "react-jsx"` — this is required because the main tsconfig uses `"jsx": "preserve"` which Jest can't process.

---

## Environment variables

| Variable | Purpose |
|---|---|
| `CONTENTFUL_SPACE_ID` | Contentful space ID |
| `CONTENTFUL_ACCESS_TOKEN` | Contentful delivery API token |
| `CONTENTFUL_REVALIDATE_SECRET` | Secret for the ISR webhook endpoint |
| `NEXT_PUBLIC_ENVIRONMENT` | Set to `"production"` to enable analytics |
| `NEXT_PUBLIC_MIXPANEL_TOKEN` | Mixpanel project token |
| `NEXT_PUBLIC_AMPLITUDE_API_KEY` | Amplitude API key |
| `NEXT_PUBLIC_CUSTOMERIO_SITE_ID` | Customer.io site ID |
| `NEXT_PUBLIC_APP_URL` | Base URL of the Myaza web app (used for auth links) |

---

## Adding a new page

1. Create `src/pages/<route>/index.tsx` following the page template:
   - Declare the page component as `const PageName: NextPageWithLayout = ({ faqs }: FAQ) => ...`
   - Attach `getLayout` at the bottom
   - Add `getStaticProps` fetching FAQs at minimum
   - End with `JoinUs`, `AnsweredQuestions`, `CTAWithMockup`
2. Add `getStaticProps` revalidation path to `src/pages/api/revalidate.ts`
3. If it's a nav link, add it to `data/navigation.tsx`
