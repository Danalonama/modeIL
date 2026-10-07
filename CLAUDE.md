# ModeIL — Israeli Fashion Index

Handoff for Claude Code. Read this first, then `index.html`.

Live at `mode-il.com`, deployed on Vercel from this folder. The site is plain static HTML with no build step and no framework. Tailwind comes from the CDN; the data is inline JS.

---

## Before you start any task: check the task board

Several Claude sessions work on ModeIL at the same time. To stop them repeating each other's work, the shared task board is **https://claude.ai/artifact/T7NF4xGwEbYHRsSQeyQA35** (read and write it with the `ArtifactData` tool, collection `tasks`).

1. Before starting, read the board and run `gh pr list`. If the task is already `doing` under another session, or already in an open or merged PR, leave it and tell Dana.
2. When you start, set the task's `status` to `doing` and `session` to your session's title. If it isn't on the board, add it.
3. When you open a PR, set `pr`. When it merges, set `status` to `done`.
4. New open items or questions for Dana go on the board, not only in chat.

Work in your own git worktree under `.claude/worktrees/`, never in the main folder: the checkout and the git stash are shared.

## What it is

A hand-curated, free, independent directory of Israeli fashion designers, plus the boutiques that stock them and a map of physical stores. It's a discovery tool, not a store.

The founding user: someone abroad who wants to buy from Israeli designers but has no single place to browse them. Every decision should help her find, trust and reach a designer.

## Files

- `index.html` is the main product (~4,500 lines): the designer grid, filters, search, A–Z bar, favorites, the EN/HE toggle, and **all brand data inline** (371 entries as of 6 Oct 2026). The same page is also the **Bridal page**: at `/bridal` (a Vercel rewrite in `vercel.json`; locally `index.html?view=bridal`) it shows only bridal-tagged designers, with its own heading and title.
- `Map.html` is a Leaflet map of physical stores with an Esri basemap. It has **its own copy of store data** (about 180 pins with lat/lng, addresses, phone and hours).
- `Boutiques.html` lists multi-brand stores (~26). These are deliberately kept separate from designers.
- `About.html`, `Contact.html` and `Accessibility.html` are static pages. Accessibility is the accessibility statement (English and Hebrew). Update its "Last updated" date and known limitations when accessibility changes.
- `images/` holds a few locally hosted brand images. Where a brand's own image was unusable, the entry points here (e.g. `images/vil-unfold.jpg`).
- `sitemap.xml`, `robots.txt`, `site.webmanifest` and the favicons are SEO/PWA files. The favicon is a plain black square, on purpose.
- `a11y.css` and `a11y.js` are the shared accessibility helpers loaded by every page (see Accessibility below).
- `vercel.json` sets long-cache headers for image and font files only.
- `process-writeup.md` holds marketing and case-study copy. It isn't code.
- `docs/PROJECT-NOTES.md` is the longer project history: design decisions, editorial rules and open threads.
- `docs/data/` has older CSV/TSV exports of the brand list. They're snapshots and may be stale; the array in `index.html` is the source of truth.
- `docs/archive/index-squares.html` is an abandoned uniform-square grid layout, kept only for reference. Don't deploy it.
- `scripts/` holds small Node scripts with no dependencies (Node 18+). They read the data straight out of the HTML files, so there is still no build step and nothing to install:
  - `node scripts/build-seo.mjs` regenerates the brand-list JSON-LD in `index.html` from the `DESIGNERS` array. Run it after every add, remove, image swap or description edit. `--check` only reports whether it is out of date.
  - `node scripts/build-journal.mjs` builds the Journal: `Journal.html` (list of guides) and `journal/<slug>.html` (one page per guide), plus `sitemap.xml` and `llms.txt`. Posts are defined in `scripts/journal-posts.mjs`: an intro in Dana's voice and a tag rule (`select`) that picks the designers, so each list updates itself. Run it after any brand add, remove, retag, image or description change, and after editing a post. Don't edit the generated files, the sitemap or `llms.txt` by hand.
  - `node scripts/check-links.mjs` checks every brand image and site and writes `docs/reports/link-check.md`.
  - `node scripts/detect-sales.mjs` reads Shopify product feeds and writes `docs/reports/sales-scan.md`. It is a report only; nothing on the site reads it.
- `docs/reports/` is where those scripts write their output.

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
  address: "Street, City",                  // optional, used by only two entries; see the note below
  sale: { text: "Up to 30% off", until: "2026-10-31" },  // optional; see Sales under Features
  bridalOnly: true,                         // optional; bridal houses: shown on /bridal only, not in the main grid
  img: "https://brand-cdn/…",               // hotlinked from the brand's own site
  fav: false
}
```

New brands are appended just before the closing `];` of the array. Each new brand also needs its Hebrew description added to `DESC_HE`, and `node scripts/build-seo.mjs` run afterwards.

Whether a brand counts as having a physical store is **not** decided by `address`. It comes from two lists further down in `index.html`: `MAP_BRANDS` (shows "In person" and the View on Map link) and `STORE_ADDRESSES` (drives the location tag and the Location filter). A brand with a store needs an entry in both, plus its pins in `Map.html`. By-appointment studios also go in `APPOINTMENT_ONLY`.

Filter keys must match the filter buttons exactly: `menswear` (label "Men") and `natural` (labels "Natural Fabrics" / "Natural Stones"). A key with no button, such as `men`, still displays its label but the brand won't show up under the filter.

There are two taxonomy axes, used together in filtering:
- **Style:** Minimalist, Edgy, Conceptual, Contemporary, Legacy, Luxury, Artisan, Casual, Streetwear, Festival, Modest…
- **Type:** Jewelry, Swimwear, Men, Bridal, Footwear, Knitwear, Lingerie, Accessories, Activewear, Denim, Surf…
- **Values/other:** Sustainable, Handmade, Made in Israel, Natural Fabrics, Natural Stones, Prints, Size Inclusive, Unisex, Ready-to-Wear.

## ⚠️ Known technical debt (fix these first)

1. **Data is duplicated in three places.** Each brand appears in the JS array, in a JSON-LD `@type: Brand` block in `index.html` (for SEO), and in `Map.html` if it has a store. The JSON-LD copy is now generated (`node scripts/build-seo.mjs`), so only the array and `Map.html` are kept in sync by hand. Map pins often use a different image from the card, some on purpose (a storefront photo), so check before syncing them. **Suggested full fix, not done yet:** move everything into one `brands.json`, then have `index.html` render from it, `Map.html` filter it by `address`/`lat`, and a small build script generate the JSON-LD and `sitemap.xml`.
2. **Hebrew mode has content but no button.** `DESC_HE` in `index.html` maps each English `desc` string to its Hebrew translation and covers every brand; a missing key falls back to English silently. It is keyed by the exact English text, so editing a `desc` means updating its key too. The EN/HE toggle button itself is no longer in the markup of any page, so visitors can't reach Hebrew mode. `applyLang()` also has stale spots to fix before bringing it back: it maps four nav links where there are now five, and the English strings it restores don't match the current hero title.
3. **Tailwind loads from the play CDN** (`cdn.tailwindcss.com`), which isn't meant for production. Compile it to a static CSS file.
4. **Hotlinked images rot.** When a brand redesigns its site, its image URL dies. The card then falls back to the brand name on a colored block, so it never shows as broken, so run `node scripts/check-links.mjs` every few weeks and work through `docs/reports/link-check.md`. Images hotlinked from Facebook or Google Maps (a few boutiques) carry expiring signatures and will die; prefer a local copy in `images/` for those.
5. Before this handoff, a separate `git-export/` copy was maintained by hand alongside the working files. In a real repo this folder **is** the source, so drop that habit.

## Features and behavior

- **Masonry grid** that still reads **alphabetically left-to-right**. Cards are appended to the grid in alphabetical order and positioned absolutely by `layoutMasonry()` (card *i* goes to column *i % cols*), so the DOM order — and with it keyboard focus and screen-reader order — matches the visual reading order. CSS columns and per-column wrapper divs aren't used because they read top-to-bottom. A `ResizeObserver` re-flows the grid as lazy images load and on resize.
- **Image fallback:** if an image fails to load, the card shows the brand name set on a colored thumbnail.
- **Layered filters:** Style panel, Type panel, Area bar and A–Z bar, all combinable. Active filters show as removable chips with a Clear All button. There's a live result count and an explicit empty state.
- **Search:** tokenized over name, description and tags, plus `smartConceptMatch`, which maps concepts like "bridal", "swim" and "gold" onto brands that don't contain the literal word. It sits behind a nav toggle on desktop and inside the mobile menu.
- **Favorites:** a heart on each card, stored in `localStorage` under `modeil-favs`. There are no accounts, on purpose.
- **EN/HE:** the code switches to RTL and Noto Sans Hebrew and reads descriptions from `DESC_HE`, but the toggle button is currently missing (see debt #2).
- **Sales (manual):** add `sale: { text: "Up to 30% off", until: "2026-10-31" }` to a brand. `until` is the last day of the sale and is required, so nothing stale can linger; `text` is optional and `textHe` is an optional Hebrew version. While the sale runs the card gets a small SALE flag on the image and a line under the tags, and an On Sale filter button appears next to Saved. The day after `until` all of it disappears with no edit. With no running sales the button is hidden and the page looks exactly as before.
- **No affiliate links.** Skimlinks was removed in October 2026: it recognised none of the listed brands as merchants. Outbound links only get `withUtm()` referral tags (`utm_source=modeil`), which earn nothing. With nothing to disclose, the old `Affiliate.html` disclosure page was deleted (Vercel redirects it to the home page). If affiliate links, paid placements or gifted products ever come in, add a disclosure page first. Editorial rule regardless: commercial relationships **never** affect who gets listed or how they're described.

- **Shareable filters:** the address bar mirrors the active filters (`?tags=minimalist,jewelry&area=Tel%20Aviv&letters=a&q=gold`) via `history.replaceState`, and a link with those params opens with them applied. Saved hearts are left out on purpose. Other params such as `view=bridal` and `utm_*` are kept.

## Accessibility

The site targets WCAG 2.1 AA. Keep it that way when editing:

- `a11y.css` and `a11y.js` are loaded by every page. The CSS holds `.sr-only`, the skip link, the focus ring and the reduced-motion rule; the JS is the one mobile-menu implementation (focus trap, Escape, `aria-expanded`), wired by `data-mobile-menu`, `data-mobile-menu-open` and `data-mobile-menu-close` attributes.
- Every page starts with a skip link to `<main id="main">`, has one `<h1>`, and marks the current nav link with `aria-current="page"`.
- Toggle buttons (filters, areas, letters, hearts) carry `aria-pressed`; dropdown triggers carry `aria-expanded`. Update them wherever the visual state is updated.
- Card links and hearts get an `aria-label` that names the brand ("Maskit website (opens in a new tab)"), because "Website" 343 times is useless out of context. The card image link is `aria-hidden` and out of the tab order since it duplicates the Website link; its `alt` is empty for the same reason.
- Icon-font spans (`material-symbols-outlined`) and decorative glyphs (▾ ✕ →) are always `aria-hidden="true"`.
- Text must reach 4.5:1. In practice: no text below ~65% opacity on the light grounds, and the accent rose is `#9C5570` (the older `#B8748A` only reached 3.2:1).
- Map: the search field is a combobox and comes before the map in the DOM; pins are focusable, named, and open with Enter/Space; the side panel takes focus when it opens and returns it on close (Escape works).

## Design system

- Off-white ground `#F4F4F4`, near-black ink `#1A1A18`, hard corners, no shadows, generous whitespace. It's editorial and type-led, so the clothes carry the page.
- One typeface: **Plus Jakarta Sans**, used across many weights. Black weight with tight tracking for the wordmark and headlines; small caps with wide tracking for labels and nav. **Noto Sans Hebrew** for RTL.
- Wordmark: `MODE-IL` with a small tracked-out "Israeli Fashion Index" beside it.
- Avoid: gradients, rounded cards, badges, icon sets, emoji, and anything that looks like a startup landing page.

## Editorial rules (these are the product)

- **Designer vs. boutique is a hard line.** A brand selling its own label goes in `index.html`; a store carrying other labels goes in `Boutiques.html`.
- **Must be Israeli** (founded or based in Israel). Israeli designers based abroad (Nili Lotan, Yigal Azrouël, Elie Tahari) are an open question and are currently excluded.
- **Must be active.** Password-gated, dormant or closed stores are removed. For example, Belov was removed because its store sat behind a password page. Exception: a password page that is a "next drop" countdown or early-access signup (Edit, Nesh) counts as active. If only the website is dead and the brand's Instagram is alive, link the card to Instagram (Salon Berlin, Tami Chomsky). Brands to recheck are listed under Open threads in `docs/PROJECT-NOTES.md`.
- **Curation beats completeness.** Brands have been removed as editorial calls (Vanzen, Mikusha-Mela, Berni). Gideon Oberson was removed as a duplicate because his brand is Gottex, which is already listed.
- **Descriptions use the brand's own voice** from its about page, not a house template. Verify tags, Instagram handle and live status against the brand's own site.
- **Image rules** (the card image does most of the editorial work on the grid). In order of priority:
  1. A person wearing the product. Flat-lay, hanger or white-background shots only if the brand has no on-body photos.
  2. Shot in Israel is better when choices are close (a Tel Aviv street, a beach, a local studio).
  3. Interesting over conventional: diverse or non-classic casting, the striking look over the default model shot.
  4. Typical of the brand, not generic.
  5. Never a cropped face or headless body. If a body is visible, the face must be too. A full back view only if it's the brand's only on-body photo.
  6. No text laid over the photo: no banners, headlines, collection captions, signatures or added logos. Text printed on the clothes is fine.
  7. Nothing over-sexualized or likely to upset.
  8. Real photos over AI-generated ones (filenames like `ChatGPT_Image_*` or `Gemini_Generated_*` are out).
  9. Tie-breakers: pieces genuinely loved; when unsure, the brand's best-sellers.

  Look at each candidate image itself, uncropped, before choosing; text and cropped faces don't show in filenames. Some brands' own sites are full of AI-generated photos (OZ Capsule, Holyland Civilians): pick their real camera files (names like `3B9A1234.jpg` or `IMG_1234.jpg`), not the generated ones.
- Bridal, footwear, jewelry and swimwear are in scope. Bridal has its own page (`/bridal`, Oct 2026). Pure bridal and evening couture houses carry `bridalOnly: true` and appear only there. Brands that also make everyday clothes keep the `bridal` tag without the flag and appear on both pages.

## Routine tasks (most common first)

1. **Swap a brand image:** replace the old URL in the card entry and in `Map.html` if the pin uses the same image, then run `node scripts/build-seo.mjs` and `node scripts/build-journal.mjs`.
2. **Add a brand:** research the site, append the entry, add its `DESC_HE` line, add a map pin plus `MAP_BRANDS` / `STORE_ADDRESSES` entries if there's a store, then run `node scripts/build-seo.mjs` and `node scripts/build-journal.mjs`.
3. **Remove a brand:** delete it from the array, `DESC_HE`, `MAP_BRANDS`, `STORE_ADDRESSES` and `Map.html`, then run `node scripts/build-seo.mjs` and `node scripts/build-journal.mjs`.

## Open / planned

- **Sales feature.** Phase 1 (manual `sale` field, flag, filter, auto-expiry) is built; see Features.
  - Phase 2: a dedicated Sales page sorted by soonest end date.
  - Phase 3: auto-detection via a daily Vercel Cron or GitHub Action reading Shopify `/products.json` (`price` vs `compare_at_price`), plus the WooCommerce equivalent. Results go to `sales.json`. Manual entries always override automatic ones, and a failed check must never blank the page. A first scan (`scripts/detect-sales.mjs`, 1 Oct 2026) could read 210 of 343 brands and found 136 of them with marked-down products, because many stores keep permanent outlet prices. A plain "has markdowns" rule is therefore far too loose; detection needs a strict threshold (most of the catalogue marked down) or a human check before anything shows on the site.
- **Growth ideas:** tell listed designers they're on ModeIL, an embeddable "As listed on ModeIL" badge (also earns backlinks), an Instagram account posting one designer a day, Product Hunt, Israeli design markets, and diaspora/Jewish-interest media.

## Principles

- Structure before scale: keep the schema clean so filters, search and the map stay simple.
- Editorial independence is non-negotiable.
- The care is the product: one hand-picked image and one honest description per brand.
- Free, and staying free.
