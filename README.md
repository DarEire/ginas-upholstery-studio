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
- **Photos still needed.** The hero uses an illustrated before/after chair. Real photography of actual pieces is the biggest remaining upgrade — Instagram/Facebook image URLs are time-signed and can't be hotlinked, so drop the actual image files into an `images/` folder and reference them. See the design review for the recommended before/after gallery.
- Phone numbers and the workshop address are carried over from the original business.
- The `mailto:` address `hello@ginasupholstery.ie` is a placeholder; the form needs a Formspree hookup for real submissions.
