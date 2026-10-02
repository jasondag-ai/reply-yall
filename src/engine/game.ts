// Pure game rules. No DOM, no content imports.

export const SCORE_SUCCESS = 100
export const SCORE_AWKWARD = 25
export const TIMER_STEP_MS = 500
export const TIMER_FLOOR_MS = 3000
export const SLOW_TIMER_MS = 30000

export type Rng = () => number

export interface Run {
  score: number
  streak: number
  /** Emails survived so far. Drives the speed-up. */
  answered: number
  /** Email indexes in play order for the current pass. */
  deck: number[]
  pos: number
}

/** Time for the next email: the base drops 0.5s per email answered, never below 3s. */
export function timerMsFor(baseMs: number, answered: number): number {
  return Math.max(TIMER_FLOOR_MS, baseMs - TIMER_STEP_MS * answered)
}

/** First pass runs in authored order, beginning at startIndex. */
export function newRun(count: number, startIndex = 0): Run {
  const order = Array.from({ length: count }, (_, i) => i)
  const deck = [startIndex, ...order.filter((i) => i !== startIndex)]
  return { score: 0, streak: 0, answered: 0, deck, pos: 0 }
}

export function currentIndex(run: Run): number {
  return run.deck[run.pos]
}

/** Fisher-Yates. The new pass never opens with the email just played. */
export function reshuffle(count: number, last: number, rng: Rng): number[] {
  const deck = Array.from({ length: count }, (_, i) => i)
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  if (deck.length > 1 && deck[0] === last) [deck[0], deck[1]] = [deck[1], deck[0]]
  return deck
}

/** Score a survived email and move to the next one. Disasters end the run instead. */
export function applyResult(run: Run, result: 'success' | 'awkward', rng: Rng): Run {
  const success = result === 'success'
  const last = currentIndex(run)
  const endOfPass = run.pos + 1 >= run.deck.length
  return {
    score: run.score + (success ? SCORE_SUCCESS : SCORE_AWKWARD),
    streak: success ? run.streak + 1 : 0,
    answered: run.answered + 1,
    deck: endOfPass ? reshuffle(run.deck.length, last, rng) : run.deck,
    pos: endOfPass ? 0 : run.pos + 1,
  }
}

/** 83400 -> "1:23" */
export function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}
