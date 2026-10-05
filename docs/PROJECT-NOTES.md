# ModeIL — Project Notes

Working documentation of the site: what it is, how it's built, the decisions behind it, and what's open. Written as a handoff so a new conversation can pick up without re-deriving anything.

Last updated: 13 September 2026

---

## 1. What this is

**ModeIL — Israeli Fashion Index.** A hand-curated directory of Israeli fashion designers and the boutiques that carry them. Free, independent, editorially controlled. Live at `mode-il.com`.

Current scale: **328 brand entries** in `index.html`, plus a separate boutiques list and a store map.

The core job: someone who wants to buy from Israeli designers has no single place to browse them. Every label lives on its own island — a Shopify store, an Instagram, a studio by appointment. ModeIL is the shared home. Discovery engine, not catalog.

The origin persona is real, not hypothetical: a friend abroad who wanted to spend her money with Israeli makers and had no idea where to start. Every product decision goes back to her — *would this help her find, trust, and reach a designer she'd love?*

---

## 2. Site map

| File | Purpose |
|---|---|
| `index.html` | The designer index. The main product — grid, filters, search, A–Z, favorites, language toggle. ~4,400 lines, all data inline. |
| `Boutiques.html` | Multi-brand stores — deliberately kept separate from designers. |
| `Map.html` | Leaflet map of physical stores. |
| `About.html` | Project story. |
| `Contact.html` | Submissions and corrections. |
| `index-squares.html` | Abandoned alternate grid (uniform squares). Kept as a reference, not linked. |
| `git-export/` | Deploy copy. **Every data edit must be applied to both `index.html` and `git-export/index.html`.** |
| `process-writeup.md` | Narrative/marketing copy in four formats (on-site blurb, case study, blog post, social). Separate from this file. |
| `brands.csv`, `*.tsv`, `ModeIL-*.csv` | Data exports/snapshots. Not the source of truth — the inline array in `index.html` is. |

---

## 3. Data model

Brands live as one JS array literal inside `index.html`. One object per brand:

```js
{
  name: "Brand Name",
  url: "https://…",
  tags: ["minimalist", "sustainable"],      // machine keys, drive filtering
  tagLabels: ["Minimalist", "Sustainable"], // display strings
  desc: "Short card description.",
  descFull: "Longer bio shown on expand.",  // optional
  instagram: "handle",                      // optional, without @
  img: "https://…",                         // hotlinked from the brand's own site
  address: "…",                             // optional; presence = has physical store
  fav: false
}
```

**Decisions baked into this shape:**

- **Inline data, no database.** The site is static files on Vercel. One file to edit, nothing to deploy but HTML, no API to break. At 328 entries this is still comfortable; past ~600 it would be worth splitting to a JSON fetch.
- **Two-axis taxonomy.** *Style* (Minimalist, Edgy, Conceptual, Legacy, Luxury, Artisan…) and *Type* (Jewelry, Swimwear, Menswear, Bridal, Footwear, Knitwear, Lingerie, Accessories…). Keeping them on separate axes is what makes layered filtering meaningful — "minimalist jewelry" is a real query, "minimalist + jewelry in one flat tag soup" isn't.
- **Full current tag set:** Accessories, Activewear, Artisan, Bridal, Casual, Conceptual, Contemporary, Denim, Edgy, Festival, Footwear, Handmade, Jewelry, Knitwear, Legacy, Lingerie, Luxury, Made in Israel, Men, Minimalist, Modest, Natural Fabrics, Natural Stones, Prints, Ready-to-Wear, Size Inclusive, Streetwear, Surf, Sustainable, Swimwear, Unisex.
- **Images are hotlinked from the brand's own CDN**, never re-hosted. Rights stay clean and images update when the brand updates. The tradeoff is link rot — which is why the fallback below exists, and why a dead image is a routine maintenance task, not a bug.
- **`address` is doing double duty** — it's both the map pin and the online-only vs. in-person signal. Worth splitting if store hours or multiple locations ever get added.

---

## 4. Features and how they behave

**Masonry grid.** Pinterest-style staggered columns that still read **alphabetically left-to-right**, not down-then-over. This was a deliberate fix: CSS columns read top-to-bottom, which breaks the A–Z mental model. Cards are distributed across columns in row order instead. Column count is computed in JS and recalculated on resize.

**Image fallback.** If an image 404s, the card renders a colored thumbnail with the brand name set in type. The grid never shows a broken-image icon. Given hotlinked images, this is load-bearing.

**Layered filters.** Style panel, Type panel, Area bar, and A–Z bar, all combinable. Active filters show as removable chips with a Clear All. The result count updates live; an explicit empty state appears when nothing matches.

**Search.** Tokenized across name, description, and tags, plus a `smartConceptMatch` layer so concept words ("bridal", "swim", "gold") hit brands that don't literally contain the term. Search sits in the nav behind a toggle on desktop and inside the mobile menu.

**Favorites.** Heart on each card, persisted to `localStorage` under `modeil-favs`. No account needed — deliberate. Adding accounts would mean a backend, and the value doesn't justify it yet.

**Hebrew toggle.** EN/HE switch. Descriptions are machine-translated on demand and cached in `localStorage` under `descHeCache`, so each description is only translated once per visitor. Hebrew sets RTL and swaps in Noto Sans Hebrew. This is the one non-static feature — it depends on a translation call at runtime and degrades to English if it fails.

**Affiliate links.** `withUtm()` appends tracking params to outbound links. The disclosure page states that affiliation never affects who is listed or how they're described. That firewall is the point — the monetization exists to cover hosting, nothing more.

**Map.** Leaflet with an Esri basemap (chosen over the default tiles for a cleaner, less touristy look that doesn't fight the site's palette).

---

## 5. Design decisions

**Stark, editorial, type-led.** Off-white `#F4F4F4` ground, near-black `#1A1A18` ink, hard corners, no shadows, generous whitespace. The frame disappears so the clothes talk. Anything that would make it look like a startup landing page — gradients, rounded cards, badges, icon sets — is out.

**One typeface: Plus Jakarta Sans**, worked hard across weights. Black/tight-tracked for the wordmark and headlines; small caps with wide letter-spacing for labels and nav. Noto Sans Hebrew for RTL.

**Wordmark:** `MODE-IL` with "Israeli Fashion Index" as a small tracked-out kicker beside it.

**Favicon:** plain black square. Tried marks with letterforms; at 16px they turned to mush. The square reads at any size and matches the stark palette.

**Image curation rulebook** — the unwritten rules the single representative image is chosen against:
- *Typical, not generic* — shows pieces characteristic of the brand's point of view.
- *Local when possible* — if a shoot looks shot in Israel, use it.
- *Interesting over conventional* — when a brand casts diverse models, pick the striking look, not the default.
- *Respectful* — no blunt or over-sexualized imagery.
- *Careful* — no cropped or cut-off faces, nothing likely to cause distress.
- *Personal* — ideally pieces genuinely loved.
- *Sensible default* — when unsure, pick from best-sellers, still applying every rule above.

This curation is most of why the grid feels human rather than like a stock catalog. It's the design work that doesn't look like design work.

**Descriptions in the designer's own voice**, drawn from their about page, not paraphrased into a house style. A directory that flattens everyone into one template isn't worth making.

---

## 6. Editorial rules

- **Designer vs. boutique** is a hard line. Own label → `index.html`. Carries other people's labels → `Boutiques.html`.
- **Must be Israeli.** Brands have been removed on discovering they weren't.
- **Must be active.** Password-gated, dormant, or closed stores come off — Belov was removed for sitting behind a password page; Vanzen and Mikusha-Mela were removed as editorial calls.
- **Curation over completeness.** Some famous heritage houses were deliberately pulled for not fitting the index's spirit. The value is in listing the right things well.
- **Sourcing is on-the-ground**, not from search results: younger-designer events, fairs, pop-ups, and noticing labels on people in the street. That's why the list skews toward discovery over household names.
- **Bridal is in scope** (added deliberately — Lihi Hod, Berta, Alon Livné, Michal Medina and others). So are footwear, jewelry, and swimwear as Type tags.
- **Password page ≠ inactive when it's a drop.** A shop locked behind a "next drop" / early-access page (Edit, Nesh) counts as active. A plain password page or an open-ended "opening soon" with nothing to buy (Gelada, Masada Jeans) comes off. If only the website is dead but the brand's Instagram is alive, the card links to Instagram instead (Salon Berlin, Tami Chomsky). Decided October 2026.
- **Israeli-born designers based abroad** (Nili Lotan, Yigal Azrouël, Elie Tahari) are an open question — currently out. Marei 1998 (founder Maya Reik) and Matnas ("handmade in Brooklyn") joined this group in October 2026. Marei's site is USD-only with Manhattan fittings and no Israeli address.

---

## 7. Working conventions

- **Edit both copies.** Any brand add/remove/image change goes into `index.html` *and* `git-export/index.html`. Scripted find-and-replace across both is the normal workflow.
- **Add brands by appending** to the array before the closing `];`, then verify the page loads and the count is right.
- **Image updates are the highest-frequency task** — a URL arrives, it replaces the old `img` string in both files. Fast and low-risk.
- **Verify facts from the brand's own site** before writing a description: tags, Instagram handle, whether the store is live.
- Known fragility: Two Tone's image is hosted on razili.co.il, which closes 1 October 2026 — that URL will die and needs swapping to one on Two Tone's own domain.

---

## 8. Open threads

**Sales / discounts feature — discussed, not built.** Three options were scoped:
1. A `sale: { text, until }` field on existing brands → SALE badge on the card, an "On Sale" filter, auto-expiry on the date. Manual entry, ~15 min to build. *Recommended starting point.*
2. A dedicated Sales page in the nav — same data, sorted by ending soonest.
3. Automatic detection. Needs a scheduled job (Vercel Cron or GitHub Action), a checker reading each store's product feed (`/products.json` on Shopify covers ~60–70% of the index; WooCommerce has an equivalent; Wix and custom sites would need fragile per-site scraping), and a `sales.json` written back into the repo for the page to fetch. Caveats: some stores block bots, a banner sale isn't always reflected in product prices, and a redesign breaks a checker silently — so it needs a fallback where a failed check never blanks the page.

The agreed path: build manual first, then layer automatic Shopify detection behind it, with manual entries always overriding automatic ones.

**Portability.** No build step, no framework, no dependencies beyond CDN scripts — the whole project moves as a folder or a Git repo anywhere.

**Recheck in early November 2026.** Sages & Souls (`sagesandsouls.com`) put up a Shopify password page on 4 Oct 2026 saying it is "taking a short pause… We hope to be back soon". Kept for now; if it is still paused, remove it until it returns. Masada Jeans was removed on 3 Oct 2026 for an "opening soon" page; re-add once `masadajeans.com` relaunches. Sun Set (Einat Rozen, `@sun.set.einatrozen`) was removed on 3 Oct 2026 when `sunset.design` went down; its Instagram still exists but hasn't posted since June 2025, so it stays off (decided 5 Oct 2026). Re-add, linked to Instagram, if it starts posting again or the site returns.

**ARE directory follow-ups (5 Oct 2026).** The womenswear brands from ARE Magazine's directory that weren't added yet (full list in `docs/reports/are-directory-gap.md`). Parlez de Vous: the homepage is still an "Available Spring 2026" placeholder; add it once the site relaunches. Ella Levy: no new products since May 2025; add her if a new collection appears. Yael Shaulsky: almost all clothing sold out, and her "War Fetish" line is editorially sensitive; revisit if a new clothing collection launches. We Must Shop (Montefiore 30 and Dizengoff 138, Tel Aviv) is a multi-brand boutique, so it's a `Boutiques.html` candidate, not a designer. Batch 2 (swim, bags, footwear, men, activewear): recheck Archie & Dennis (the site never says Israel; the terms say Israeli law and third-party listings put it in Tel Aviv), Highlight Studio (last collection SS25) and DEA (clothing from 2021–23, sold as pre-order). SUMR / Greek Sandals (Frishman 18, Tel Aviv) is another Boutiques candidate. Skipped: Norman & Bella (the site says "So long, farewell") and Bootleg (no on-body photos, unlicensed celebrity prints). Mamo White (MAMO by Shiran Reuven, Instagram only, bridal) is a separate brand from LUMINARY; consider it once it has a site. Bridal batch: Yanky & Nataf to recheck (the site's bridal page is empty, the shop holds 2022–23 evening dresses, and Instagram looks quiet since mid-2025).

**To do: review every brand's tags (added 5 Oct 2026).** Tags drive the filters, so a wrong or missing tag hides a brand. Example: Ayoola is lingerie but is tagged only Minimalist, so it never shows under the Lingerie filter. A quick count on 5 Oct found:
- 179 of 356 designers have no Type tag at all, so they're invisible to every Type filter.
- 83 designers have only one tag.
- Four tag keys (`casual`, `handmade`, `made-in-israel`, `local-production`) aren't in `STYLE_TAGS` or `TYPE_TAGS`, so they show on cards but can't be filtered.
- Some descriptions mention bridal, footwear or lingerie without the matching tag. The candidates found so far are Ayala Vitkon, Neta Efrati, Seestarz, IDIOM, IDA Studio, Yaron Minkowski, HKN, Partizano, Tovale+, Latto Velara, Galia Lahav, Kahiko and Sunshine. These are only hints and each needs checking.

Plan: go through brands category by category against their own sites. Give each one its Type tag (what it makes) and 1–2 Style tags that genuinely fit (not a default Minimalist). Then decide whether the four stray keys become real filters or get folded into existing ones.

**Other open items:** whether to split the data out of `index.html` as it grows; whether to add remaining suggested designers (Gideon Oberson, Michal Negrin, Shani Bar, Vivi Bellaish, Yaron Minkowski were listed and only partly added); whether diaspora Israeli designers belong.

---

## 9. Principles worth keeping

- **Build the structure before scaling the content.** Committing to a clean schema early is what made filters, map, and search easy later, and what kept the taxonomy from turning to mush at 300+ entries.
- **Editorial independence is non-negotiable.** Affiliate revenue covers hosting and touches nothing else.
- **The care is the product.** Hand-picked image, hand-written description, honest tags, one entry at a time. It's slow on purpose.
- **Free, and staying free.**
