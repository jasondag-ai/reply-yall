import { strings } from '../content/strings'
import { button, el } from './dom'
import type { Screen } from './screen'

export function titleScreen(onStart: () => void): Screen {
  const s = strings.title
  const node = el('main', 'screen screen-title')

  const card = el('section', 'card card-centered')
  const meta = el('div', 'card-meta')
  meta.append(el('span', 'unread-dot'), el('span', 'meta-to', s.to), el('time', 'meta-time', s.time))
  card.append(meta, el('h1', 'headline headline-xl', s.name), el('p', 'tagline', s.tagline))

  const actions = el('div', 'actions')
  actions.append(button(s.start, 'btn btn-primary', onStart))

  node.append(card, actions)
  return { node }
}
