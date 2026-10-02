import { strings } from '../content/strings'
import { formatTime } from '../engine/game'
import { button, el } from './dom'
import type { RunSummary, Screen } from './screen'

function stat(label: string, value: string, id: string): HTMLElement {
  const row = el('div', 'stat')
  const dd = el('dd', 'stat-value', value)
  dd.dataset.stat = id
  row.append(el('dt', 'stat-label', label), dd)
  return row
}

export function gameOverScreen(summary: RunSummary, onRematch: () => void): Screen {
  const s = strings.gameOver
  const node = el('main', 'screen screen-gameover')

  const card = el('section', 'card card-centered')
  const stats = el('dl', 'stats')
  const best = stat(s.best, String(summary.best), 'best')
  if (summary.newBest) best.querySelector('dt')!.append(el('span', 'badge', s.newBest))
  stats.append(
    stat(s.time, formatTime(summary.survivedMs), 'time'),
    stat(s.score, String(summary.score), 'score'),
    best,
  )
  card.append(el('h1', 'headline', s.heading), el('p', 'tagline', s.tagline), stats)

  const actions = el('div', 'actions')
  actions.append(button(s.rematch, 'btn btn-primary', onRematch))

  node.append(card, actions)
  return { node }
}
