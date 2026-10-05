# Tailwind build

The pages load `assets/tailwind.css`, a compiled stylesheet, instead of the Tailwind play CDN.

The compiled file is committed, so the site still deploys as plain static files. You only
need this folder when a page starts using a Tailwind class it didn't use before
(for example `md:pt-24` when only `md:pt-20` existed). Then:

```bash
cd scripts/tailwind
npm install        # first time only
npm run build:css
```

and commit the updated `assets/tailwind.css`.

If a new class seems to do nothing, a missing rebuild is the first thing to check.

- `tailwind.config.js` holds the colours, fonts and radii that used to be repeated inline in every page.
- `Map.html` has its own CSS and does not use Tailwind.
- The output is deliberately not minified: minifying rounds one translucent colour slightly
  differently from the CDN version. Vercel compresses it to about 7 KB in transit.
