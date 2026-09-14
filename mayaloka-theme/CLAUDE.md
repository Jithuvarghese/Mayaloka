# CLAUDE.md

@AGENTS.md

## Claude Code-specific notes

- The import above pulls in the full brand kit, Shopify theme architecture, CSS, and jewelry UX conventions from `AGENTS.md` — edit that file, not this one, to change the substance.
- If you later want Claude Code to load rules conditionally by file type (like the Cursor setup does), split pieces of `AGENTS.md` into `.claude/rules/*.md` and this file will pick them up automatically alongside the import — not necessary for a repo this size, but an option as the theme grows.
- Run `/memory` to check what Claude Code has already inferred about this repo on its own, so you don't duplicate that into `AGENTS.md`.
