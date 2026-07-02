# Gina's Upholstery Studio

A quiet-premium remake of [galwayupholstery.com](https://galwayupholstery.com), rebranded as **Gina's Upholstery Studio** — award-winning upholstery, furniture restoration, spraying and repair in Galway.

**Re-Upholster · Recycle · Revive**

## What's inside

A zero-dependency static site — plain HTML, CSS and JavaScript. No framework, no build step.

- `index.html` — one-page site: hero, services, process, fabric library, testimonials, contact
- `styles.css` — Arts & Crafts palette (indigo, madder, sage, gold on warm cream), Fraunces + Inter type
- `script.js` — canvas animations, mobile nav, scroll reveals, enquiry form

The two canvas pieces are adapted from [isas1/forever-ai-components](https://github.com/isas1/forever-ai-components):

- **Hero:** *Growing Vine* (`infinite/morris/03-growing-vine.html`) — a recursive Arts & Crafts vine that draws itself on deep indigo
- **Fabrics:** *Colour-Way Switcher* (`infinite/morris/04-colour-way-switcher.html`) — an ogee botanical tile that re-dyes itself through five historic colourways, driven by the swatch buttons

Both keep the originals' `prefers-reduced-motion` guards, `visibilitychange` pause/resume and DPR-aware canvas sizing, and additionally pause when scrolled out of view.

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

- Phone numbers and the workshop address are carried over from the original site; the testimonials are placeholder copy — replace with real reviews before going live.
- Social links point at instagram.com / facebook.com generically — swap in the real profile URLs.
- The `mailto:` address `hello@ginasupholstery.ie` is a placeholder.
