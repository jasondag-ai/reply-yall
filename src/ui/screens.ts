import { strings } from '../content/strings'

export type ScreenName = 'title' | 'placeholder'
export type Go = (to: ScreenName) => void

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

function button(label: string, className: string, onTap: () => void): HTMLButtonElement {
  const node = el('button', className, label)
  node.type = 'button'
  node.addEventListener('click', onTap)
  return node
}

function titleScreen(go: Go): HTMLElement {
  const s = strings.title
  const screen = el('main', 'screen screen-title')

  const card = el('section', 'card')
  const meta = el('div', 'card-meta')
  meta.append(el('span', 'unread-dot'), el('span', 'meta-to', s.to), el('time', 'meta-time', s.time))
  card.append(meta, el('h1', 'headline headline-xl', s.name), el('p', 'tagline', s.tagline))

  const actions = el('div', 'actions')
  actions.append(button(s.start, 'btn btn-primary', () => go('placeholder')))

  screen.append(card, actions)
  return screen
}

function placeholderScreen(go: Go): HTMLElement {
  const s = strings.placeholder
  const screen = el('main', 'screen screen-placeholder')

  const card = el('section', 'card')
  const meta = el('div', 'card-meta')
  meta.append(el('time', 'meta-time', s.time))
  card.append(meta, el('h1', 'headline', s.heading), el('p', 'tagline', s.body))

  const actions = el('div', 'actions')
  actions.append(button(s.back, 'btn btn-quiet', () => go('title')))

  screen.append(card, actions)
  return screen
}

export const screens: Record<ScreenName, (go: Go) => HTMLElement> = {
  title: titleScreen,
  placeholder: placeholderScreen,
}
