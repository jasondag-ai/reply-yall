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

## Game rules

- Success: +100, streak +1. Shows a toast with the outcome line.
- Awkward: +25, streak resets. Shows a toast with the outcome line.
- Disaster, or the timer running out: the run ends. Disaster screen, then Game Over.
- Timer: `max(3000, email.timerMs - 500 * emailsAnswered)`. Every email has `timerMs: 8000`, so a run goes 8s, 7.5s, 7s, down to a 3s floor.
- First pass plays the emails in file order. After that the deck reshuffles forever and never opens with the email just played.
- The clock stops while a toast is up. The toast lasts longer for longer lines; a tap anywhere skips it.
- Best score is saved in localStorage under `reply-yall-best`.

Rules live in `src/engine/game.ts`.

## Email schema

`src/content/emails.ts`. Each email is a setup, a trap, and a punchline.

```
id        unique slug
subject
from      { name, detail }   detail is a role or an address
to[]      pill labels
cc[]      pill labels, may be empty
body      1 to 3 lines separated by \n
timerMs   8000
actions   reply, replyAll, forward, archive: { result, line }
          result is success | awkward | disaster; line is the one-line outcome
```

Every email needs at least one success and one disaster. Tests in `src/content/emails.test.ts` enforce the schema.

## Test flags

- `?email=3` starts on the third email.
- `?slow=1` makes every timer 30s.

## Stack

TypeScript + Vite (vanilla), Vitest, Playwright. Vite `base` is `/reply-yall/`.

```
npm run dev        local dev server
npm test           unit tests
npm run test:e2e   build, then play the game with touch in iPhone emulation (WebKit + Chromium)
npm run build      typecheck, then build to dist/
npm run preview    serve the built site
```

Run the touch tests against the live site:

```
BASE_URL=https://jasondag-ai.github.io/reply-yall/ npx playwright test
```

## Layout

```
src/main.ts        entry: fonts, styles, mount
src/content/       player-facing text and email data
src/engine/        pure game rules and URL flags
src/ui/            one file per screen, plus the screen switcher (app.ts)
src/styles/        tokens, base, screens
e2e/               Playwright touch tests
```

## Motion

Animations run 150 to 280ms. The global rule in `src/styles/base.css` turns them all off under `prefers-reduced-motion`, and the timer strip steps every half second instead of sliding.

## Deploy

`.github/workflows/deploy.yml` runs unit tests, builds, runs the touch tests, and deploys to GitHub Pages on every push to `main`. A failing test blocks the deploy.

## Milestones

1. Live skeleton: title screen, placeholder screen, CI deploy. Done.
2. Playable loop: 5 emails, timer, scoring, disaster, game over, rematch. Done.
