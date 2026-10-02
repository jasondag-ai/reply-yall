import type { ActionId } from '../content/emails'

const PATHS: Record<ActionId, string> = {
  reply: '<path d="M10 7 4 12l6 5"/><path d="M4 12h10a6 6 0 0 1 6 6v1"/>',
  replyAll:
    '<path d="M8 7 2 12l6 5"/><path d="M13 7 7 12l6 5"/><path d="M7 12h9a6 6 0 0 1 6 6v1"/>',
  forward: '<path d="m14 7 6 5-6 5"/><path d="M20 12H10a6 6 0 0 0-6 6v1"/>',
  archive: '<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"/><path d="M10 13h4"/>',
}

export function icon(action: ActionId): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('aria-hidden', 'true')
  svg.classList.add('icon')
  svg.innerHTML = PATHS[action]
  return svg
}
