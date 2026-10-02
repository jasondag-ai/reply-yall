import { emails } from '../content/emails'
import { parseFlags } from '../engine/flags'
import { loadBest, saveBest } from './best'
import { disasterScreen } from './disaster'
import { gameScreen } from './game'
import { gameOverScreen } from './gameover'
import type { RunEnd, RunSummary, Screen } from './screen'
import { titleScreen } from './title'

export function mount(root: HTMLElement): void {
  const flags = parseFlags(window.location.search, emails.length)
  const themeColor = document.querySelector('meta[name="theme-color"]')
  let current: Screen | undefined

  const show = (screen: Screen, focus = true): void => {
    current?.dispose?.()
    current = screen
    root.replaceChildren(screen.node)
    window.scrollTo(0, 0)

    // Colour the page and the iOS status bar area to match the screen.
    document.documentElement.classList.toggle('wash-hr', screen.wash === 'hr')
    const style = getComputedStyle(document.documentElement)
    themeColor?.setAttribute('content', style.getPropertyValue(screen.wash ? '--hr' : '--paper').trim())

    if (focus) {
      // Move focus to the new screen's heading so screen readers announce it.
      const heading = screen.node.querySelector<HTMLElement>('h1')
      heading?.setAttribute('tabindex', '-1')
      heading?.focus({ preventScroll: true })
    }
  }

  const finish = (end: RunEnd): void => {
    const previous = loadBest()
    const newBest = end.score > previous
    if (newBest) saveBest(end.score)
    const summary: RunSummary = { ...end, best: Math.max(previous, end.score), newBest }
    show(disasterScreen(summary, () => show(gameOverScreen(summary, play))))
  }

  const play = (): void => show(gameScreen({ flags, onEnd: finish }))

  show(titleScreen(play), false)
}
