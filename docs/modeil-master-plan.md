# ModeIL — Master Plan
### Story · Principles · Growth Architecture · Idea Backlog · Tech · Roadmap · Linear

The single source of truth for the ModeIL rebuild. Consolidates the project notes, the GTM playbook, this conversation, and two external reviews (Gemini + ChatGPT). Ideas from all sources are captured — each with an honest verdict, not a blanket yes.

---

## 1. The idea

ModeIL is the **definitive discovery guide to independent Israeli fashion** — a hand-curated index of designers (and the physical shops that carry them), built and edited by one person with taste.

It is **not** a marketplace, a magazine, or a tourist guide. Its moat is exactly that narrowness: *fashion + Israeli + one curator's judgment.* Both external reviews independently reached the same conclusion — the next challenge isn't adding more designers, it's **helping people find their way through the ones already there.**

**Proposition (refined):**
> I track Israeli fashion, so you don't have to. — *Discover independent Israeli designers by style, category, and location.*

The tagline stays (it's you); the second line tells a first-time visitor what they can actually *do* here.

---

## 2. Who it's for (in priority order)

1. **The mindful local shopper (primary).** Mostly women ~30–60 who've outgrown the chains, want local/independent design with a specific sensibility (minimalist, oversized, natural fabrics, edgy, dance-friendly), will pay more for something distinctive, and want to shop in person — often outside their own neighborhood. This audience is close to you, which is the advantage: you know their real question is *"where do I find something interesting, comfortable, and not too young?"* — not *"who are the ten most famous designers?"*
2. **Diaspora & pro-Israel international shoppers.** Highest willingness to pay, worst-served today. Their #1 friction is *does it ship to me* (see the ships-worldwide facet).
3. **Tourists & visiting Israelis.** High intent, short window; the map and shopping routes serve them.
4. **Industry (stylists, costume designers, journalists, buyers).** A fast categorized rolodex; low effort to serve, high-leverage for credibility.
5. **Designers themselves.** Contributors and distributors, not the main audience — but your single best distribution channel.

Do **not** target "everyone who likes fashion." All three reviews agree.

---

## 3. Principles / non-negotiables (the filter every idea passes through)

- **Editorial independence is absolute.** Affiliate revenue covers hosting and touches nothing else. Anything that lets money influence who's listed or how they're described is out.
- **Single-curator authority is the product.** Your taste and voice are the moat. Reviews, ratings, and social feeds dilute it.
- **Low operational overhead by design.** Every added service is a maintenance burden forever. Default to the lightest thing that works.
- **Curation over completeness.** List the right things well.
- **Preserve the soul:** hand-picked images (your image rulebook), descriptions in designers' own voices, honest tags.
- **Free, and staying free.**

---

## 4. Architecture for growth — the seams to design NOW

The rule: **design the seams now, build the features later.** Leaving clean places for future ideas to plug in is nearly free; building features you won't use for months is waste. These are the structural decisions that make the entire backlog cheap:

1. **One "entry" model with a `kind` field** (`designer | boutique | vintage | …`) — shared base + kind-specific fields. Every page (Designers, Boutiques, future Vintage) becomes a filtered view of one collection. Also finally resolves the Boutiques-bar debate: import shop / vintage / fast-fashion / designer are just `kind`s.
2. **Data-driven faceted taxonomy** — tags belong to named facets (style, type, occasion, fabric, region, price, attributes) and the filter UI renders *from* the taxonomy. A new filter is new **data**, never new code. Unlocks "wedding dress," "menswear + natural fabrics," "shops in Pardes Hanna," and anything you dream up later.
3. **Structured location** — split the overloaded `address` into region/city (facet) + coordinates (map) + display address. Unlocks location browsing and shopping routes.
4. **First-class content types** — model brands, **posts**, **events**, and **collections** as content, with **stable slugs/IDs** so a post ("why Maya Bash is a genius") can *reference* the Maya Bash entry, pull her images, and link to her page. This is the seam that turns "a blog someday" into a weekend, not a rewrite.
5. **Per-designer profile pages** ⭐ — *the biggest structural addition, and where both external reviews converged.* Today cards link straight out to brand sites; Google can't rank a single filtered index. Internal pages (`/designers/maskit/`) each become a ranking opportunity and a shareable unit, and they're where the richer metadata, "similar designers," stockists, and "last checked" live. This is a routing + data decision, so it's a **now** decision.
6. **Capture audience before delivery** — put a newsletter signup live early so subscribers accrue before any "updates" feature exists.

If these six can absorb the whole backlog below (they can), the architecture is right.

---

## 5. The idea backlog — everything, with verdicts

### A. Shape the schema now (structural — decide before building Phase 2)
- **Per-designer profile pages** ⭐ — endorsed by both reviews + SEO reality. The single highest-value structural addition.
- **Curated collections / "edits" as a content type** — "Wedding-guest clothes that aren't wedding-guest clothes," "Linen designers," "Sizes 44+," "Gifts under ₪300," "A fashion day in Pardes Hanna." The bridge between index and blog; your taste as the unit of marketing. Cheap **only** if modeled as a content type now.
- **Stockist / "where to buy" relationships** (Eskimoss → Scorcher) — gives Boutiques/Vintage a real job as the physical layer under designers. Needs entry-to-entry references, so decide now.
- **Ships-worldwide facet** — the diaspora persona's top friction. Trivial as a field, painful to retrofit later.
- **Price-tier facet** (₪, ₪₪, ₪₪₪, ₪₪₪₪) — both reviews; a clean facet.
- **Made-in-Israel vs designed-in-Israel/made-abroad** — a provenance facet and one of your differentiators.
- **Occasion + fabric + region facets** — wedding, linen, Pardes Hanna, etc. All fall out of the faceted-taxonomy seam.
- **Freshness signals** ("verified June 2026," "new," "recently updated," "temporarily closed," "online only") — a couple of date/status fields; builds trust and gives designers a reason to return.
- **Events / calendar as content** (pop-ups, sample sales, studio-open days, launches) — feeds both the proximity persona and the "automatic updates" feature.
- **Authored bilingual content (EN/HE)** — machine translation is fine for card blurbs, but an authored Hebrew voice (especially the blog) is a content-modeling decision. Pushes the CMS call (see §6).

### B. Park it (cheap to add later, no structural cost — as long as §4 is done)
- **Guided entry points above the index** ("Find my style," "Not just Tel Aviv," "For people who mostly wear black," "New this month") — opinionated shortcuts over the full catalogue; both reviews flagged choice-overload on the raw A–Z.
- **"Find my MODE" style quiz / vibe matcher** — a short visual quiz → your MODE + ~12 designers. Both reviews' favorite "signature, shareable" feature. Depends on good facets existing, so it's cheap *after* §4.
- **Shopping routes / neighborhood walks** ("2 hours in Neve Tzedek") — depends on structured location.
- **Sales / pop-up radar + newsletter/RSS delivery** — the *ingestion* is the Phase-4 automation; the *delivery* engine defers. Only the signup + the sale/event *data* need to exist early.
- **The blog** — near-free once posts are a content type that can reference designers.
- **Named / shareable saved lists** ("Wedding possibilities," "Visit in TLV") — named lists stay localStorage; *sharing* a list crosses into backend territory (see the accounts line in §C).
- **"New arrivals," "designer of the week," "surprise me," gift finder** — all fall out of a date field, a flag, or existing facets.
- **"Featured on ModeIL" embed badge** for designers' own sites — free backlinks + distribution, pure upside.
- **Press / "as seen in" per designer** — just a field when wanted.

### C. Consciously skip (traps — several came from the external reviews)
- **Live database + user auth (ChatGPT's Supabase suggestion)** — adopt the *relational modeling* (separate brands/tags/locations, many-to-many) but **not** a running SQL DB with auth. A headless CMS or typed content gives the same structure without the ops burden — and auth directly contradicts your low-maintenance value and the "no accounts yet" advice both reviews also gave. Contradiction resolved in ModeIL's favor.
- **Re-hosting designers' images / Cloudinary as default** — genuine tradeoff, so it's an open decision (§9), not an auto-yes. You deliberately hotlink so rights stay clean and images auto-update; re-hosting raises exactly the copyright question a fashion lawyer would flag. Middle path exists (CDN proxy/optimize without permanent re-host, or permissioned thumbnails).
- **User accounts / cross-device favorites** — means auth + backend = the maintenance you designed away. Resist until a feature genuinely can't work without it.
- **Reviews / ratings / comments** — dilute single-curator authority; endless moderation. Your voice is the review.
- **Designer self-service editing** — erodes editorial control, needs auth + moderation. Keep "designers submit, you decide."
- **Sponsored drops / paid premium placement (both reviews floated it)** — direct threat to the editorial-independence firewall that is your whole credibility. Affiliate-only is the safe monetization; if you ever allow sponsorship, it must be unmistakably labeled and never affect ranking or description. Flagged, not adopted.
- **Full marketplace, live product-catalogue imports, social feed, generic AI chatbox, TikTok (for now), 3rd language beyond EN/HE** — all add weight and weaken the editorial point of view. All three sources agree.

---

## 6. Tech stack (reconciled)

- **Framework:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui — the professional default, best design-to-code ecosystem. *Alternative: Astro*, leaner and arguably the better pure-engineering fit for a content site; pick it only to optimize for the product over the career-standard toolchain. (Open decision §9.)
- **Content layer: a headless CMS — Sanity — now elevated to core (was optional).** Your blog + events + collections + relational post→designer references + authored bilingual content are *exactly* what a CMS is for. It also absorbs ChatGPT's relational-modeling point without a live DB or auth, and gives you a real editor for curation. If you'd rather stay lighter, typed MDX/JSON content collections can hold posts too — less editor comfort, no extra service.
- **Filtering & search:** client-side, in-memory (Fuse.js / MiniSearch) at your scale, with **filter state in the URL** (`?style=minimalist&region=pardes-hanna`) so filtered views are shareable, bookmarkable, and SEO-friendly. (Good calls from ChatGPT's doc; adopt.)
- **Map:** keep Leaflet + Esri (your deliberate clean look), or switch to Mapbox/MapLibre if you specifically want to learn it — minor either way.
- **Images:** **open decision** — hotlink (current) vs. CDN proxy/optimize vs. permissioned re-host. Rights vs. performance/link-rot; the dead razili.co.il image (Two Tone, Oct 2026) is the live reminder that hotlinking has a real cost.
- **Hosting/CI:** GitHub → Vercel (you have Pro). PR → preview deploy → merge → prod.

---

## 7. Learning roadmap (phases) — updated

The rebuild is the vehicle for learning the full modern stack. Current static site stays live in prod until the new one hits parity. Every phase ships something working.

- **Phase 0 — Environment, Git, Linear, first deploy.** Terminal, Git/GitHub, Linear, Vercel. Deliverable: empty app live in prod + this plan as a Linear board.
- **Phase 1 — Scaffold + design-system foundation.** Your three-tier tokens (primitive→semantic→component, no primitive leaks, dark mode via semantic tokens) → CSS variables + Tailwind theme; primitives (Button, Tag, Card) on shadcn/ui; Storybook. *You own the token theory; the new skill is the plumbing into code.*
- **Phase 2 — Core product + growth architecture.** The big one. Implement the six seams (§4): entry+kind model, faceted taxonomy, structured location, content types, **per-designer profile pages**, and the CMS. Migrate the inline array → CMS/typed data with a schema. Grid, filters (URL-state), search, favorites, EN/HE + RTL — accessibility built in from the start (fixes the a11y gap by construction).
- **Phase 3 — Ship it properly.** CI/CD, ESLint/Prettier, typecheck, a Lighthouse/axe accessibility gate that blocks regressions, per-PR previews, analytics events (designer_click, filter_apply, search, save_toggle), and the accessibility statement page.
- **Phase 4 — Agents & automations.** Sales detector (Shopify `/products.json` → `sales.json`, manual overrides win, failed check never blanks the page); brand-vetting agent (automates today's is-it-Israeli / designer-or-shop / AI-images / suggested-tags workflow into a tool you approve).
- **Phase 5 — Design-to-code loop (capstone).** Figma Code Connect linking your Figma components to the real coded ones; reconcile token gaps (e.g. the `action/selected` semantics you flagged). Figma and code reference one source of truth.

---

## 8. Recommended sequence (product + strategy view)

Build order that interleaves learning with the elevated structural work:
1. Clarify proposition + add guided entry points (copy/UX, cheap).
2. Per-designer profile pages with structured, trustworthy metadata (the SEO + shareability unlock).
3. Publish 2–3 curated collections (marketing units with a human voice).
4. Authored Hebrew.
5. "Find my MODE" quiz.
6. Events, sale alerts, shopping routes — once there's repeat traffic.

(This mirrors both external reviews' sequences; it slots on top of the technical phases in §7.)

---

## 9. Open decisions (the real forks — everything else can start without these)

1. **Framework:** Next.js (recommended) vs Astro.
2. **Content layer:** Sanity CMS (recommended, given the blog/events/collections ambition) vs typed content files.
3. **Images:** hotlink (current) vs CDN proxy/optimize vs permissioned re-host — has real rights implications.
4. **Monetization stance:** affiliate-only (protects independence) vs allowing clearly-labeled sponsorship (more revenue, real risk to the firewall).

Phase 0 is stack-agnostic, so we start regardless of these.

---

## 10. Linear-ready epics

Once Linear is connected I can create these directly; otherwise they're importable. Each epic → a handful of issues with acceptance criteria (a sample shown; the rest expand the same way).

- **EPIC 0 — Foundations.** Install toolchain · create repo · create Linear project · empty app deployed to Vercel · confirm framework decision.
  - *Issue:* "Deploy hello-world to Vercel from GitHub." *AC:* pushing to `main` auto-deploys; live URL loads; PR opens a preview URL.
- **EPIC 1 — Design system.** Token pipeline (primitive→semantic→component) as CSS vars + Tailwind theme · dark mode via semantic tokens · Button/Tag/Card primitives · Storybook.
  - *Issue:* "Encode semantic color tokens with enforced reference direction." *AC:* no component references a primitive directly; dark mode themes with zero component-level overrides.
- **EPIC 2 — Data & content model.** Entry+kind schema · faceted taxonomy · structured location · content types (brand/post/event/collection) · CMS setup · migrate 328 entries.
  - *Issue:* "Model entry with `kind` and kind-specific fields." *AC:* Designers, Boutiques, Vintage all render from one collection filtered by `kind`.
- **EPIC 3 — Core UI.** Masonry grid (A–Z order) · image fallback · URL-state filters · search · favorites · EN/HE + RTL.
- **EPIC 4 — Profile pages.** Per-designer route · metadata (price, sizes, made-in, availability, stockists, similar designers, last-checked) · share/save · JSON-LD.
- **EPIC 5 — Ship it.** CI (lint/typecheck) · a11y gate · previews · analytics events · accessibility statement.
- **EPIC 6 — Collections & blog.** Collection content type + pages · first 3 edits · blog post type referencing designers · first post.
- **EPIC 7 — Automations & agents.** Sales detector · brand-vetting agent · newsletter signup.
- **EPIC 8 — Design-to-code.** Figma Code Connect · token-gap reconciliation.

---

*Prepared 13 September 2026. Supersedes the earlier standalone learning-roadmap file.*
