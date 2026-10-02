import { strings } from '../content/strings'
import { button, el } from './dom'
import type { RunSummary, Screen } from './screen'

export function disasterScreen(summary: RunSummary, onContinue: () => void): Screen {
  const s = strings.disaster
  const node = el('main', 'screen screen-disaster')

  const cause =
    summary.cause === 'timeout'
      ? s.timeoutCause
      : `${s.tapped} ${strings.game.actions[summary.cause]}`

  const content = el('div', 'disaster-content')
  content.append(
    el('h1', 'stamp', s.stamp),
    el('p', 'disaster-cause', cause),
    el('p', 'disaster-line', summary.outcome),
  )

  const actions = el('div', 'actions')
  actions.append(button(s.next, 'btn btn-on-wash', onContinue))

  node.append(content, actions)
  return { node, wash: 'hr' }
}
