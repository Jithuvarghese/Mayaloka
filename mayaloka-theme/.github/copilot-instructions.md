# AGENTS.md

Instructions for AI coding agents (Codex, Cursor, Claude Code, Copilot, etc.) working in this repo: a Shopify theme for a fine-jewelry e-commerce store (brand spirit similar to amama.in).

This file is the single source of truth for brand and theme conventions. Tool-specific files (`CLAUDE.md`, `.cursor/rules/`, `.github/copilot-instructions.md`) point back to or mirror this content — edit here first.

## Project overview

- Platform: Shopify, Online Store 2.0 (sections/blocks/JSON templates).
- Vertical: fine jewelry — premium, considered-purchase e-commerce, not fast fashion/discount retail.
- Fill in for your setup: `shopify theme dev` to run locally, `shopify theme push` to deploy, any lint/test commands you use (e.g. `theme-check`).

---

## Brand kit

Every UI decision — Liquid, CSS, copy — should default to these tokens. Never hardcode a hex value inline; reference CSS custom properties defined once in the theme's root stylesheet.

### Color palette

| Token (CSS var)        | Hex     | RGB              | Primary use                                                   |
|-------------------------|---------|------------------|----------------------------------------------------------------|
| `--color-terracotta`    | #812B23 | 129, 43, 35      | Primary brand/CTA color — buttons, active nav, links, headers |
| `--color-powder-sky`    | #79C4ED | 121, 196, 237    | Secondary/cool accent — used sparingly (sale tags, info banners, secondary buttons) |
| `--color-antique-gold`  | #D3AD4F | 211, 173, 79     | Jewelry accent — dividers, icon strokes, borders, hover states, "new/bestseller" badges |
| `--color-black`         | #000000 | 0, 0, 0          | Primary text, high-contrast UI                                |
| `--color-white`         | #FFFFFF | 255, 255, 255    | Background, negative space                                    |

Usage rules:
- Terracotta is the default interactive color (primary buttons, link underlines, focused states).
- Antique Gold is decorative, not interactive by default — fine lines, icon accents, price/badge trim, hover underline on nav — evoke gold jewelry, don't shout.
- Powder Sky is a controlled counterpoint only — never the dominant color of a section.
- Default background is white/off-white with generous whitespace. Avoid cluttered, discount-retailer layouts, harsh drop shadows, or saturated color blocking.
- Check contrast before using Terracotta text on Powder Sky (or vice versa) — prefer black/white text on colored backgrounds.

Root CSS variables (define once, reference everywhere):

```css
:root {
  --color-terracotta: #812B23;
  --color-powder-sky: #79C4ED;
  --color-antique-gold: #D3AD4F;
  --color-black: #000000;
  --color-white: #FFFFFF;

  --font-heading: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-subheading: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### Typography

| Role                          | Font                  | Character                          |
|--------------------------------|------------------------|-------------------------------------|
| Headings (h1–h3, hero titles)  | Playfair Display       | Elegant, expressive, refined        |
| Subheadings (h4–h6, eyebrows, product subtitles) | Cormorant Garamond | Classic, versatile serif  |
| Body / UI text (paragraphs, nav, buttons, forms) | Lato | Clean, modern, highly legible |

- Load via `{{ 'font-name' | font_face }}` / theme settings `font_picker`, or Google Fonts with `font-display: swap`.
- Headings: generous letter-spacing and line-height, never cramped.
- Body copy in Lato, minimum 16px.

### Brand voice

- Elegant, warm, refined — never loud, discount-y, or overly salesy.
- Avoid ALL CAPS except short eyebrow labels/badges ("NEW", "BESTSELLER").
- Minimal exclamation points — reserve urgency language for sale/limited-stock banners only.
- Product copy favors craftsmanship, material, and occasion language ("hand-set", "18k gold vermeil", "wedding edit") over generic marketing filler.

---

## Shopify theme architecture (Liquid, sections, schema)

- **Sections** (`/sections`) hold layout + `{% schema %}`. Keep reusable across templates.
- **Blocks** live inside a section's schema so merchants can add/reorder/remove content from the theme editor — don't hardcode repeatable content (testimonials, USP icons, FAQ items).
- **Snippets** (`/snippets`) for markup reused across sections. Pass data via `{% render %}` params, don't rely on implicit outer scope.
- **Templates** (`/templates/*.json`) compose sections — prefer JSON templates over `.liquid` templates.
- Name files descriptively: `section-featured-collection.liquid`, `snippet-product-card.liquid` — not `section-1.liquid`.
- Expose brand-relevant options (heading, background color, image, CTA) via schema `settings`; tie color settings to the brand swatches above so merchants can't pick off-brand colors. Default values should already reflect the brand kit.

### Jewelry metafields

Reference metafields for attributes distinct to jewelry, surfaced via a structured spec block/accordion rather than free text in the description:
- Metal type & purity (14k/18k/925 silver)
- Gemstone(s) and weight/carat
- Ring size range / adjustable
- Chain length / dimensions
- Hallmark / certification info
- Care instructions

### Performance

- `{{ image | image_url: width: ... }}` with `srcset`/`sizes` and `loading="lazy"` (except the first hero/LCP image — load eagerly).
- Avoid raw `{{ product.description }}` HTML dumps breaking layout.
- Paginate large collection loops; avoid nested liquid loops over big datasets.
- Defer non-critical JS; no blocking `<script>` in `<head>`.

### Accessibility

- Meaningful `alt` text on every image (product name + key attribute, not filename).
- `aria-*`/`role` and visible focus states on interactive elements (variant swatches, accordions, quick-add) — use `--color-antique-gold` for focus rings, not pure black.
- Logical heading order, one `h1` per page — use CSS for visual sizing, not heading level.

### Don'ts

- No hardcoded hex colors or font names in `.liquid` files — use theme settings or the CSS variables above.
- No duplicated markup across sections — extract to a snippet once reused.
- Don't refetch data Liquid already has in context (`cart`, `product`, `collection`).

---

## CSS / styling conventions

- Always use the CSS custom properties above — never a raw hex or font-family string outside `:root`.
- New shades (e.g. hover tints) get their own named variable near `:root` (e.g. `--color-terracotta-dark: #5e1f19;`), not an inline one-off.
- Mobile-first: base styles for small screens, layer up with `min-width` queries.
- Generous whitespace/padding — premium brand, not a dense discount grid. ~2rem+ section padding desktop, ~1.25rem+ mobile.
- Grid/Flexbox for product grids, not floats.
- Product images: wrap in an aspect-ratio box (`1/1` or `4/5`) to prevent layout shift during lazy load.
- Hover/focus states shift toward `--color-antique-gold` or a terracotta-dark tint — subtle. Transitions: `0.2s`–`0.3s ease`, no bouncy easing.
- Buttons: solid Terracotta primary, outlined Terracotta/Gold secondary — max two button styles per page.
- `h1`–`h3` → `var(--font-heading)`; `h4`–`h6`/eyebrows → `var(--font-subheading)`; body/nav/buttons/forms → `var(--font-body)`.
- No `!important` except overriding third-party/Shopify-injected styles as a last resort (comment why).
- BEM-ish component-scoped class names (`.product-card__title`), not deep nested selectors.
- One component per CSS file under `assets/` (e.g. `component-product-card.css`) rather than one giant stylesheet.

---

## Jewelry e-commerce UX patterns

### Product page
- Gallery: multiple high-res images with zoom, plus a lifestyle/on-model shot; optional video/360° block.
- Variant selection: swatches (not plain dropdowns) for metal/gemstone; size selector with a "Size guide" modal.
- Price: compare-at + savings badge in Antique Gold or Terracotta — understated, not a blinking discount banner.
- Specs: structured accordion/table for metal, purity, gemstone, weight, dimensions (from metafields).
- Trust signals near buy box: certification/hallmark badge, secure checkout note, return policy, ship time.
- Care instructions in a collapsible accordion, not buried in the description.
- Cross-sell: "Complete the look" / "Pairs well with" via recommendations.

### Collection / browsing
- Filters: metal type, gemstone, price range, occasion (bridal, everyday, gifting), category.
- Sort: price, newest, bestseller.
- Product card: image with hover-swap second angle, name, price, 1–2 key attributes ("14k Gold · Diamond"), quick-add/wishlist icon.
- Consider a "shop by category" visual nav (rings, necklaces, earrings, bracelets) near the top.

### Trust & conversion sitewide
- Reviews/ratings on product cards and product pages.
- Instagram/UGC feed section.
- Testimonials in Cormorant Garamond quote / Lato attribution.
- Calm, on-brand sale banners — no neon/urgent styling.
- Wishlist icon on cards and product page (long consideration cycle for jewelry).

### Cart & checkout
- Mini-cart drawer, not full-page redirect.
- Gift-wrapping / gift-note option where applicable.
- Reassurance microcopy near checkout: secure payment, free returns, authenticity guarantee.
