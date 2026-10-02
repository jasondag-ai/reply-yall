import { ACTION_IDS, emails, type ActionId, type Email, type Outcome } from '../content/emails'
import { strings } from '../content/strings'
import type { Flags } from '../engine/flags'
import { SLOW_TIMER_MS, applyResult, currentIndex, newRun, timerMsFor } from '../engine/game'
import { button, el, prefersReducedMotion } from './dom'
import { icon } from './icons'
import type { Cause, RunEnd, Screen } from './screen'

/** The toast stays long enough to read its line, then the next email arrives. */
const toastMs = (line: string): number => Math.max(2200, 900 + 32 * line.length)
/** Taps this soon after a choice don't skip the toast, so a double tap can't eat it. */
const TOAST_GUARD_MS = 350
const SHAKE_MS = 260
/** Longest step the clock takes in one frame, so a backgrounded tab doesn't burn the timer. */
const MAX_FRAME_MS = 250

function pillRow(label: string, names: readonly string[]): HTMLElement {
  const row = el('div', 'pill-row')
  row.append(el('span', 'pill-label', label))
  for (const name of names) row.append(el('span', 'pill', name))
  return row
}

function emailCard(email: Email): { card: HTMLElement; fill: HTMLElement } {
  const s = strings.game
  const card = el('section', 'card email')
  card.dataset.email = email.id

  const from = el('div', 'email-from')
  const who = el('div', 'email-who')
  who.append(el('span', 'from-name', email.from.name), el('span', 'from-detail', email.from.detail))
  from.append(el('span', 'avatar', email.from.name.charAt(0)), who)

  const pills = el('div', 'pills')
  pills.append(pillRow(s.to, email.to))
  if (email.cc.length > 0) pills.append(pillRow(s.cc, email.cc))

  const timer = el('div', 'timer')
  timer.setAttribute('role', 'img')
  timer.setAttribute('aria-label', s.timer)
  const fill = el('div', 'timer-fill')
  timer.append(fill)

  const body = el('div', 'email-body')
  for (const line of email.body.split('\n')) body.append(el('p', '', line))

  card.append(from, pills, el('h1', 'subject', email.subject), timer, body)
  return { card, fill }
}

export function gameScreen(opts: { flags: Flags; onEnd: (end: RunEnd) => void }): Screen {
  const s = strings.game
  const reduced = prefersReducedMotion()

  let run = newRun(emails.length, opts.flags.startIndex)
  let phase: 'playing' | 'toast' | 'ending' = 'playing'
  let email = emails[currentIndex(run)]
  let limitMs = 0
  let remainingMs = 0
  let survivedMs = 0
  let lastFrame = 0
  let raf = 0
  let wait = 0
  let toastAt = 0
  let card: HTMLElement
  let fill: HTMLElement

  const node = el('main', 'screen screen-game')

  const hud = el('header', 'hud')
  const score = el('span', 'hud-value', '0')
  const streak = el('span', 'hud-value', '0')
  const scoreBox = el('div', 'hud-item')
  scoreBox.append(el('span', 'hud-label', s.score), score)
  const streakBox = el('div', 'hud-item')
  streakBox.append(el('span', 'hud-label', s.streak), streak)
  hud.append(scoreBox, streakBox)

  const slot = el('div', 'card-slot')

  const toast = el('div', 'toast')
  toast.setAttribute('role', 'status')
  toast.hidden = true

  const bar = el('nav', 'action-bar')
  for (const action of ACTION_IDS) {
    const b = button('', 'action', () => choose(action))
    b.dataset.action = action
    b.append(icon(action), el('span', 'action-label', s.actions[action]))
    bar.append(b)
  }

  node.append(hud, slot, toast, bar)
  // During a toast, a tap anywhere moves on.
  node.addEventListener('click', () => {
    if (phase === 'toast' && performance.now() - toastAt > TOAST_GUARD_MS) nextEmail()
  })

  function paintTimer(): void {
    // With reduced motion the strip steps down every half second instead of sliding.
    const shown = reduced ? Math.ceil(remainingMs / 500) * 500 : remainingMs
    const frac = Math.max(0, Math.min(1, shown / limitMs))
    fill.style.transform = `scaleX(${frac})`
    fill.dataset.level = frac > 0.5 ? 'ok' : frac > 0.25 ? 'warn' : 'danger'
  }

  function frame(now: number): void {
    if (phase !== 'playing') return
    const dt = Math.min(now - lastFrame, MAX_FRAME_MS)
    lastFrame = now
    remainingMs -= dt
    survivedMs += dt
    paintTimer()
    if (remainingMs <= 0) end('timeout', strings.disaster.timeoutLine)
    else raf = requestAnimationFrame(frame)
  }

  function showEmail(): void {
    email = emails[currentIndex(run)]
    ;({ card, fill } = emailCard(email))
    slot.replaceChildren(card)
    toast.hidden = true
    bar.classList.remove('is-waiting')
    limitMs = opts.flags.slow ? SLOW_TIMER_MS : timerMsFor(email.timerMs, run.answered)
    remainingMs = limitMs
    paintTimer()
    phase = 'playing'
    lastFrame = performance.now()
    raf = requestAnimationFrame(frame)
  }

  function nextEmail(): void {
    window.clearTimeout(wait)
    showEmail()
  }

  function showToast(outcome: Outcome, points: number): void {
    const kind = outcome.result === 'success' ? 'success' : 'awkward'
    toast.className = `toast toast-${kind}`
    const head = el('div', 'toast-head')
    head.append(el('span', 'toast-kind', s.toast[kind]), el('span', 'toast-points', `+${points}`))
    toast.replaceChildren(head, el('p', 'toast-line', outcome.line))
    toast.hidden = false
  }

  function choose(action: ActionId): void {
    if (phase !== 'playing') return
    cancelAnimationFrame(raf)
    const outcome = email.actions[action]
    if (outcome.result === 'disaster') {
      end(action, outcome.line)
      return
    }
    const before = run.score
    run = applyResult(run, outcome.result, Math.random)
    score.textContent = String(run.score)
    streak.textContent = String(run.streak)
    showToast(outcome, run.score - before)
    bar.classList.add('is-waiting')
    phase = 'toast'
    toastAt = performance.now()
    wait = window.setTimeout(nextEmail, toastMs(outcome.line))
  }

  function end(cause: Cause, outcome: string): void {
    phase = 'ending'
    cancelAnimationFrame(raf)
    bar.classList.add('is-waiting')
    card.classList.add('shake')
    const result: RunEnd = { score: run.score, survivedMs, cause, outcome }
    wait = window.setTimeout(() => opts.onEnd(result), reduced ? 0 : SHAKE_MS)
  }

  showEmail()

  return {
    node,
    dispose: () => {
      phase = 'ending'
      cancelAnimationFrame(raf)
      window.clearTimeout(wait)
    },
  }
}
