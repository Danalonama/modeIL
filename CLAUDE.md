# ModeIL — Israeli Fashion Index

Handoff for Claude Code. Read this first, then `index.html`.

Live at `mode-il.com`, deployed on Vercel from this folder. The site is plain static HTML with no build step and no framework. Tailwind comes from the CDN; the data is inline JS.

---

## What it is

A hand-curated, free, independent directory of Israeli fashion designers, plus the boutiques that stock them and a map of physical stores. It's a discovery tool, not a store.

The founding user: someone abroad who wants to buy from Israeli designers but has no single place to browse them. Every decision should help her find, trust and reach a designer.

## Files

- `index.html` is the main product (~4,500 lines): the designer grid, filters, search, A–Z bar, favorites, the EN/HE toggle, and **all brand data inline** (~343 entries).
- `Map.html` is a Leaflet map of physical stores with an Esri basemap. It has **its own copy of store data** (~138 entries with lat/lng, addresses, phone and hours).
- `Boutiques.html` lists multi-brand stores (~26). These are deliberately kept separate from designers.
- `About.html`, `Contact.html` and `Affiliate.html` are static pages. Affiliate is the disclosure page.
- `images/` holds a few locally hosted brand images. Where a brand's own image was unusable, the entry points here (e.g. `images/vil-unfold.png`).
- `sitemap.xml`, `robots.txt`, `site.webmanifest` and the favicons are SEO/PWA files. The favicon is a plain black square, on purpose.
- `vercel.json` sets long-cache headers for image and font files only.
- `process-writeup.md` holds marketing and case-study copy. It isn't code.
- `docs/PROJECT-NOTES.md` is the longer project history: design decisions, editorial rules and open threads.
- `docs/data/` has older CSV/TSV exports of the brand list. They're snapshots and may be stale; the array in `index.html` is the source of truth.
- `docs/archive/index-squares.html` is an abandoned uniform-square grid layout, kept only for reference. Don't deploy it.

## Brand data model (`index.html`)

```js
{
  name: "Brand Name",
  url: "https://…",
  tags: ["minimalist", "jewelry"],          // machine keys used for filtering
  tagLabels: ["Minimalist", "Jewelry"],     // display strings, same order
  desc: "Short card text, in the brand's own voice.",
  descFull: "Longer bio, optional.",
  instagram: "handle",                      // optional, no @
  address: "Street, City",                  // optional; presence = physical store
  img: "https://brand-cdn/…",               // hotlinked from the brand's own site
  fav: false
}
```

New brands are appended just before the closing `];` of the array.

There are two taxonomy axes, used together in filtering:
- **Style:** Minimalist, Edgy, Conceptual, Contemporary, Legacy, Luxury, Artisan, Casual, Streetwear, Festival, Modest…
- **Type:** Jewelry, Swimwear, Men, Bridal, Footwear, Knitwear, Lingerie, Accessories, Activewear, Denim, Surf…
- **Values/other:** Sustainable, Handmade, Made in Israel, Natural Fabrics, Natural Stones, Prints, Size Inclusive, Unisex, Ready-to-Wear.

## ⚠️ Known technical debt (fix these first)

1. **Data is duplicated in three places.** Each brand appears in the JS array, in a JSON-LD `@type: Brand` block in `index.html` (for SEO), and in `Map.html` if it has a store. These have drifted: there are 338 cards but only ~292 JSON-LD entries, and image changes had to be applied to all three by hand. **Suggested fix:** move everything into one `brands.json`, then have `index.html` render from it, `Map.html` filter it by `address`/`lat`, and a small build script generate the JSON-LD and `sitemap.xml`.
2. **The Hebrew translation calls `window.claude.complete`.** That API only exists in the design tool this was built in. **On the live site it doesn't exist**, so Hebrew descriptions fall back to English. The HE UI chrome still flips to RTL. Fix it by pre-translating descriptions once into a `descHe` field, or by adding a serverless route (Vercel function) that calls a translation/LLM API and caches the result. Pre-translation is simpler and free at runtime.
3. **Tailwind loads from the play CDN** (`cdn.tailwindcss.com`), which isn't meant for production. Compile it to a static CSS file.
4. **Hotlinked images rot.** When a brand redesigns its site, its image URL dies. The card then falls back to the brand name on a colored block, so it never shows as broken, but a periodic link checker would help. Known upcoming rot: **Two Tone's** image is hosted on `razili.co.il`, which closes on 1 Oct 2026.
5. Before this handoff, a separate `git-export/` copy was maintained by hand alongside the working files. In a real repo this folder **is** the source, so drop that habit.

## Features and behavior

- **Masonry grid** that still reads **alphabetically left-to-right**. Cards are dealt into JS-computed columns in row order; CSS columns aren't used because they read top-to-bottom. Columns are recalculated on resize.
- **Image fallback:** if an image fails to load, the card shows the brand name set on a colored thumbnail.
- **Layered filters:** Style panel, Type panel, Area bar and A–Z bar, all combinable. Active filters show as removable chips with a Clear All button. There's a live result count and an explicit empty state.
- **Search:** tokenized over name, description and tags, plus `smartConceptMatch`, which maps concepts like "bridal", "swim" and "gold" onto brands that don't contain the literal word. It sits behind a nav toggle on desktop and inside the mobile menu.
- **Favorites:** a heart on each card, stored in `localStorage` under `modeil-favs`. There are no accounts, on purpose.
- **EN/HE toggle:** switches to RTL and Noto Sans Hebrew. Translations are cached in `localStorage` under `descHeCache` (see debt #2).
- **Affiliate:** Skimlinks script (`s.skimresources.com/…304374X1792544`) plus `withUtm()` on outbound links. The rule: affiliate status **never** affects who gets listed or how they're described. Revenue only covers hosting.

## Design system

- Off-white ground `#F4F4F4`, near-black ink `#1A1A18`, hard corners, no shadows, generous whitespace. It's editorial and type-led, so the clothes carry the page.
- One typeface: **Plus Jakarta Sans**, used across many weights. Black weight with tight tracking for the wordmark and headlines; small caps with wide tracking for labels and nav. **Noto Sans Hebrew** for RTL.
- Wordmark: `MODE-IL` with a small tracked-out "Israeli Fashion Index" beside it.
- Avoid: gradients, rounded cards, badges, icon sets, emoji, and anything that looks like a startup landing page.

## Editorial rules (these are the product)

- **Designer vs. boutique is a hard line.** A brand selling its own label goes in `index.html`; a store carrying other labels goes in `Boutiques.html`.
- **Must be Israeli** (founded or based in Israel). Israeli designers based abroad (Nili Lotan, Yigal Azrouël, Elie Tahari) are an open question and are currently excluded.
- **Must be active.** Password-gated, dormant or closed stores are removed. For example, Belov was removed because its store sat behind a password page.
- **Curation beats completeness.** Brands have been removed as editorial calls (Vanzen, Mikusha-Mela, Berni). Gideon Oberson was removed as a duplicate because his brand is Gottex, which is already listed.
- **Descriptions use the brand's own voice** from its about page, not a house template. Verify tags, Instagram handle and live status against the brand's own site.
- **Image rules:** show what's typical of the brand, not generic; prefer local shoots; pick the interesting look over the conventional one; nothing over-sexualized; no cropped faces; prefer real photos over AI-generated ones. Two current images appear to be AI-generated and are flagged for replacement: OZ Capsule and Holy Land Civilians.
- Bridal, footwear, jewelry and swimwear are in scope.

## Routine tasks (most common first)

1. **Swap a brand image:** replace the old URL everywhere it appears (card, JSON-LD, Map).
2. **Add a brand:** research the site, append the entry, add JSON-LD, and add a map pin if there's a store.
3. **Remove a brand:** delete it from the array, JSON-LD, Map and any name lists.

## Open / planned

- **Sales feature, scoped but not built.**
  - Phase 1: add a `sale: { text, until }` field, a SALE badge on the card, an "On Sale" filter, and auto-hiding after `until`.
  - Phase 2: a dedicated Sales page sorted by soonest end date.
  - Phase 3: auto-detection via a daily Vercel Cron or GitHub Action reading Shopify `/products.json` (`price` vs `compare_at_price`), which covers roughly 60–70% of brands, plus the WooCommerce equivalent. Results go to `sales.json`. Manual entries always override automatic ones, and a failed check must never blank the page.
- **Suzi Porat** (`suziporat.com`) was requested but not added yet.
- **Growth ideas:** tell listed designers they're on ModeIL, an embeddable "As listed on ModeIL" badge (also earns backlinks), an Instagram account posting one designer a day, Product Hunt, Israeli design markets, and diaspora/Jewish-interest media.

## Principles

- Structure before scale: keep the schema clean so filters, search and the map stay simple.
- Editorial independence is non-negotiable.
- The care is the product: one hand-picked image and one honest description per brand.
- Free, and staying free.
