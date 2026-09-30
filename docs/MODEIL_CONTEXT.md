# ModeIL (mode-il.com) — Project Context for Claude Code

> Handoff summary compiled 2026-09-30 from Dana's saved project notes (claude.ai "Mode-IL" project + memory).
> It is a summary of notes, not of the code. Anything marked **VERIFY** is unconfirmed or contradictory — check it against the repo before relying on it.

## What it is

- A curated discovery index of **independent Israeli fashion designers** — ~276 entries (as of July 2026; likely changed since).
- Two purposes: a contribution to the Israeli fashion ecosystem, and a hands-on vehicle for learning vibe-coding / AI-assisted building.
- Positioning: breadth + editorial independence. Aim is to be the most complete public index of Israeli designers.
- Competitors / comparators: **Mishelanu** (owns the diaspora-buyer, transactional persona), **NJAL**, **Industrie Africa**. ModeIL differentiates on breadth and curation, not "solidarity buying".

## Product — what exists

- Designer cards in a **masonry layout**.
- Filters on a **two-axis taxonomy** (style, type) plus area/location.
  - Filter logic: **OR within an axis, AND across axes.**
- Store **map** and a **boutiques** section.
- Branding: wordmark, **dusty rose** accent. Tone: light, editorial.
- Roadmap buckets: Designer Cards, Filters, Map, CMS, Monetization.

## Tech & hosting

- Hosted on **Vercel Pro**, custom domain mode-il.com.
- **VERIFY — stack is contradictory in the notes:** one note says "static HTML", another says "static React app". Check the repo (`package.json`, build config) first.
- Analytics: **Vercel Web Analytics** with custom events `filter_applied` and `designer_opened`. A tracking plan using a **delegated event listener** was prepared — **VERIFY** whether it's actually deployed.
- Some SEO / keyword strategy work was done (details not in notes).
- Note: the Vercel connector in Cowork showed no projects on the team it can see, so the Vercel project may live under another account/team — confirm with `vercel link` / `vercel ls`.

## Personas (validated weakly)

- **Anat** — abroad buyer
- **Tzip** — diaspora demand
- **Ran** — directed search (menswear, natural fabrics)
- Use cases being tested: abroad buyers, location-based discovery, directed search.
- Signal so far comes from Dana's own network — doesn't pass the Mom Test. Treat as hypotheses.

## Decisions made

- **Affiliate monetization: rejected** — poor fit.
- Low-maintenance operation is a hard preference; favour solutions that don't need ongoing upkeep.

## Content / curation research (boutiques & brands)

Boutiques documented:
- קולבים — kolavim.co.il
- טולה / שדרת המעצבים — da-studio.co.il, tula-tula.com
- רוזית — rozit.co.il
- מיקושה-מלה — mikusha-mela.co.il
- פואנטה Jerusalem — poentaboutique.com
- Instagram-only: סופיה, טלי'ס, הפרלמנט של עתר
- Also researched: לליב

Brands researched: Madam Bubu (madambubu.com), Maayan Paz (maayanpaz.co.il), Uniform Apparel, Needles (plus adidas, H&M, AliExpress for comparison).

**VERIFY** whether these have been added to the site data yet — notes don't say.

Scraping notes: AliExpress and individual Madam Bubu product pages are often blocked; non-localized aliexpress.com and direct madambubu.com product slugs work better; Maayan Paz collection pages fetch but with little detail.

## Open items / risks

1. **Image rights** — the site uses designer images; this is a real, deferred legal risk. Rachel Zilberfarb-Schreiber (fashion lawyer, conference organizer) called ModeIL "really missed in Israel" and works on unauthorized image use. Outreach in progress; image rights intentionally not raised yet.
2. **Portfolio case study** — drafted; has a checklist of claims (taxonomy, filter logic, masonry) to verify against live site behaviour before publishing. Claude Code is a good place to do that check.
3. **Editorial integrity** — fabric mislabeling on brand listings (e.g. viscose/poly sold as "linen") is worth considering for how the index describes items.
4. Expand boutique/brand coverage; better persona validation.

## Gaps — not in the notes

- Repo location, file structure, data format (JSON? hard-coded?) and how entries are added.
- Whether a CMS exists or is still roadmap.
- Current analytics numbers.
- What the SEO work actually changed.

## How Dana wants to work

- Direct, honest feedback — good news and bad news, no flattery.
- Don't guess; verify against the code or live site, and say "I don't know" when that's the case.
- Hebrew or English, switching contextually.
