import { screens, type ScreenName } from './screens'

export function mount(root: HTMLElement): void {
  const show = (name: ScreenName, focus: boolean): void => {
    const screen = screens[name]((to) => show(to, true))
    root.replaceChildren(screen)
    window.scrollTo(0, 0)
    if (focus) {
      // Move focus to the new screen's heading so screen readers announce it.
      const heading = screen.querySelector<HTMLElement>('h1')
      heading?.setAttribute('tabindex', '-1')
      heading?.focus({ preventScroll: true })
    }
  }
  show('title', false)
}
