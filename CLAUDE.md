# Reply Y'all

Phone web game for a hackathon. Due October 30, 2026.

Live: https://jasondag-ai.github.io/reply-yall/
Repo: https://github.com/jasondag-ai/reply-yall

## Pitch

You're the intern. Emails arrive. Tap Reply, Reply All, Forward, or Archive before the timer ends. Wrong call = HR disaster.

Tone: Southern office humour with dry "bless your heart" energy. Never corny.

## Rules

- iPhone portrait first. Design and check at 390x844. No sideways scroll.
- Big thumb targets (60px tall buttons, see `--tap`). Primary actions sit low on the screen.
- No backend. Saved data goes in localStorage only.
- Minimal dependencies. No framework. Ask before adding a runtime dependency.
- Content is separate from the engine. Player-facing text and email data live in `src/content`. Game rules live in `src/engine` and never touch the DOM.
- Honor `prefers-reduced-motion`.
- No em dashes in game text. A test enforces this for everything in `src/content/strings.ts`.

## Brand tokens

Defined in `src/styles/tokens.css`. Use the variables, never raw hex values.

| Token | Value |
| --- | --- |
| `--ink` | `#1B1F24` |
| `--paper` | `#F4F1EA` |
| `--card` | `#FFFFFF` |
| `--muted` | `#6B7280` |
| `--line` | `#E5E1D8` |
| `--accent` | `#2F6FED` |
| `--danger` | `#D94841` |
| `--warn` | `#C9851A` |
| `--safe` | `#2F7D4F` |
| `--hr` | `#5B3A8F` |

Fonts (self-hosted through `@fontsource`, Latin subset, imported in `src/main.ts`):

- IBM Plex Sans: UI (`--font-ui`)
- IBM Plex Serif: headlines (`--font-headline`)
- IBM Plex Mono: timestamps (`--font-mono`)

## Stack

TypeScript + Vite (vanilla), Vitest. Vite `base` is `/reply-yall/`.

```
npm run dev        local dev server
npm test           run tests once
npm run build      typecheck, then build to dist/
npm run preview    serve the built site
```

## Layout

```
src/main.ts        entry: fonts, styles, mount
src/content/       player-facing text and data
src/engine/        pure game rules (starts in Milestone 2)
src/ui/            DOM screens and the screen switcher
src/styles/        tokens, base, screens
```

## Deploy

`.github/workflows/deploy.yml` runs tests, builds, and deploys to GitHub Pages on every push to `main`. A failing test blocks the deploy.

## Milestones

1. Live skeleton: title screen, placeholder screen, CI deploy. Done.
