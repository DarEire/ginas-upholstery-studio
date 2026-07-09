# Gina's Upholstery Studio

A quiet-premium remake of [galwayupholstery.com](https://galwayupholstery.com), rebranded as **Gina's Upholstery Studio** — award-winning re-upholstery, bespoke sewing, in-store fabric selection and furniture repair in Galway.

**Re-Upholster · Recycle · Revive**

## What's inside

A zero-dependency static site — plain HTML, CSS and JavaScript. No framework, no build step.

- `index.html` — one-page site: hero with before/after restoration reveal, services, process, testimonials, contact
- `styles.css` — Arts & Crafts palette (indigo, madder, sage, gold on warm cream), Fraunces + Inter type
- `script.js` — restoration reveal slider, mobile nav, scroll reveals, enquiry form

Signature animation — the hero's **before & after restoration reveal**: a bespoke SVG wingback armchair drawn twice (worn and patched vs. re-upholstered in madder with animated gold stitching), split by a draggable brass tack inside an arched frame. Driven by an invisible full-bleed `<input type="range">`, so it's keyboard-accessible and touch-friendly; a one-time hint sweep plays on load (skipped under `prefers-reduced-motion`).

Design inspired by [isas1/forever-ai-components](https://github.com/isas1/forever-ai-components) and its William Morris collection.

Design inspiration: Maiden Home, Long Eaton Sofas, Sixpenny, Loaf — "quiet premium" with a heritage-craft accent.

## Run locally

Open `index.html` in a browser, or:

```sh
npx serve .
```

## Deploy on Vercel

Import the repo in Vercel and deploy — it's a static site, no configuration needed (framework preset: **Other**).

## Hooking up the enquiry form

The form currently opens the visitor's email client (`mailto:`). For real submissions on a static site, create a free [Formspree](https://formspree.io) form and replace the submit handler in `script.js` with a `fetch` POST to your endpoint — or point the form's `action` at it directly.

## Content notes

- **Testimonials are real** — pulled from the business's Google reviews (4.8★ / 24 reviews): Eamon Comer, Orlagh Moran, French Vanoli. The rating badge links to the Google reviews page.
- **Social links are live** — Instagram [@ginasupholstery](https://www.instagram.com/ginasupholstery/) and Facebook [/galway.upolstery](https://www.facebook.com/galway.upolstery). (Gina also has a personal page at /ginapinel.)
- **Instagram feed** — the "Latest on Instagram" section (`#instagram`) uses Instagram's official post embeds (`embed.js`) for three real work posts (cushion transformation, mulberry leather two-seaters, Chesterfield restoration). These are live-served by Instagram, need no API key or token, and link back to the profile.
  - *Note:* official embeds show the **specific posts hardcoded in the markup** — they don't auto-pull new posts. To make it a true auto-updating "latest posts" feed, connect the account to a free widget (e.g. [LightWidget](https://lightwidget.com) or [Behold](https://behold.so) — a ~5-min account link, no code), then replace the three `<blockquote class="instagram-media">` embeds with the widget's iframe/snippet. To add/rotate posts by hand instead, just swap the `data-instgrm-permalink` URLs.
- **Hero photography still ideal.** The hero uses an illustrated before/after chair. Real photos of actual pieces remain the biggest upgrade — Instagram/Facebook image URLs are time-signed and can't be hotlinked, so drop the actual files into an `images/` folder and reference them.
- Phone numbers and the workshop address are carried over from the original business.
- The `mailto:` address `hello@ginasupholstery.ie` is a placeholder; the form needs a Formspree hookup for real submissions.
