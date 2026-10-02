import type { ActionId } from '../content/emails'

export interface Screen {
  node: HTMLElement
  /** Full-screen colour behind the screen, for the HR disaster. */
  wash?: 'hr'
  dispose?: () => void
}

export type Cause = ActionId | 'timeout'

/** How a run ended, as reported by the game screen. */
export interface RunEnd {
  score: number
  survivedMs: number
  cause: Cause
  outcome: string
}

export interface RunSummary extends RunEnd {
  best: number
  newBest: boolean
}
