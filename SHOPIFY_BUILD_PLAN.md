g# Mayaloka — Shopify Build Plan (based on demo3 / V3 Bazaar Collage)

**Status:** Planning document. Nothing below has been implemented yet.
**Base variant:** `demo-v3` (bazaar collage-forward) is the design direction being carried into the real Shopify build.

---

## 1. Tech stack decision: Liquid, not React

**Recommendation: standard Shopify Online Store 2.0 theme — Liquid + vanilla CSS/JS.** Not React, not Hydrogen.

| | Liquid theme (recommended) | React / Hydrogen (headless) |
|---|---|---|
| Merchant can self-edit via theme editor | Yes — drag/drop sections, edit text, swap images, no code | No — content changes need a developer + redeploy |
| Hosting | Shopify hosts everything, included in plan | You manage separate hosting (Vercel/Oxygen) + a storefront API layer |
| Checkout | Shopify's native hosted checkout, styled via Branding editor | Same underlying checkout, but far more setup to wire up |
| Time to build | Faster — theme conventions, existing sections to extend | Slower — building a storefront from scratch on the Storefront API |
| Right fit for | A single storefront, client who wants day-to-day control | Multi-channel/composable commerce, dedicated dev team long-term |

Given the earlier conversation about the client adding their own products and not wanting heavy ongoing maintenance, **Liquid is the correct choice** — it's also what "self-serve via theme editor" depends on. Hydrogen would reopen the maintenance-burden problem we were trying to avoid.

### 1.1 Dawn vs. scratch — and how edits actually reach the live store

**Recommendation: still start from Dawn, not from scratch — even though you already have a Shopify account and a landing page.** Reasoning:

- **"From scratch" in Shopify doesn't mean an empty file** — every theme still needs Shopify's plumbing: cart AJAX API, section/block schema, `{% schema %}` JSON, Liquid objects for products/collections/customers, accessibility scaffolding (skip links, ARIA on cart drawer/modals), responsive image handling (`srcset`, Shopify CDN transforms). Dawn already has all of this, tested and maintained by Shopify. Building it from nothing means re-solving problems Dawn already solved — slower, and higher risk of subtle bugs (broken cart AJAX, bad Lighthouse score, accessibility gaps).
- **Your existing landing page is not lost** — it stays live on its current theme (or a duplicate of it) while we build the new one in parallel, unpublished, and only switch over when it's ready. Nothing about starting from Dawn touches what's currently published.
- **"Starting from scratch" only makes sense if** you want zero Shopify theme conventions and a fully custom/headless setup (Hydrogen) — which we already ruled out above for the maintenance reason.

**How this actually connects to "here" (this coding environment):**

1. You (or I, once authenticated) install the **Shopify CLI** and run `shopify theme init` with the Dawn template — this pulls Dawn's source files into a local folder in this repo, e.g. `/shopify-theme`.
2. That folder is then edited exactly like any other codebase here — I read/write the Liquid, CSS, JS files directly, same as the HTML mockups so far.
3. **Two ways changes reach your live Shopify store:**
   - **Dev preview (for review, not live):** `shopify theme dev` starts a local server that proxies your real store's data (products, cart, checkout) through the local theme files, giving you a shareable preview URL to click through and approve changes — nothing customers see is affected.
   - **Push as an unpublished theme:** `shopify theme push` uploads the local theme to your store's **Theme Library** as a new, unpublished theme. You (or I, with permission) can preview it fully in the Shopify admin, and only **you** click "Publish" when it's ready to go live — this is the same "confirm before anything visible/shared changes" boundary as pushing to a shared git branch.
4. **Authentication, concretely:** `shopify theme dev`/`push` needs to authenticate to your store. Either you run `shopify login` once in this environment (interactive browser OAuth, one-time), or you create a **custom app** in Shopify admin and give me its Admin API token. Either way, this is a one-time setup step from your side — I can't complete Shopify's OAuth flow without your browser.
5. Regular theme edits after that are just normal git-style iteration: edit files here → `shopify theme dev` to preview → you review → `shopify theme push` when approved → you publish in admin when ready.

So: **Dawn as the base, edited directly in this repo, connected to your real store via Shopify CLI, nothing goes live until you publish it.** Your current landing page is unaffected until that final publish step.

**Concretely for demo3 → Dawn:** the custom sections (hero, collection rail, philosophy quote, etc.) get rebuilt as Liquid sections with schema so they're editable blocks, matching the demo3 layout and motifs (with the confirmed font/palette updates applied).

---

## 2. Design system updates required before/while building

### 2.1 Typeface — swap to Playfair Display

Current demo3 uses **Fraunces** (display), **Inter** (body), **Special Elite** (labels/stamps). New requirement: **Playfair Display** (Claus Eggers Sørensen) as the display face.

- Replace `Fraunces` → `Playfair Display` for all headings, the logo wordmark, hero type, and section headers (`h1`, `h2`, `h3`, `.logo`, `.signature`, blockquote/philosophy text).
- Decide whether **Special Elite** (typewriter/stamp look) stays for labels/badges/ticker, or also gets replaced — it's not addressed by the new font request, so default to **keeping it** unless told otherwise, since it's a distinct usage (labels, not headlines) and still reads as "old bazaar."
- Body copy (`Inter`) is unaffected — the request only names a display face.
- Swap the Google Fonts `<link>` and CSS `font-family` declarations; verify weight availability (Playfair Display ships regular/medium/semibold/bold + italics — confirm which weights the mockup needs, likely 500/600/700 + italic for the emotional headline lines, mirroring how Fraunces italic is used today).

### 2.2 Color palette — does NOT currently match; needs a real swap

Checked the four new brand colors against demo3's live CSS variables — **none match**:

| Role | New spec | Current demo3 | Verdict |
|---|---|---|---|
| Background | `#FFFFFF` (white/cream) | `--cream:#EFE3C7`, `--paper:#E7D9B8` (warm tan/parchment) | **Keep as-is** (per decision below) |
| Primary text/border (maroon) | `#801F1F` (oxblood) | `--maroon:#A6392C` (burnt orange-red) | **Keep as-is** |
| Accent (sky/teal) | `#75C5F4` (light sky blue) | `--navy:#17384A` (dark navy) | **Replace** — this is the only value changing |
| Accent (gold/tan) | `#C5B069` (muted gold-tan) | `--gold:#C08A34` (saturated amber-gold) | **Keep as-is** |

**Decision (confirmed):** Only the blue/navy role changes. `--navy:#17384A` → `#75C5F4` (and `--navy-dark` derives a darker shade of the new sky blue for the same relative contrast the current navy-dark has to navy). Maroon, gold, and cream/paper stay exactly as they are today — this is a targeted accent swap, not a full re-skin. Much smaller-risk change than initially flagged; the "old bazaar at dusk" warm palette is preserved, just with the dark-navy accent lightened to sky blue.

Note: swapping a *dark* navy for a *light* sky blue changes contrast behavior everywhere navy was used as a background (ticker, footer, philosophy band, header border) — those sections currently rely on navy being dark enough for light/cream text on top. Each of those needs a per-case check: either the sky blue becomes a background with dark text instead, or it's used as a border/accent color rather than a fill, depending on the section. Flagging this now so it's handled deliberately per-section rather than applied as a blind find-and-replace.

### 2.3 New menu item — Mombatti (sellable, same store)

**Decision (confirmed):** Mombatti is under the same Mayaloka umbrella — sold directly in the Shopify store, not an outbound link or third-party marketplace integration. Gets its **own top-level nav item**, separate from the main jewellery nav.

Implementation:
- Create a **Mombatti Collection** in the same Shopify store (candles / scented candles / hampers / corporate gifting / celebratory gifting, per the Instagram bio)
- Add a dedicated **nav menu item** ("Mombatti" or "Mombatti Candles") pointing to that collection — kept visually/structurally distinct from the main jewellery categories in the nav (e.g. its own dropdown, or a visual separator), since it's a different product line under the same brand
- Products get tagged/typed so the Mombatti PLP can use its own filtering (candle-relevant attributes like scent/size differ from jewellery's material/size)
- Optional: a landing section or mini "About Mombatti" blurb, since it's a distinct sub-brand — decide when we get to that screen; not required for Phase 1
- The `instagram.com/mombatti_g` link itself still gets used (as a social/follow icon, e.g. in the footer or an "as seen on Instagram" nod) but is no longer the primary path to purchase — purchase happens on-site

This keeps it simple: no multi-vendor app, no commission/fulfillment complexity — it's just a second product line in the same store, presented as its own section.

### 2.4 Responsive nav — sidebar drawer on small screens

Requirement: on smaller screens, the menu becomes a **sidebar** (not the usual hamburger-dropdown), styled to match the rest of the design system (same fonts/colors/motifs as desktop nav).

- Slide-in drawer from left or right (matches the "collapsible sidebar" pattern already built for V4 split-screen — same interaction idea, different context)
- Contains: all primary nav links, the new Mombatti link, search/account/cart icons, close button
- Trigger: hamburger icon in the mobile header
- Must reuse the same type/color tokens so it doesn't look like a bolted-on generic mobile menu

---

## 3. Screen inventory & build phases

### Phase 1 — Core storefront (highest priority, "working store" threshold)
1. **Home** — ✅ Built. 8 custom Liquid sections matching Demo3.png exactly (hero w/ signboard frame, ticker, story, collection grid, philosophy band, product grid, press, newsletter), wired into `templates/index.json`. Editable via theme editor.
2. **Shop / PLP** — ✅ Already provided by Horizon (`templates/collection.json`), fully block-based (filters, sort, grid density, product cards). Restyled via `scheme-1` to Mayaloka's cream/ink/maroon palette. No custom rebuild needed — verified rendering clean.
3. **Product Details (PDP)** — ✅ Already provided by Horizon (`templates/product.json`) — gallery, variant picker, buy buttons, description, "You may also like" recommendations. Inherits `scheme-1` brand colors + Playfair Display headings automatically. Size/material guide accordions and reviews are Phase 3 additions (see below), not blocking.
4. **Collections** — ✅ Reuses the same PLP component (`main-collection`), already branded.
5. **Search Results** — ✅ Already provided by Horizon (`templates/search.json`), verified rendering clean, brand colors applied.
6. **Wishlist** — not in Horizon by default; needs either a wishlist app (simplest) or custom metafield-based build. Not started — flagged for a decision.
7. **Shopping Cart** — ✅ Already provided by Horizon (`templates/cart.json`), drawer + full page both included, branded via `scheme-1`. Gift wrap toggle is Phase 3.
8. **Checkout** — Shopify-hosted, styled via Branding editor (not custom-coded) — not started, needs to be done in Shopify admin directly (Settings → Checkout → Branding), not theme code.
9. **Login / Sign Up + OTP + password reset** — **Not a theme-code task.** Modern Shopify stores use hosted **Customer Accounts** (separate from the theme entirely) for login/signup/OTP/password reset. This is a store-level setting (Settings → Customer accounts in Shopify admin) plus a **Customer Accounts branding editor** (separate from theme branding) for colors/logo/fonts. Confirm `customer_accounts_enabled` is on and do the branding pass there — not a Liquid build.
10. **Account Dashboard** — same as above: part of Shopify's hosted Customer Accounts, not theme templates.
11. **Order History & Tracking** — same as above: part of hosted Customer Accounts.

### Phase 2 — Brand & content
12. **About Us / Our Story** — theme template (`page.json`) ready and branded; the actual page needs to be created in Shopify admin (Online Store → Pages) with content, same as any store page. Not a code task once content exists.
13. **Contact Us** — ✅ Already exists (`templates/page.contact.json`), branded, verified rendering clean.
14. **Blog / Style Guide (Journal)** — ✅ Already exists (`templates/blog.json` + `article.json`), verified rendering clean at `/blogs/news` with brand colors. Content (posts) still needs writing.
15. **Store Locator** — still an open question (only relevant if there's a physical location).

### Phase 3 — Secondary scope (from your list)
Category pages, filters, product gallery, size/material/care guides, reviews, shipping & payment screens, order confirmation, profile, saved addresses, notifications, rewards, gift cards, FAQs, shipping policy, return/refund policy, privacy policy, terms & conditions, empty states, 404/error page, maintenance page.

Most of these are lightweight Liquid templates once Phase 1's component patterns (product card, section header, form styling) exist — they're additive, not individually complex. 404 already verified working and branded. Policy pages (shipping/returns/privacy/terms) are usually auto-generated by Shopify from Settings → Policies — need to be filled in there, not built as custom templates.

**Wishlist app decision needed:** Horizon has no built-in wishlist. Recommend a lightweight wishlist app (e.g. from the Shopify App Store) over a custom build, to avoid maintaining bespoke metafield/customer-data logic — flagging as a scope decision for you rather than assuming.

---

## 4. Sequencing recommendation

1. **Confirm palette + Mombatti scope decisions above** (cheap now, expensive to redo later)
2. Set up Shopify store + Shopify CLI theme dev connection (needs you — account/billing, as discussed)
3. Rebuild demo3's homepage as a real Dawn-based Liquid theme with the updated font/palette/nav — this becomes the pattern library (section schema, card components, color tokens as theme settings) for every later screen
4. Build Phase 1 screens in order — this is the "working store" milestone
5. Build Phase 2, then Phase 3 screens incrementally
6. Content pass: real product photography, copy for policy/empty-state pages (flagged previously as something only you/client can supply)
7. QA pass: responsive check (including the new sidebar nav), accessibility (contrast — note the new sky blue on white needs an AA contrast check, especially for links/text use, not just backgrounds), checkout branding review
8. Handoff: theme editor walkthrough for the client (ties back to the earlier maintenance discussion)

---

## 5. Open questions before implementation starts

- [x] Palette — only navy→sky blue changes; maroon/gold/cream stay as-is. *(Confirmed against the HTML mockups. Superseded below for the real Shopify build.)*
- [x] **Real Shopify theme palette (revised):** the live theme's actual color settings don't contain a navy token to swap — the blue seen on the current landing page is part of the hero photo, not a CSS/theme variable. Decision: apply the 4-color palette (maroon `#801F1F`, sky blue `#75C5F4`, gold `#C5B069`, white/cream) to *new* elements as they're built (header nav colors, Mombatti section, sidebar) rather than "swapping" something that doesn't exist yet.
- [x] Playfair Display — applied to the `heading` font role in `config/settings_data.json` (`type_heading_font`, drives h1–h4). `subheading`/`body`/`accent` roles left on Inknut Antiqua for now, unless told otherwise.
- [x] Mombatti — same-store, sellable, own nav section. *(Confirmed.)*
- [ ] Store Locator — is there a physical store, or should this be dropped from Phase 2?
- [ ] Shopify plan tier — you have an account + landing page already; confirm current plan tier (Basic is sufficient; Plus only needed for fully custom checkout)
