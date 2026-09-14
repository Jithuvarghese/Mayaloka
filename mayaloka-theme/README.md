# Shopify Jewelry Store — Multi-Tool AI Instructions

A drop-in instruction set for Cursor, Claude Code, Codex, and GitHub Copilot, tuned for a luxury jewelry Shopify theme build (brand kit: Terracotta / Powder Sky / Antique Gold + Playfair Display / Cormorant Garamond / Lato).

One canonical file (`AGENTS.md`) holds the actual content; the rest are thin, tool-specific wrappers so you only maintain the brand kit and conventions in one place.

## Install

Copy everything into the root of your Shopify theme repo (same level as `sections/`, `snippets/`, `templates/`, `config/`), then reload/restart whichever tool you're using.

```
your-theme-repo/
├── AGENTS.md                    ← canonical source of truth — edit this first
├── CLAUDE.md                    ← imports AGENTS.md for Claude Code (terminal or VS Code extension)
├── .cursor/
│   └── rules/
│       ├── 00-brand-kit.mdc          ← always active
│       ├── 10-shopify-liquid.mdc     ← active on .liquid / .json / sections / snippets / templates
│       ├── 20-css-styling.mdc        ← active on .css / .scss
│       └── 30-jewelry-commerce-ux.mdc← active when building product/collection/cart features
├── .github/
│   └── copilot-instructions.md  ← only needed for plain GitHub Copilot in VS Code — delete if unused
├── sections/
├── snippets/
├── templates/
└── ...
```

## Which file does what, per tool

| Tool | File it reads | Notes |
|---|---|---|
| **Codex** | `AGENTS.md` | Native format. Reads the nearest `AGENTS.md` up the directory tree; discovered automatically. |
| **Claude Code** (terminal or VS Code extension) | `CLAUDE.md` → imports `AGENTS.md` | The `@AGENTS.md` line inlines the full content — no duplication to maintain. |
| **Cursor** | `.cursor/rules/*.mdc` (falls back to `AGENTS.md` if present) | The `.mdc` files are more granular — each only loads when you're editing a matching file type, which keeps token usage down for the brand-kit-always-on / Liquid-only / CSS-only splits. |
| **GitHub Copilot in VS Code** | `.github/copilot-instructions.md` | Only relevant if you use plain Copilot chat/completions. If "VS Code" for you just means running the Claude Code or Cursor extension inside VS Code, this file is redundant — delete it. |

## Customizing

- Change hex values, fonts, or conventions in **`AGENTS.md` only** — `CLAUDE.md` pulls from it automatically, and `.github/copilot-instructions.md` is a manual mirror (Copilot has no import mechanism, so re-copy the relevant section if you edit `AGENTS.md` and also use Copilot).
- The `.cursor/rules/*.mdc` files are intentionally self-contained (Cursor's glob-scoping is the reason to keep them separate) — if you change the brand kit, update `00-brand-kit.mdc` to match `AGENTS.md`.
- Add a new `.mdc` file (e.g. `40-blog-content.mdc`) or a new `AGENTS.md` section for any other recurring pattern you find yourself re-explaining — keep additions scoped to one concern.
